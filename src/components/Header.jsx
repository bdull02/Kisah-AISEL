import React from 'react';
import { Calendar, Settings, FolderHeart, Sparkles, Heart, LogOut } from 'lucide-react';
import { DoodleTape, DoodleHeart, DoodleSparkle } from './Doodles';

export default function Header({
  config,
  durationStats,
  currentUser = null,
  onOpenSettings,
  onLogout
}) {
  const formattedStartDate = new Date(config.startDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="max-w-5xl mx-auto pt-6 sm:pt-8 pb-4 px-4 sm:px-6">
      <div className="relative bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-lg rounded-2xl p-6 sm:p-8 overflow-visible">
        {/* Decorative Washi Tapes on Corners */}
        <DoodleTape color="rgba(244, 162, 152, 0.85)" position="top-left" />
        <DoodleTape color="rgba(163, 184, 153, 0.85)" position="top-right" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Couple Identity & Tagline */}
          <div className="space-y-3 max-w-xl">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F9E2AF] border-2 border-[#2C2A29] px-3.5 py-1 rounded-full shadow-tactile-sm -rotate-1">
              <FolderHeart className="w-4 h-4 text-[#2C2A29]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {config.websiteTitle || 'Arsip Perjalanan Kita'}
              </span>
            </div>

            {/* Couple Avatars & Names */}
            <div className="flex items-center gap-3.5 flex-wrap pt-1">
              {/* Partner 1 Avatar */}
              {config.partner1Avatar && (
                <div className="w-11 h-11 rounded-full border-2 border-[#2C2A29] overflow-hidden shadow-tactile-sm -rotate-3 shrink-0">
                  <img 
                    src={config.partner1Avatar} 
                    alt={config.partner1Name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2C2A29] tracking-tight">
                {config.partner1Name} & {config.partner2Name}
              </h1>

              {/* Partner 2 Avatar */}
              {config.partner2Avatar && (
                <div className="w-11 h-11 rounded-full border-2 border-[#2C2A29] overflow-hidden shadow-tactile-sm rotate-3 shrink-0">
                  <img 
                    src={config.partner2Avatar} 
                    alt={config.partner2Name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <DoodleHeart className="w-8 h-8 -rotate-6 shrink-0" color="#F4A298" />

              {/* Quick Edit Profil & Web button */}
              <button
                onClick={onOpenSettings}
                title="Edit Profil & Pengaturan Jurnal"
                className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#F9E2AF] transition text-xs font-bold flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profil & Web</span>
              </button>

              {/* Logged in User Badge & Logout */}
              {currentUser && (
                <div 
                  style={{ backgroundColor: currentUser.color || '#F9E2AF' }}
                  className="px-3 py-1.5 rounded-xl border-2 border-[#2C2A29] shadow-tactile-sm flex items-center gap-2 text-xs font-bold"
                >
                  <div className="w-4 h-4 rounded-full border border-[#2C2A29] overflow-hidden bg-white shrink-0">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <span>{currentUser.name}</span>
                  <button
                    onClick={onLogout}
                    title="Keluar / Ganti Akun"
                    className="p-1 -mr-1 rounded-md hover:bg-white/50 text-[#2C2A29] transition flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px]">Keluar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-[#2C2A29]/85 font-medium leading-relaxed">
              {config.tagline}
            </p>

            {/* Start Date & Total Days Stamp */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold">
              <span className="inline-flex items-center gap-1.5 bg-[#E2C2B3]/50 border-2 border-[#2C2A29] px-3 py-1 rounded-lg shadow-tactile-sm">
                <Calendar className="w-3.5 h-3.5 text-[#D96B5F]" />
                Dimulai sejak: {formattedStartDate}
              </span>
              <span className="font-handwriting text-2xl text-[#2C2A29]/90 rotate-1">
                ~ Total {durationStats.totalDays.toLocaleString('id-ID')} hari penuh kasih ~
              </span>
            </div>
          </div>

          {/* Right: Tactile Relationship Duration Ticket Counter */}
          <div className="w-full lg:w-auto bg-[#E2C2B3]/40 border-2 border-[#2C2A29] rounded-2xl p-4 sm:p-5 shadow-tactile relative shrink-0">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-handwriting text-xl font-bold text-[#2C2A29]">
                Sudah berjalan selama:
              </span>
              <DoodleSparkle className="w-5 h-5" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
              {/* Years Box */}
              <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl px-3 py-2.5 shadow-tactile-sm">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2A29]">
                  {durationStats.years}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2C2A29]/75 border-t border-dashed border-[#2C2A29]/30 mt-1 pt-0.5">
                  Tahun
                </div>
              </div>

              {/* Months Box */}
              <div className="bg-[#F9E2AF] border-2 border-[#2C2A29] rounded-xl px-3 py-2.5 shadow-tactile-sm -rotate-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2A29]">
                  {durationStats.months}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2C2A29]/75 border-t border-dashed border-[#2C2A29]/30 mt-1 pt-0.5">
                  Bulan
                </div>
              </div>

              {/* Days Box */}
              <div className="bg-[#F4A298] border-2 border-[#2C2A29] rounded-xl px-3 py-2.5 shadow-tactile-sm rotate-1">
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2A29]">
                  {durationStats.days}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2C2A29]/80 border-t border-dashed border-[#2C2A29]/30 mt-1 pt-0.5">
                  Hari
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
