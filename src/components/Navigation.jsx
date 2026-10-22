import React from 'react';
import { BookOpen, Grid, Mail, Settings, Plus, Send } from 'lucide-react';

export default function Navigation({
  activeTab,
  onTabChange,
  memoryCount = 0,
  isAnnivToday = false,
  onAddMemory,
  onAddLetter
}) {
  return (
    <nav className="max-w-5xl mx-auto px-4 sm:px-6 mt-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#2C2A29] pb-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* TAB 1: Kisah Kita */}
        <button
          onClick={() => onTabChange('timeline')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base border-2 border-[#2C2A29] flex items-center gap-2 transition-all duration-150 ${
            activeTab === 'timeline'
              ? 'bg-[#F4A298] text-[#2C2A29] shadow-tactile -translate-y-0.5'
              : 'bg-[#FDFBF7] text-[#2C2A29] hover:bg-[#F9E2AF]/50 hover:shadow-tactile-sm'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kisah Kita</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-[#FDFBF7] border border-[#2C2A29] font-bold">
            {memoryCount}
          </span>
        </button>

        {/* TAB 2: Dinding Kolase */}
        <button
          onClick={() => onTabChange('collage')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base border-2 border-[#2C2A29] flex items-center gap-2 transition-all duration-150 ${
            activeTab === 'collage'
              ? 'bg-[#A3B899] text-[#2C2A29] shadow-tactile -translate-y-0.5'
              : 'bg-[#FDFBF7] text-[#2C2A29] hover:bg-[#F9E2AF]/50 hover:shadow-tactile-sm'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Dinding Kolase</span>
        </button>

        {/* TAB 3: Brankas Surat & Hari Spesial */}
        <button
          onClick={() => onTabChange('vault')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base border-2 border-[#2C2A29] flex items-center gap-2 transition-all duration-150 relative ${
            activeTab === 'vault'
              ? 'bg-[#F9E2AF] text-[#2C2A29] shadow-tactile -translate-y-0.5'
              : 'bg-[#FDFBF7] text-[#2C2A29] hover:bg-[#F9E2AF]/50 hover:shadow-tactile-sm'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Hari Spesial & Surat</span>
          {isAnnivToday && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#D96B5F] border border-[#2C2A29] animate-ping" />
          )}
        </button>

        {/* TAB 4: Kelola & Pengaturan */}
        <button
          onClick={() => onTabChange('settings')}
          className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-[#2C2A29] flex items-center gap-2 transition-all duration-150 ${
            activeTab === 'settings'
              ? 'bg-[#E2C2B3] text-[#2C2A29] shadow-tactile -translate-y-0.5'
              : 'bg-[#FDFBF7] text-[#2C2A29] hover:bg-[#E2C2B3]/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Kelola & Backup</span>
        </button>
      </div>

      {/* Dynamic CTA button */}
      <div className="ml-auto">
        {activeTab === 'vault' ? (
          <button
            onClick={onAddLetter}
            className="px-4 py-2.5 rounded-xl bg-[#2C2A29] text-[#FDFBF7] font-bold text-xs sm:text-sm border-2 border-[#2C2A29] shadow-tactile hover:bg-[#2C2A29]/90 hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-[#F4A298]" />
            <span>Tulis Surat Masa Depan</span>
          </button>
        ) : (
          <button
            onClick={onAddMemory}
            className="px-4 py-2.5 rounded-xl bg-[#2C2A29] text-[#FDFBF7] font-bold text-xs sm:text-sm border-2 border-[#2C2A29] shadow-tactile hover:bg-[#2C2A29]/90 hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#F9E2AF]" />
            <span>Tempel Foto & Cerita</span>
          </button>
        )}
      </div>
    </nav>
  );
}
