# 📖 Kisah Kita — Digital Scrapbook & Couple Relationship Journey

Aplikasi web jurnal perjalanan hubungan dan buku kliping digital (digital scrapbook) bertema **"Tactile Indie Scrapbook & Cozy Neo-Brutalism"** (anti-AI slop), dirancang khusus untuk merayakan setiap langkah cinta, foto polaroid, dan kapsul waktu surat masa depan.

---

## 🔐 Gerbang Masuk & Hak Akses (Login Pasangan)

Aplikasi ini dilindungi oleh gerbang masuk (*Login Screen*) khusus untuk 2 pengguna:
- **Pengguna 1**: `AIS` (AIS 🌸)
- **Pengguna 2**: `ELL` (ELL 🌿)
- **Kata Sandi (Password)**: `251025` *(Tanggal Anniversary: 25 Oktober 2025)*
- **Atribusi Penulis (*Author Attribution*)**: Setiap foto, cerita, atau surat yang ditambahkan akan otomatis ditandai siapa pembuatnya (misal: `✍️ AIS` atau `✍️ ELL`), dan dapat dilihat di kartu polaroid, dinding kolase, maupun lembaran surat.

---

## ✨ Fitur Utama (100% Dinamis & Full CRUD)

1. **Header Taktil & Counter Hari Jadian**:
   - Menampilkan nama pasangan (**AIS & ELL**), foto avatar, tanggal jadian (**25 Oktober 2025**), dan total hari bersama.
   - Status user yang sedang aktif dengan tombol **"Keluar (Logout)"**.
   - Live counter hitung otomatis: **Tahun**, **Bulan**, dan **Hari** bergaya tiket stempel fisik.
   - Tombol cepat **"✏️ Edit Profil & Web"** langsung di header.

2. **📖 Kisah Kita (Timeline Kenangan - Full CRUD)**:
   - Garis waktu berliku (*winding path*) kronologis dengan kartu polaroid dan lembar cerita.
   - **Fitur Tambah & Edit Momen**: Unggah foto resolusi tinggi (disimpan tajam di IndexedDB), atur judul, tanggal, lokasi, badge suasana hati (mood kustom atau preset), warna bingkai, selotip washi tape, cerita lengkap, dan catatan rahasia di balik foto.
   - **Pencarian & Filter**: Cari kenangan berdasarkan kata kunci, filter suasana hati, serta pengurutan terbaru/terlama.
   - **Modal Lembaran Jurnal**: Membaca cerita utuh dengan tombol **"Edit Cerita"** dan **"Lepas Kenangan"** (konfirmasi lucu & aman).

3. **🖼️ Dinding Kolase (Collage Wall)**:
   - Mengumpulkan semua foto dari seluruh perjalanan hubungan.
   - **2 Mode Tampilan**:
     1. *Grid Kolase Scrapbook*: Tata letak asimetris dengan kemiringan organik dan selotip warna-warni.
     2. *Papan Gabus Bebas (Corkboard Drag & Drop)*: Geser kartu polaroid ke mana saja di atas kanvas gabus; koordinat X/Y otomatis tersimpan permanen ke IndexedDB.
   - **Interaktif Bolak-Balik (180° Flip)**: Klik ikon putar 🔄 untuk membalik foto dan membaca catatan tulisan tangan rahasia di baliknya.

4. **⏳ Hari Spesial & Brankas Surat (Anniversary Vault - Full CRUD)**:
   - **Live Countdown Realtime**: Menghitung mundur Hari, Jam, Menit, dan Detik menuju Anniversary atau Mensiversary berikutnya.
   - **Amplop Kapsul Waktu & Segel Lilin**:
     - Status Terkunci jika belum mencapai hari H (*"Buka saat Tanggal Spesial ✨"*).
     - Tombol **Simulasi Buka Segel (Preview Mode)** untuk uji coba kapan saja.
     - Animasi letupan konfeti (*canvas-confetti*) dan terbukanya segel lilin saat hari H tiba.
     - Lembaran surat bertuliskan tangan di atas kertas bergaris antik.
     - Full CRUD: Buat surat baru, edit isi/pengirim/edisi, ubah kunci, atau hapus surat.

5. **⚙️ Kelola & Pengaturan (CMS Modal & Backup .JSON)**:
   - Pengaturan nama pasangan, foto profil, tanggal mulai, siklus perayaan (tahunan atau bulanan), judul hitung mundur, dan kutipan pembuka.
   - **Cadangkan Data**: **Ekspor Backup (.JSON)** dengan satu klik (memuat seluruh foto polaroid, surat, dan konfigurasi).
   - **Pulihkan Data**: **Impor Backup (.JSON)** untuk migrasi antar peramban atau perangkat.
   - **Reset ke Demo**: Kembalikan ke data contoh awal (Raka & Nisa).

---

## 🎨 Karakter Desain Visual (Anti-AI Slop)

- **Palet Warna**:
  - *Warm Paper Cream* (`#FDFBF7`) dengan pola dot-grid halus.
  - *Soft Charcoal* (`#2C2A29`) untuk garis tinta tebal dan teks.
  - *Dusty Rose* (`#F4A298`) untuk aksen romantis.
  - *Matcha Sage* (`#A3B899`) untuk badge dan tanaman.
  - *Butter Yellow* (`#F9E2AF`) untuk sticky notes & stiker.
  - *Soft Clay* (`#E2C2B3`) untuk tekstur papan gabus.
- **Tipografi Google Fonts**:
  - Headings: `'Fraunces'` (serif hangat dan berkarakter).
  - Body: `'Quicksand'` (sans ramah dan nyaman dibaca).
  - Catatan & Surat: `'Caveat'` (tulisan tangan personal).
- **Elemen Taktil**:
  - Garis tepi solid (`border-2 border-[#2C2A29]`) dan bayangan offset pekat (`shadow-[4px_4px_0px_#2C2A29]`).
  - Selotip *washi tape* dengan sudut sobekan poligonal realistis.

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori
cd ANNIV

# 2. Jalankan development server
npm run dev
```

Buka peramban di `http://127.0.0.1:3000/`.

---

## ☁️ Siap Dideploy ke Cloud (Vercel / Netlify / Cloudflare Pages)

Aplikasi ini bersifat static-ready. Ketika kamu siap meng-online-kannya:
```bash
npm run build
```
Folder `dist/` siap di-deploy ke platform hosting statis manapun (seperti Vercel, Netlify, GitHub Pages, atau Firebase Hosting) tanpa perlu konfigurasi backend khusus.
