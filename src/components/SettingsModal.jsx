import React, { useState } from 'react';
import { 
  X, Settings, Heart, Calendar, Image as ImageIcon, Save
} from 'lucide-react';
import { DoodleTape } from './Doodles';

export default function SettingsModal({
  config,
  isOpen,
  onClose,
  onSave
}) {
  const [websiteTitle, setWebsiteTitle] = useState(config.websiteTitle || 'Kisah Kita');
  const [partner1Name, setPartner1Name] = useState(config.partner1Name || 'AIS');
  const [partner2Name, setPartner2Name] = useState(config.partner2Name || 'ELL');
  const [partner1Avatar, setPartner1Avatar] = useState(config.partner1Avatar || '');
  const [partner2Avatar, setPartner2Avatar] = useState(config.partner2Avatar || '');
  const [startDate, setStartDate] = useState(config.startDate || '2025-10-25');
  const [cycleType, setCycleType] = useState(config.cycleType || 'yearly');
  const [nextAnnivTitle, setNextAnnivTitle] = useState(config.nextAnnivTitle || 'Anniversary Ke-1 Tahun');
  const [targetCountdownDate, setTargetCountdownDate] = useState(
    config.targetCountdownDate?.slice(0, 16) || '2026-10-25T00:00'
  );
  const [tagline, setTagline] = useState(config.tagline || '');

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
      partner1Name: partner1Name.trim() || 'AIS',
      partner2Name: partner2Name.trim() || 'ELL',
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
        <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F9E2AF] border-2 border-[#2C2A29] rounded-lg -rotate-2">
              <Settings className="w-5 h-5 text-[#2C2A29]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2C2A29]">
                Pengaturan Profil & Jurnal
              </h2>
              <p className="text-xs text-[#2C2A29]/75 font-medium">
                Atur nama panggilan kalian berdua, foto avatar, dan tanggal jadian.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F4A298] border-2 border-[#2C2A29] shadow-tactile-sm hover:opacity-85 transition"
          >
            <X className="w-5 h-5 text-[#2C2A29]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website Title & Cycle */}
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
                Nama Pasangan 1 (AIS) *
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
                Nama Pasangan 2 (ELL) *
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
              <div className="w-12 h-12 rounded-full border-2 border-[#2C2A29] overflow-hidden bg-white shrink-0 shadow-sm">
                {partner1Avatar ? (
                  <img src={partner1Avatar} alt={partner1Name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-[#F4A298]">
                    {partner1Name[0]}
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Foto Profil {partner1Name}</span>
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
              <div className="w-12 h-12 rounded-full border-2 border-[#2C2A29] overflow-hidden bg-white shrink-0 shadow-sm">
                {partner2Avatar ? (
                  <img src={partner2Avatar} alt={partner2Name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-[#A3B899]">
                    {partner2Name[0]}
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Foto Profil {partner2Name}</span>
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
                placeholder="Anniversary Ke-1 Tahun"
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

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-3 border-t-2 border-[#2C2A29]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-[#2C2A29] font-bold text-xs bg-[#FDFBF7] hover:bg-[#E2C2B3]/40 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F4A298] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
