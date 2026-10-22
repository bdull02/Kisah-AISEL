export const VALID_USERS = [
  { 
    username: 'AIS', 
    name: 'AIS', 
    label: 'AIS 🌸',
    color: '#F4A298',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  { 
    username: 'ELL', 
    name: 'ELL', 
    label: 'ELL 🌿',
    color: '#A3B899',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  }
];

export const ANNIV_PASSWORD = '251025'; // 25 Oktober 2025

// Rich, warm, and realistic initial Indonesian demo data
export const INITIAL_CONFIG = {
  key: 'main',
  websiteTitle: 'Kisah Kita',
  partner1Name: 'AIS',
  partner2Name: 'ELL',
  partner1Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  partner2Avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  startDate: '2025-10-25',
  cycleType: 'yearly', // 'yearly' | 'monthly'
  nextAnnivTitle: 'Anniversary Ke-1 Tahun',
  targetCountdownDate: '2026-10-25T00:00:00',
  tagline: 'Satu buku kecil tentang ribuan langkah, tawa sore hari, dan tempat pulang paling tenang.'
};

export const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'Sore Hujan & Kopi Susu Pertama',
    date: '2025-10-25',
    location: 'Kedai Sudut Kecil, Blok M',
    mood: 'Deg-degan Manis',
    author: 'AIS',
    frameColor: '#FFFFFF',
    tapeColor: 'rgba(244, 162, 152, 0.85)', // Dusty Rose
    rotation: -1.5,
    corkboardPos: { x: 30, y: 40 },
    secretNote: 'Sebenernya waktu itu aku gugup banget sampai ngaduk es kopi hampir 5 menit sendiri haha.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90',
    story: 'Hari di mana hujan turun deras banget tepat jam lima sore. Kita terjebak di teras kedai kopi sempit, berbagi satu payung lipat yang agak miring, dan akhirnya ngobrol sampai kedainya hampir tutup. Dari situ aku tahu, aku bakal betah dengerin ceritamu lama-lama.'
  },
  {
    id: 'mem-2',
    title: 'Roadtrip Dadakan Mencari Kabut Pagi',
    date: '2025-12-14',
    location: 'Bukit Perkebunan Teh, Ciwidey',
    mood: 'Petualangan Seru',
    author: 'ELL',
    frameColor: '#F9E2AF', // Butter Yellow
    tapeColor: 'rgba(163, 184, 153, 0.85)', // Matcha Sage
    rotation: 1.8,
    corkboardPos: { x: 380, y: 70 },
    secretNote: 'Jangan lupa jaket flanelmu yang kupinjam hari ini belum kubalikin sampai sekarang!',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=90',
    story: 'Berangkat subuh berbekal playlist lagu akustik dan roti bakar. Pas sampai di atas, kabutnya turun pelan-pelan nutupin kebun teh. Kita berhenti di pinggir jalan cuma buat beli jagung bakar hangat sambil ngetawain rute maps yang sempat bikin nyasar ke jalan berbatu.'
  },
  {
    id: 'mem-3',
    title: 'Piknik Kue Ulang Tahun yang Miring',
    date: '2026-02-08',
    location: 'Taman Kota Bawah Pohon Rindang',
    mood: 'Penuh Tawa',
    author: 'AIS',
    frameColor: '#FDFBF7',
    tapeColor: 'rgba(249, 226, 175, 0.9)', // Butter
    rotation: -2.2,
    corkboardPos: { x: 740, y: 45 },
    secretNote: 'Kue buatan sendiri paling enak sedunia biarpun krimnya meleleh kena angin taman.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=90',
    story: 'Niat hati mau bikin surprise aesthetic ala Pinterest dengan kue tart mini bikinan sendiri. Ternyata pas dibuka dari kotak, krim atasnya geser ke kiri gara-gara kena polisi tidur! Tapi melihat kamu ketawa lepas sambil tetap makan kuenya dengan lahap adalah pemandangan terbaik tahun itu.'
  },
  {
    id: 'mem-4',
    title: 'Menunggu Senja di Stasiun Kereta',
    date: '2026-04-16',
    location: 'Peron Timur, Yogyakarta',
    mood: 'Tenang & Hangat',
    author: 'ELL',
    frameColor: '#E2C2B3', // Soft Clay
    tapeColor: 'rgba(244, 162, 152, 0.85)',
    rotation: 1.4,
    corkboardPos: { x: 60, y: 460 },
    secretNote: 'Setiap perjalanan pulang selalu terasa terlalu cepat kalau perginya bareng kamu.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=90',
    story: 'Langit berubah warna jadi oranye keemasan tepat sebelum kereta kita datang. Nggak banyak kata yang diucapin sore itu, cuma duduk berdampingan di bangku kayu peron sambil dengerin satu earphone berdua. Momen sederhana yang selalu ingin kuulang berkali-kali.'
  },
  {
    id: 'mem-5',
    title: 'Festival Lampu & Kembang Api Kecil',
    date: '2026-07-28',
    location: 'Pesisir Pantai Ancol',
    mood: 'Momen Spesial',
    author: 'AIS',
    frameColor: '#E6EFE2', // Matcha Light
    tapeColor: 'rgba(216, 195, 232, 0.9)', // Lavender
    rotation: -1.2,
    corkboardPos: { x: 420, y: 480 },
    secretNote: 'Percikan kembang apinya kecil, tapi tatapan matamu bikin malam itu jadi luar biasa.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=90',
    story: 'Kita beli seikat kembang api kawat dari pedagang keliling di pinggir pantai. Pas dinyalain, angin laut bertiup kencang bikin lilin korek sering mati. Kita berdua ketawa sambil berusaha nutupin apinya pake jaket. Malam penuh gemerlap yang nggak akan pernah pudar di ingatan.'
  },
  {
    id: 'mem-6',
    title: 'Belanja Buku Bekas & Es Cokelat',
    date: '2026-09-02',
    location: 'Pasar Buku Antik Kwitang',
    mood: 'Tenang & Hangat',
    author: 'ELL',
    frameColor: '#F9E2AF',
    tapeColor: 'rgba(163, 184, 153, 0.85)',
    rotation: 2.0,
    corkboardPos: { x: 770, y: 470 },
    secretNote: 'Kamu milih novel puisi itu karena katanya mengingatkanmu pada senyumku.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=90',
    story: 'Menghabiskan waktu berjam-jam mengelilingi tumpukan buku tua berdebu yang harum kertasnya khas banget. Kamu nemu satu buku puisi lama bersampul kain dan membacakan satu bait untukku di depan warung es cokelat pinggir jalan. Sungguh hari Minggu yang sempurna.'
  }
];

export const INITIAL_LETTERS = [
  {
    id: 'let-1',
    edition: 'Hari Pertama Jadian',
    dateWritten: '2025-10-25',
    targetUnlockDate: '2025-10-25',
    author: 'AIS',
    isLocked: false,
    waxColor: '#D96B5F',
    title: 'Awal dari Lembaran Cerita Kita',
    content: '25 Oktober 2025. Hari di mana kita resmi memulai langkah berdua. Terima kasih sudah menerima semua kurang dan lebihku. Semoga perjalanan kita selalu diiringi tawa renyah, saling menguatkan di hari lelah, dan selalu menjadi rumah paling nyaman untuk pulang.'
  },
  {
    id: 'let-2',
    edition: 'Surat 6 Bulan Bersama',
    dateWritten: '2026-04-25',
    targetUnlockDate: '2026-04-25',
    author: 'ELL',
    isLocked: false,
    waxColor: '#7A9A6E',
    title: 'Setengah Tahun Penuh Syukur',
    content: 'Enam bulan rasanya mengalir begitu cepat tapi sarat makna. Terima kasih sudah selalu sabar, mendengarkan celotehanku tanpa bosan, dan menggenggam tanganku erat. Aku bahagia sekali bisa melewati hari-hari bersama kamu.'
  },
  {
    id: 'let-3',
    edition: 'Spesial Anniversary Ke-1 Tahun',
    dateWritten: '2026-07-10',
    targetUnlockDate: '2026-10-25',
    author: 'AIS & ELL',
    isLocked: true,
    waxColor: '#D96B5F',
    title: 'Surat Kapsul Waktu: Buka Tepat 25 Oktober!',
    content: 'Halo kita di tanggal 25 Oktober 2026! Satu tahun penuh warna sudah kita lewati bersama. Ingat hari pertama kita jadian? Rasa hangat itu masih sama dan makin bertumbuh. Selamat satu tahun, Sayang! Jangan lupa rayakan hari ini dengan makanan favorit kita dan tambahkan foto baru ke Dinding Kolase!'
  }
];

export const PRESET_MOODS = [
  { label: 'Deg-degan Manis', bg: '#F4A298', color: '#2C2A29' },
  { label: 'Petualangan Seru', bg: '#A3B899', color: '#2C2A29' },
  { label: 'Penuh Tawa', bg: '#F9E2AF', color: '#2C2A29' },
  { label: 'Tenang & Hangat', bg: '#E2C2B3', color: '#2C2A29' },
  { label: 'Momen Spesial', bg: '#D8C3E8', color: '#2C2A29' },
  { label: 'Makan Enak', bg: '#FBD38D', color: '#2C2A29' },
  { label: 'Rindu & Hangat', bg: '#FEB2B2', color: '#2C2A29' }
];

export const PRESET_FRAME_COLORS = [
  { name: 'Putih Polaroid', hex: '#FFFFFF', tape: 'rgba(244, 162, 152, 0.85)' },
  { name: 'Kertas Mentega', hex: '#F9E2AF', tape: 'rgba(163, 184, 153, 0.85)' },
  { name: 'Krem Hangat', hex: '#FDFBF7', tape: 'rgba(249, 226, 175, 0.9)' },
  { name: 'Tanah Liat Lembut', hex: '#E2C2B3', tape: 'rgba(244, 162, 152, 0.85)' },
  { name: 'Hijau Matcha Muda', hex: '#E6EFE2', tape: 'rgba(226, 194, 179, 0.85)' },
  { name: 'Soft Lavender', hex: '#F0E6F6', tape: 'rgba(163, 184, 153, 0.85)' }
];
