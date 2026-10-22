import React, { useState } from 'react';
import { 
  X, Settings, Heart, Calendar, Sparkles, Download, Upload, 
  RotateCcw, Image as ImageIcon, Save, ShieldCheck, Database
} from 'lucide-react';
import { DoodleTape } from './Doodles';

export default function SettingsModal({
  config,
  isOpen,
  onClose,
  onSave,
  onExportBackup,
  onImportBackup,
  onResetDemo
}) {
  const [websiteTitle, setWebsiteTitle] = useState(config.websiteTitle || 'Kisah Kita');
  const [partner1Name, setPartner1Name] = useState(config.partner1Name || 'Raka');
  const [partner2Name, setPartner2Name] = useState(config.partner2Name || 'Nisa');
  const [partner1Avatar, setPartner1Avatar] = useState(config.partner1Avatar || '');
  const [partner2Avatar, setPartner2Avatar] = useState(config.partner2Avatar || '');
  const [startDate, setStartDate] = useState(config.startDate || '2023-11-14');
  const [cycleType, setCycleType] = useState(config.cycleType || 'yearly');
  const [nextAnnivTitle, setNextAnnivTitle] = useState(config.nextAnnivTitle || 'Anniversary Ke-3 Tahun');
  const [targetCountdownDate, setTargetCountdownDate] = useState(
    config.targetCountdownDate?.slice(0, 16) || '2026-11-14T00:00'
  );
  const [tagline, setTagline] = useState(config.tagline || '');
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile' | 'data'

  if (!isOpen) return null;

  const handleAvatarUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400; // Optimal size for avatars
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        if (target === 'partner1') setPartner1Avatar(dataUrl);
        else setPartner2Avatar(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...config,
      websiteTitle: websiteTitle.trim() || 'Kisah Kita',
      partner1Name: partner1Name.trim() || 'Dia',
      partner2Name: partner2Name.trim() || 'Kamu',
      partner1Avatar,
      partner2Avatar,
      startDate,
      cycleType,
      nextAnnivTitle: nextAnnivTitle.trim() || 'Hari Spesial Kita',
      targetCountdownDate,
      tagline: tagline.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A29]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-xl rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <DoodleTape color="rgba(244, 162, 152, 0.85)" position="top-center" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F9E2AF] border-2 border-[#2C2A29] rounded-lg -rotate-2">
              <Settings className="w-5 h-5 text-[#2C2A29]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2C2A29]">
                Kelola Jurnal & Data Situs
              </h2>
              <p className="text-xs text-[#2C2A29]/75 font-medium">
                Atur identitas kalian berdua, hitung mundur, dan cadangan data offline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F4A298] border-2 border-[#2C2A29] shadow-tactile-sm hover:opacity-85"
          >
            <X className="w-5 h-5 text-[#2C2A29]" />
          </button>
        </div>

        {/* Tab Switcher inside Modal */}
        <div className="flex items-center gap-2 mb-6 border-b-2 border-[#2C2A29] pb-3">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 border-[#2C2A29] flex items-center gap-2 transition ${
              activeSubTab === 'profile'
                ? 'bg-[#F9E2AF] shadow-tactile-sm'
                : 'bg-[#FDFBF7] text-[#2C2A29]/70 hover:bg-[#E2C2B3]/30'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#D96B5F]" />
            <span>Profil Pasangan & Tampilan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('data')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 border-[#2C2A29] flex items-center gap-2 transition ${
              activeSubTab === 'data'
                ? 'bg-[#A3B899] shadow-tactile-sm'
                : 'bg-[#FDFBF7] text-[#2C2A29]/70 hover:bg-[#E2C2B3]/30'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#2C2A29]" />
            <span>Manajemen Data & Backup (.JSON)</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & COUPLE CMS */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Website Title & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Nama Jurnal / Judul Web
                </label>
                <input
                  type="text"
                  required
                  value={websiteTitle}
                  onChange={(e) => setWebsiteTitle(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                  placeholder="Kisah Kita"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Siklus Perayaan Hari Jadian
                </label>
                <select
                  value={cycleType}
                  onChange={(e) => setCycleType(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                >
                  <option value="yearly">Tahunan (Anniversary Setiap Tahun)</option>
                  <option value="monthly">Bulanan (Mensiversary Setiap Bulan)</option>
                </select>
              </div>
            </div>

            {/* Couple Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Nama Pasangan 1 (Dia) *
                </label>
                <input
                  type="text"
                  required
                  value={partner1Name}
                  onChange={(e) => setPartner1Name(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Nama Pasangan 2 (Kamu) *
                </label>
                <input
                  type="text"
                  required
                  value={partner2Name}
                  onChange={(e) => setPartner2Name(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Partner Avatars */}
            <div className="p-3.5 bg-[#E2C2B3]/30 rounded-xl border-2 border-dashed border-[#2C2A29] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#2C2A29] overflow-hidden bg-white shrink-0">
                  {partner1Avatar ? (
                    <img src={partner1Avatar} alt={partner1Name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                      {partner1Name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold block">Foto {partner1Name}</span>
                  <label className="text-[11px] font-bold text-[#D96B5F] underline cursor-pointer hover:opacity-80">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e, 'partner1')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#2C2A29] overflow-hidden bg-white shrink-0">
                  {partner2Avatar ? (
                    <img src={partner2Avatar} alt={partner2Name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                      {partner2Name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold block">Foto {partner2Name}</span>
                  <label className="text-[11px] font-bold text-[#D96B5F] underline cursor-pointer hover:opacity-80">
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e, 'partner2')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Dates: Relationship Start & Target Countdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Tanggal Awal Hubungan (Jadian) *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase block mb-1">
                  Judul Acara Countdown Berikutnya
                </label>
                <input
                  type="text"
                  required
                  value={nextAnnivTitle}
                  onChange={(e) => setNextAnnivTitle(e.target.value)}
                  className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
                  placeholder="Anniversary Ke-3 Tahun"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="text-xs font-bold uppercase block mb-1">
                Kutipan / Tagline Pembuka Jurnal
              </label>
              <textarea
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-white border-2 border-[#2C2A29] rounded-xl p-3 text-sm font-medium focus:outline-none"
                placeholder="Kata-kata manis yang menggambarkan hubungan kalian..."
              />
            </div>

            {/* Save Buttons */}
            <div className="pt-2 flex justify-end gap-3 border-t-2 border-[#2C2A29]/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border-2 border-[#2C2A29] font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#F4A298] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Profil & Tampilan
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: DATA MANAGEMENT & BACKUP */}
        {activeSubTab === 'data' && (
          <div className="space-y-5">
            <div className="bg-[#F9E2AF]/40 border-2 border-[#2C2A29] rounded-xl p-4 space-y-2">
              <h4 className="font-serif font-bold text-base text-[#2C2A29] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#A3B899]" />
                Penyimpanan Data Lokal & Ramah Hosting
              </h4>
              <p className="text-xs text-[#2C2A29]/80 leading-relaxed">
                Aplikasi ini menyimpan semua foto dan catatan secara lokal di dalam browser menggunakan <strong>IndexedDB</strong>. Data tidak akan hilang saat kamu me-refresh halaman.
              </p>
              <p className="text-xs text-[#2C2A29]/80 leading-relaxed">
                Saat kamu ingin memindahkan aplikasi ini ke domain hosting atau ke HP pasanganmu, cukup gunakan fitur <strong>Export Backup (.JSON)</strong> di bawah ini!
              </p>
            </div>

            {/* Export & Import & Reset Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Export */}
              <div className="p-4 rounded-xl border-2 border-[#2C2A29] bg-[#FDFBF7] shadow-tactile-sm flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#D96B5F]" />
                    Ekspor Seluruh Jurnal
                  </h5>
                  <p className="text-xs text-[#2C2A29]/75 mb-3">
                    Unduh file cadangan .JSON yang memuat seluruh foto polaroid, surat kapsul waktu, dan pengaturan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-4 py-2 rounded-xl bg-[#F9E2AF] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm flex items-center justify-center gap-2 hover:bg-[#F9E2AF]/80 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Backup (.JSON)
                </button>
              </div>

              {/* Import */}
              <div className="p-4 rounded-xl border-2 border-[#2C2A29] bg-[#FDFBF7] shadow-tactile-sm flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#A3B899]" />
                    Pulihkan Dari Cadangan
                  </h5>
                  <p className="text-xs text-[#2C2A29]/75 mb-3">
                    Pilih file backup .JSON yang sebelumnya sudah kamu simpan untuk memulihkan semua kenangan.
                  </p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-[#A3B899] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#A3B899]/80 transition">
                  <Upload className="w-3.5 h-3.5" />
                  Pilih File Backup (.JSON)
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Reset to Demo */}
            <div className="p-4 rounded-xl border-2 border-dashed border-[#D96B5F] bg-[#F4A298]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-xs text-[#D96B5F] uppercase">
                  Reset Ulang ke Data Contoh (Demo)
                </h5>
                <p className="text-xs text-[#2C2A29]/75">
                  Kembalikan jurnal ke isi awal (Raka & Nisa) jika kamu ingin mengulang dari awal.
                </p>
              </div>
              <button
                type="button"
                onClick={onResetDemo}
                className="px-3.5 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#2C2A29] font-bold text-xs text-[#2C2A29] hover:bg-[#F4A298] transition shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset ke Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
