// Hybrid Cloud (Supabase) + Local (IndexedDB) Database Service
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_CONFIG, INITIAL_MEMORIES, INITIAL_LETTERS } from './initialData';

const DB_NAME = 'KisahKitaScrapbookDB';
const DB_VERSION = 1;

// ==========================================
// 1. LOCAL INDEXED-DB CACHE (OFFLINE FALLBACK)
// ==========================================
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada browser ini.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('site_config')) {
        db.createObjectStore('site_config', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('memories')) {
        const memStore = db.createObjectStore('memories', { keyPath: 'id' });
        memStore.createIndex('date', 'date', { unique: false });
        memStore.createIndex('mood', 'mood', { unique: false });
      }
      if (!db.objectStoreNames.contains('letters')) {
        const letterStore = db.createObjectStore('letters', { keyPath: 'id' });
        letterStore.createIndex('dateWritten', 'dateWritten', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const executeLocalTx = async (storeName, mode, callback) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = callback(store);

      tx.oncomplete = () => resolve(request?.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaksi IndexedDB dibatalkan.'));
    });
  } catch (err) {
    console.warn('Local DB error:', err);
    return null;
  }
};

// ==========================================
// 2. SITE CONFIG CRUD (CLOUD + LOCAL)
// ==========================================
export const getConfig = async () => {
  // 1. Try Supabase Cloud
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'main')
        .maybeSingle();

      if (!error && data?.value) {
        // Cache locally
        await executeLocalTx('site_config', 'readwrite', store => store.put(data.value));
        return data.value;
      }

      // If cloud table exists but is empty, seed initial config
      if (!error && !data) {
        await supabase
          .from('site_config')
          .upsert({ key: 'main', value: INITIAL_CONFIG });
        await executeLocalTx('site_config', 'readwrite', store => store.put(INITIAL_CONFIG));
        return INITIAL_CONFIG;
      }
    } catch (err) {
      console.warn('Supabase getConfig fallback to local:', err);
    }
  }

  // 2. Fallback to Local IndexedDB
  try {
    const local = await executeLocalTx('site_config', 'readonly', store => store.get('main'));
    if (local) return local;

    await executeLocalTx('site_config', 'readwrite', store => store.put(INITIAL_CONFIG));
    return INITIAL_CONFIG;
  } catch (err) {
    return INITIAL_CONFIG;
  }
};

export const saveConfig = async (config) => {
  const cleanConfig = { ...config, key: 'main' };

  // Save to Supabase Cloud
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('site_config')
        .upsert({ key: 'main', value: cleanConfig });
    } catch (err) {
      console.warn('Supabase saveConfig error:', err);
    }
  }

  // Save to Local IndexedDB
  await executeLocalTx('site_config', 'readwrite', store => store.put(cleanConfig));
  return cleanConfig;
};

// ==========================================
// 3. MEMORIES CRUD (CLOUD + LOCAL)
// ==========================================
export const getMemories = async () => {
  // 1. Try Supabase Cloud
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        if (data.length > 0) {
          // Cache into local IndexedDB
          for (const m of data) {
            await executeLocalTx('memories', 'readwrite', store => store.put(m));
          }
          return data;
        } else {
          // Seed cloud with initial memories if completely empty
          for (const item of INITIAL_MEMORIES) {
            await supabase.from('memories').upsert(item);
            await executeLocalTx('memories', 'readwrite', store => store.put(item));
          }
          return INITIAL_MEMORIES;
        }
      }
    } catch (err) {
      console.warn('Supabase getMemories fallback to local:', err);
    }
  }

  // 2. Fallback to Local IndexedDB
  try {
    const local = await executeLocalTx('memories', 'readonly', store => store.getAll());
    if (local && local.length > 0) {
      return local.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    for (const mem of INITIAL_MEMORIES) {
      await executeLocalTx('memories', 'readwrite', store => store.put(mem));
    }
    return INITIAL_MEMORIES;
  } catch (err) {
    return INITIAL_MEMORIES;
  }
};

export const addMemory = async (memory) => {
  const newMem = {
    ...memory,
    id: memory.id || 'mem-' + Date.now(),
    createdAt: memory.createdAt || new Date().toISOString()
  };

  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('memories').insert(newMem);
    } catch (err) {
      console.warn('Supabase addMemory error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('memories', 'readwrite', store => store.put(newMem));
  return newMem;
};

export const updateMemory = async (memory) => {
  const updated = {
    ...memory,
    updatedAt: new Date().toISOString()
  };

  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('memories').upsert(updated);
    } catch (err) {
      console.warn('Supabase updateMemory error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('memories', 'readwrite', store => store.put(updated));
  return updated;
};

export const deleteMemory = async (id) => {
  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('memories').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteMemory error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('memories', 'readwrite', store => store.delete(id));
  return id;
};

export const updateMemoryPosition = async (id, corkboardPos) => {
  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('memories')
        .update({ corkboardPos })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase updateMemoryPosition error:', err);
    }
  }

  // Local IndexedDB
  const mem = await executeLocalTx('memories', 'readonly', store => store.get(id));
  if (mem) {
    mem.corkboardPos = corkboardPos;
    await executeLocalTx('memories', 'readwrite', store => store.put(mem));
  }
};

// ==========================================
// 4. LETTERS CRUD (CLOUD + LOCAL)
// ==========================================
export const getLetters = async () => {
  // 1. Try Supabase Cloud
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('dateWritten', { ascending: true });

      if (!error && data) {
        if (data.length > 0) {
          for (const l of data) {
            await executeLocalTx('letters', 'readwrite', store => store.put(l));
          }
          return data;
        } else {
          for (const letter of INITIAL_LETTERS) {
            await supabase.from('letters').upsert(letter);
            await executeLocalTx('letters', 'readwrite', store => store.put(letter));
          }
          return INITIAL_LETTERS;
        }
      }
    } catch (err) {
      console.warn('Supabase getLetters fallback to local:', err);
    }
  }

  // 2. Fallback to Local IndexedDB
  try {
    const local = await executeLocalTx('letters', 'readonly', store => store.getAll());
    if (local && local.length > 0) {
      return local;
    }
    for (const letter of INITIAL_LETTERS) {
      await executeLocalTx('letters', 'readwrite', store => store.put(letter));
    }
    return INITIAL_LETTERS;
  } catch (err) {
    return INITIAL_LETTERS;
  }
};

export const addLetter = async (letter) => {
  const newLetter = {
    ...letter,
    id: letter.id || 'let-' + Date.now(),
    createdAt: letter.createdAt || new Date().toISOString()
  };

  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('letters').insert(newLetter);
    } catch (err) {
      console.warn('Supabase addLetter error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('letters', 'readwrite', store => store.put(newLetter));
  return newLetter;
};

export const updateLetter = async (letter) => {
  const updated = {
    ...letter,
    updatedAt: new Date().toISOString()
  };

  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('letters').upsert(updated);
    } catch (err) {
      console.warn('Supabase updateLetter error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('letters', 'readwrite', store => store.put(updated));
  return updated;
};

export const deleteLetter = async (id) => {
  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('letters').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteLetter error:', err);
    }
  }

  // Local IndexedDB
  await executeLocalTx('letters', 'readwrite', store => store.delete(id));
  return id;
};

export const toggleLetterLock = async (id, isLocked) => {
  // Cloud Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('letters')
        .update({ isLocked })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase toggleLetterLock error:', err);
    }
  }

  // Local IndexedDB
  const letter = await executeLocalTx('letters', 'readonly', store => store.get(id));
  if (letter) {
    letter.isLocked = isLocked;
    await executeLocalTx('letters', 'readwrite', store => store.put(letter));
    return letter;
  }
  return null;
};

// ==========================================
// 5. REALTIME SYNC LISTENER (AIS & ELL REALTIME)
// ==========================================
export const subscribeToRealtimeChanges = (onMemoriesChange, onLettersChange, onConfigChange) => {
  if (!isSupabaseConfigured()) return null;

  try {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memories' },
        async () => {
          if (onMemoriesChange) {
            const updated = await getMemories();
            onMemoriesChange(updated);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'letters' },
        async () => {
          if (onLettersChange) {
            const updated = await getLetters();
            onLettersChange(updated);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config' },
        async () => {
          if (onConfigChange) {
            const updated = await getConfig();
            onConfigChange(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return null;
  }
};

// ==========================================
// 6. BACKUP, RESTORE & RESET
// ==========================================
export const exportAllData = async () => {
  const config = await getConfig();
  const memories = await getMemories();
  const letters = await getLetters();

  return {
    app: 'KisahKitaScrapbook',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    site_config: config,
    memories,
    letters
  };
};

export const importAllData = async (backupJson) => {
  if (!backupJson || typeof backupJson !== 'object') {
    throw new Error('Format data backup tidak valid.');
  }

  if (backupJson.site_config) {
    await saveConfig(backupJson.site_config);
  }

  if (Array.isArray(backupJson.memories)) {
    // Clear & seed
    await executeLocalTx('memories', 'readwrite', store => store.clear());
    for (const mem of backupJson.memories) {
      await addMemory(mem);
    }
  }

  if (Array.isArray(backupJson.letters)) {
    await executeLocalTx('letters', 'readwrite', store => store.clear());
    for (const letter of backupJson.letters) {
      await addLetter(letter);
    }
  }

  return true;
};

export const resetToDemoData = async () => {
  await executeLocalTx('site_config', 'readwrite', store => store.clear());
  await executeLocalTx('memories', 'readwrite', store => store.clear());
  await executeLocalTx('letters', 'readwrite', store => store.clear());

  await saveConfig(INITIAL_CONFIG);

  for (const mem of INITIAL_MEMORIES) {
    await addMemory(mem);
  }
  for (const letter of INITIAL_LETTERS) {
    await addLetter(letter);
  }

  return {
    config: INITIAL_CONFIG,
    memories: INITIAL_MEMORIES,
    letters: INITIAL_LETTERS
  };
};
