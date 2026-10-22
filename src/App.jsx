import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TimelineSection from './components/TimelineSection';
import CollageSection from './components/CollageSection';
import VaultSection from './components/VaultSection';
import MemoryModal from './components/MemoryModal';
import AddEditMemoryModal from './components/AddEditMemoryModal';
import AddEditLetterModal from './components/AddEditLetterModal';
import SettingsModal from './components/SettingsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';
import { 
  getConfig, saveConfig, 
  getMemories, addMemory, updateMemory, deleteMemory, updateMemoryPosition,
  getLetters, addLetter, updateLetter, deleteLetter, toggleLetterLock,
  exportAllData, importAllData, resetToDemoData, subscribeToRealtimeChanges
} from './services/db';
import { INITIAL_CONFIG } from './services/initialData';
import { Heart, Sparkles, FolderHeart } from 'lucide-react';

export default function App() {
  // Auth Session State ('AIS' | 'ELL')
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kisah_kita_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Core State
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'collage' | 'vault' | 'settings'
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [memories, setMemories] = useState([]);
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  const [editingLetter, setEditingLetter] = useState(null);
  const [isAddLetterOpen, setIsAddLetterOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    type: null, // 'memory' | 'letter' | 'reset'
    targetItem: null,
    title: '',
    message: ''
  });

  // Anniversary Vault & Clock State
  const [now, setNow] = useState(new Date());

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  const handleLogin = (sessionData) => {
    setCurrentUser(sessionData);
    showToast(`Halo ${sessionData.name}! Senang melihatmu kembali 💖`, 'love');
  };

  const handleLogout = () => {
    localStorage.removeItem('kisah_kita_session');
    setCurrentUser(null);
    showToast('Kamu telah keluar. Sampai jumpa lagi, Sayang!', 'info');
  };

  // Load All Data from IndexedDB on Mount
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [loadedConfig, loadedMemories, loadedLetters] = await Promise.all([
          getConfig(),
          getMemories(),
          getLetters()
        ]);

        // Auto-migrate partner names if previously default 'Raka'
        if (loadedConfig.partner1Name === 'Raka') {
          const updated = {
            ...loadedConfig,
            partner1Name: 'AIS',
            partner2Name: 'ELL',
            startDate: '2025-10-25',
            nextAnnivTitle: 'Anniversary Ke-1 Tahun'
          };
          await saveConfig(updated);
          setConfig(updated);
        } else {
          setConfig(loadedConfig);
        }

        setMemories(loadedMemories);
        setLetters(loadedLetters);
      } catch (err) {
        console.error('Gagal memuat database IndexedDB:', err);
        showToast('Gagal memuat dari database lokal, beralih ke memori sementara.', 'warning');
      } finally {
        setIsLoading(false);
      }
    };
    loadAppData();

    // Subscribe to Realtime Supabase Changes (AIS & ELL Realtime Sync)
    const unsubscribe = subscribeToRealtimeChanges(
      (newMemories) => setMemories(newMemories),
      (newLetters) => setLetters(newLetters),
      (newConfig) => setConfig(newConfig)
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 1-Second Interval for Live Clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Relationship Duration Calculations (Years, Months, Days)
  const durationStats = useMemo(() => {
    const start = new Date(config.startDate);
    const current = now;

    let years = current.getFullYear() - start.getFullYear();
    let months = current.getMonth() - start.getMonth();
    let days = current.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.max(0, Math.floor((current - start) / (1000 * 60 * 60 * 24)));

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      totalDays
    };
  }, [config.startDate, now]);

  // Next Anniversary Countdown Calculations
  const countdownStats = useMemo(() => {
    const start = new Date(config.startDate);
    const cycle = config.cycleType || 'yearly';
    
    let nextDate;
    let isTodaySpecial = false;

    if (cycle === 'monthly') {
      // Monthly cycle (Mensiversary)
      isTodaySpecial = now.getDate() === start.getDate();
      nextDate = new Date(now.getFullYear(), now.getMonth(), start.getDate(), 0, 0, 0);
      if (now > nextDate && !isTodaySpecial) {
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, start.getDate(), 0, 0, 0);
      }
    } else {
      // Yearly cycle (Anniversary)
      isTodaySpecial = 
        now.getMonth() === start.getMonth() && 
        now.getDate() === start.getDate();

      nextDate = new Date(now.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      if (now > nextDate && !isTodaySpecial) {
        nextDate = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate(), 0, 0, 0);
      }
    }

    const isAnnivUnlocked = isTodaySpecial;

    if (isAnnivUnlocked) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isAnnivUnlocked: true,
        targetDateStr: nextDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };
    }

    const diff = Math.max(0, nextDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      isAnnivUnlocked: false,
      targetDateStr: nextDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  }, [config.startDate, config.cycleType, now]);

  // ==========================================
  // MEMORIES CRUD HANDLERS
  // ==========================================
  const handleSaveMemory = async (memoryData) => {
    try {
      if (editingMemory) {
        // Update existing
        await updateMemory(memoryData);
        setMemories(prev => 
          prev.map(m => m.id === memoryData.id ? memoryData : m)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        showToast('Lembaran kenangan berhasil diperbarui!', 'love');
        // If viewing current memory, update it
        if (selectedMemory?.id === memoryData.id) {
          setSelectedMemory(memoryData);
        }
      } else {
        // Add new
        const saved = await addMemory(memoryData);
        setMemories(prev => [saved, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
        showToast('Kenangan baru berhasil ditempel ke buku!', 'love');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan kenangan ke database.', 'warning');
    } finally {
      setIsAddMemoryOpen(false);
      setEditingMemory(null);
    }
  };

  const handlePromptDeleteMemory = (memory) => {
    setDeleteConfirmState({
      isOpen: true,
      type: 'memory',
      targetItem: memory,
      title: 'Lepas Lembaran Kenangan?',
      message: `Apakah kamu yakin ingin melepaskan "${memory.title}" dari buku kenangan? Foto dan ceritanya akan dihapus permanen dari arsip.`
    });
  };

  const handleSavePosition = async (id, pos) => {
    try {
      await updateMemoryPosition(id, pos);
    } catch (err) {
      console.error('Gagal menyimpan posisi:', err);
    }
  };

  // ==========================================
  // LETTERS CRUD HANDLERS
  // ==========================================
  const handleSaveLetter = async (letterData) => {
    try {
      if (editingLetter) {
        await updateLetter(letterData);
        setLetters(prev => prev.map(l => l.id === letterData.id ? letterData : l));
        showToast('Isi surat kapsul waktu berhasil diperbarui!', 'success');
      } else {
        const saved = await addLetter(letterData);
        setLetters(prev => [...prev, saved]);
        showToast('Surat baru berhasil disegel ke dalam brankas!', 'love');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan surat.', 'warning');
    } finally {
      setIsAddLetterOpen(false);
      setEditingLetter(null);
    }
  };

  const handlePromptDeleteLetter = (letter) => {
    setDeleteConfirmState({
      isOpen: true,
      type: 'letter',
      targetItem: letter,
      title: 'Hapus Surat dari Brankas?',
      message: `Apakah kamu yakin ingin menghapus surat "${letter.title}"? Surat yang dihapus tidak bisa dipulihkan.`
    });
  };

  const handleToggleLetterLock = async (id, newLocked) => {
    try {
      await toggleLetterLock(id, newLocked);
      setLetters(prev => prev.map(l => l.id === id ? { ...l, isLocked: newLocked } : l));
      showToast(newLocked ? 'Amplop berhasil dikunci dengan segel lilin.' : 'Segel amplop berhasil dibuka manual.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // CONFIG & DATA MANAGEMENT HANDLERS
  // ==========================================
  const handleSaveConfig = async (newConfig) => {
    try {
      await saveConfig(newConfig);
      setConfig(newConfig);
      setIsSettingsOpen(false);
      showToast('Profil perjalanan cinta & web berhasil diperbarui!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal memperbarui konfigurasi.', 'warning');
    }
  };

  const handleExportBackup = async () => {
    try {
      const backupData = await exportAllData();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kisah-kita-scrapbook-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('File backup .JSON berhasil diunduh ke perangkatmu!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengekspor file cadangan.', 'warning');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        await importAllData(parsed);

        // Reload state
        const [newCfg, newMems, newLetters] = await Promise.all([
          getConfig(),
          getMemories(),
          getLetters()
        ]);
        setConfig(newCfg);
        setMemories(newMems);
        setLetters(newLetters);
        setIsSettingsOpen(false);
        showToast('Seluruh arsip kenangan berhasil dipulihkan dari file backup!', 'love');
      } catch (err) {
        console.error(err);
        showToast('Format file backup tidak sesuai atau rusak.', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const handlePromptResetDemo = () => {
    setDeleteConfirmState({
      isOpen: true,
      type: 'reset',
      targetItem: null,
      title: 'Kembalikan ke Demo Awal?',
      message: 'Perhatian: Semua foto dan surat yang kamu buat saat ini akan digantikan kembali dengan data cerita awal (Raka & Nisa).'
    });
  };

  // Final confirmation executor
  const handleExecuteDeleteConfirm = async () => {
    const { type, targetItem } = deleteConfirmState;
    try {
      if (type === 'memory' && targetItem) {
        await deleteMemory(targetItem.id);
        setMemories(prev => prev.filter(m => m.id !== targetItem.id));
        if (selectedMemory?.id === targetItem.id) {
          setSelectedMemory(null);
        }
        showToast('Kenangan telah dilepas dari jurnal.', 'info');
      } else if (type === 'letter' && targetItem) {
        await deleteLetter(targetItem.id);
        setLetters(prev => prev.filter(l => l.id !== targetItem.id));
        showToast('Surat telah dihapus dari brankas.', 'info');
      } else if (type === 'reset') {
        const res = await resetToDemoData();
        setConfig(res.config);
        setMemories(res.memories);
        setLetters(res.letters);
        setIsSettingsOpen(false);
        showToast('Database berhasil direset ke data contoh awal.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan saat mengeksekusi tindakan.', 'warning');
    } finally {
      setDeleteConfirmState({ isOpen: false, type: null, targetItem: null, title: '', message: '' });
    }
  };

  // If not logged in, show cozy LoginScreen
  if (!currentUser) {
    return (
      <>
        <LoginScreen config={config} onLogin={handleLogin} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div 
      className="min-h-screen text-[#2C2A29] flex flex-col justify-between selection:bg-[#F4A298]/40 overflow-x-hidden"
      style={{
        backgroundColor: '#FDFBF7',
        backgroundImage: `radial-gradient(#2C2A29 0.85px, transparent 0.85px), radial-gradient(#E2C2B3 0.85px, #FDFBF7 0.85px)`,
        backgroundSize: '28px 28px',
        backgroundPosition: '0 0, 14px 14px'
      }}
    >
      <div>
        {/* Scrapbook Header & Counter */}
        <Header
          config={config}
          durationStats={durationStats}
          currentUser={currentUser}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
        />

        {/* Tab Navigation Ribbon */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          memoryCount={memories.length}
          isAnnivToday={countdownStats.isAnnivUnlocked}
          onAddMemory={() => {
            setEditingMemory(null);
            setIsAddMemoryOpen(true);
          }}
          onAddLetter={() => {
            setEditingLetter(null);
            setIsAddLetterOpen(true);
          }}
        />

        {/* Main Tab Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-16">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#2C2A29] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-handwriting text-2xl font-bold">Membuka lembaran buku kenangan...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: KISAH KITA (TIMELINE) */}
              {activeTab === 'timeline' && (
                <TimelineSection
                  memories={memories}
                  onViewMemory={(mem) => setSelectedMemory(mem)}
                  onEditMemory={(mem) => {
                    setEditingMemory(mem);
                    setIsAddMemoryOpen(true);
                  }}
                  onDeleteMemory={handlePromptDeleteMemory}
                  onAddMemory={() => {
                    setEditingMemory(null);
                    setIsAddMemoryOpen(true);
                  }}
                />
              )}

              {/* TAB 2: DINDING KOLASE (COLLAGE) */}
              {activeTab === 'collage' && (
                <CollageSection
                  memories={memories}
                  onViewMemory={(mem) => setSelectedMemory(mem)}
                  onEditMemory={(mem) => {
                    setEditingMemory(mem);
                    setIsAddMemoryOpen(true);
                  }}
                  onDeleteMemory={handlePromptDeleteMemory}
                  onSavePosition={handleSavePosition}
                />
              )}

              {/* TAB 3: HARI SPESIAL & BRANKAS SURAT */}
              {activeTab === 'vault' && (
                <VaultSection
                  config={config}
                  letters={letters}
                  countdownStats={countdownStats}
                  currentUser={currentUser}
                  onAddLetter={() => {
                    setEditingLetter(null);
                    setIsAddLetterOpen(true);
                  }}
                  onEditLetter={(letter) => {
                    setEditingLetter(letter);
                    setIsAddLetterOpen(true);
                  }}
                  onDeleteLetter={handlePromptDeleteLetter}
                  onToggleLock={handleToggleLetterLock}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Cozy Scrapbook Footer */}
      <footer className="border-t-2 border-[#2C2A29] bg-[#FDFBF7] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#2C2A29]/75">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#F9E2AF] border border-[#2C2A29]">📖</span>
            <span className="font-serif">{config.websiteTitle}</span>
            <span>•</span>
            <span>{config.partner1Name} & {config.partner2Name}</span>
          </div>

          <p className="font-handwriting text-xl text-[#2C2A29]">
            "Dibuat dengan cinta, tawa, dan sedikit selotip kertas."
          </p>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hover:underline text-[11px] font-bold text-[#D96B5F]"
          >
            ⚙️ Pengaturan Profil
          </button>
        </div>
      </footer>

      {/* ==========================================
          MODALS & SYSTEM OVERLAYS
      ========================================== */}
      {/* 1. Full Story Memory Viewer Modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onEdit={(mem) => {
            setSelectedMemory(null);
            setEditingMemory(mem);
            setIsAddMemoryOpen(true);
          }}
          onDelete={(mem) => {
            handlePromptDeleteMemory(mem);
          }}
        />
      )}

      {/* 2. Unified Add & Edit Memory Modal */}
      {isAddMemoryOpen && (
        <AddEditMemoryModal
          isOpen={isAddMemoryOpen}
          initialData={editingMemory}
          currentUser={currentUser}
          onClose={() => {
            setIsAddMemoryOpen(false);
            setEditingMemory(null);
          }}
          onSave={handleSaveMemory}
        />
      )}

      {/* 3. Unified Add & Edit Letter Modal */}
      {isAddLetterOpen && (
        <AddEditLetterModal
          isOpen={isAddLetterOpen}
          initialData={editingLetter}
          currentUser={currentUser}
          partner1Name={config.partner1Name}
          partner2Name={config.partner2Name}
          onClose={() => {
            setIsAddLetterOpen(false);
            setEditingLetter(null);
          }}
          onSave={handleSaveLetter}
        />
      )}

      {/* 4. Settings & CMS Modal */}
      {isSettingsOpen && (
        <SettingsModal
          config={config}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveConfig}
        />
      )}

      {/* 5. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmState.isOpen}
        title={deleteConfirmState.title}
        message={deleteConfirmState.message}
        onConfirm={handleExecuteDeleteConfirm}
        onClose={() => setDeleteConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 6. Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
