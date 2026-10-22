import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Search, ArrowUpDown, Filter, MapPin, 
  Heart, Calendar, Eye, Edit3, Trash2, PlusCircle
} from 'lucide-react';
import { DoodleTape, DoodleHeart } from './Doodles';
import { PRESET_MOODS } from '../services/initialData';

export default function TimelineSection({
  memories,
  onViewMemory,
  onEditMemory,
  onDeleteMemory,
  onAddMemory
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [selectedMood, setSelectedMood] = useState('Semua');

  // Filtered and Sorted Memories
  const processedMemories = useMemo(() => {
    let list = [...memories];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.story.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        (m.secretNote && m.secretNote.toLowerCase().includes(q))
      );
    }

    // Mood filter
    if (selectedMood !== 'Semua') {
      list = list.filter(m => m.mood === selectedMood);
    }

    // Sorting
    list.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [memories, searchTerm, sortOrder, selectedMood]);

  // Extract all unique moods present in memories + presets
  const availableMoods = useMemo(() => {
    const set = new Set(memories.map(m => m.mood).filter(Boolean));
    return ['Semua', ...Array.from(set)];
  }, [memories]);

  return (
    <section className="space-y-6">
      {/* Top Banner & Search/Filter Controls */}
      <div className="bg-[#F9E2AF]/50 border-2 border-[#2C2A29] rounded-2xl p-4 sm:p-5 shadow-tactile space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl shadow-tactile-sm -rotate-3">
              <Sparkles className="w-5 h-5 text-[#2C2A29]" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2A29]">
                Garis Waktu Lembaran Cerita
              </h2>
              <p className="text-xs sm:text-sm text-[#2C2A29]/80 font-medium">
                Setiap foto memiliki perjalanan dan obrolan kecil yang tak ingin kita lupakan.
              </p>
            </div>
          </div>
          <div className="font-handwriting text-2xl font-bold text-[#2C2A29] sm:text-right">
            "Waktu berjalan, tapi kenangan kita abadi."
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t-2 border-[#2C2A29]/20">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#2C2A29]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari cerita, tempat, atau obrolan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm font-bold shadow-tactile-sm focus:outline-none"
            />
          </div>

          {/* Mood Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#2C2A29]/70 shrink-0" />
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold shadow-tactile-sm focus:outline-none"
            >
              {availableMoods.map(m => (
                <option key={m} value={m}>Suasana: {m}</option>
              ))}
            </select>
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-sm text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-[#A3B899]/30 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'newest' ? 'Terbaru Duluan' : 'Awal Duluan'}</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {processedMemories.length === 0 ? (
        <div className="bg-[#FDFBF7] border-2 border-dashed border-[#2C2A29] rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto my-12">
          <DoodleHeart className="w-12 h-12 mx-auto" />
          <h3 className="font-serif text-2xl font-bold">Belum Ada Kenangan yang Cocok</h3>
          <p className="text-sm text-[#2C2A29]/75 font-medium">
            {searchTerm || selectedMood !== 'Semua'
              ? 'Tidak ditemukan momen dengan kata kunci atau filter ini. Coba ubah pencarianmu.'
              : 'Jurnal masih kosong. Yuk tempel momen dan foto pertama kalian!'}
          </p>
          <button
            onClick={onAddMemory}
            className="px-5 py-2.5 rounded-xl bg-[#F4A298] border-2 border-[#2C2A29] font-bold text-sm shadow-tactile inline-flex items-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tempel Momen Baru Sekarang</span>
          </button>
        </div>
      ) : (
        /* Winding Timeline Path */
        <div className="relative pt-6">
          {/* Central Vertical Dashed Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-[#2C2A29]/50 pointer-events-none" />

          <div className="space-y-12 sm:space-y-16 relative">
            {processedMemories.map((mem, index) => {
              const isLeft = index % 2 === 0;
              const formattedDate = new Date(mem.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div
                  key={mem.id}
                  className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Polaroid Photo Card Side */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div
                      onClick={() => onViewMemory(mem)}
                      style={{
                        backgroundColor: mem.frameColor || '#FFFFFF',
                        transform: `rotate(${mem.rotation || -1.5}deg)`
                      }}
                      className="group cursor-pointer relative w-full max-w-md p-4 pb-5 rounded-2xl border-2 border-[#2C2A29] shadow-tactile hover:!rotate-0 hover:shadow-tactile-lg transition-all duration-300"
                    >
                      {/* Washi Tape */}
                      <DoodleTape 
                        color={mem.tapeColor || 'rgba(244, 162, 152, 0.85)'} 
                        position={isLeft ? 'top-left' : 'top-right'} 
                      />

                      {/* Photo Frame */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-[#2C2A29] bg-[#E2C2B3]/25">
                        <img
                          src={mem.image}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2.5 right-2.5 bg-[#FDFBF7]/95 border border-[#2C2A29] px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-[#D96B5F]" />
                          <span>Buka Jurnal</span>
                        </div>
                      </div>

                      {/* Polaroid Footer */}
                      <div className="mt-3.5 flex items-center justify-between gap-2 px-1 flex-wrap">
                        <span className="font-handwriting text-2xl font-bold text-[#2C2A29]">
                          {formattedDate}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {mem.author && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#2C2A29] shadow-tactile-sm ${
                              mem.author.toUpperCase() === 'AIS' ? 'bg-[#F4A298]' : 'bg-[#A3B899]'
                            }`}>
                              ✍️ {mem.author}
                            </span>
                          )}
                          <span className="text-xs font-bold px-3 py-0.5 rounded-full border border-[#2C2A29] bg-[#F9E2AF] shadow-tactile-sm">
                            {mem.mood}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Central Node Badge */}
                  <div className="hidden md:flex items-center justify-center z-10 w-12 h-12 rounded-full bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm shrink-0">
                    <Heart className="w-5 h-5 text-[#2C2A29] fill-[#F4A298]" />
                  </div>

                  {/* Story Note Card Side */}
                  <div className="w-full md:w-1/2">
                    <div 
                      onClick={() => onViewMemory(mem)}
                      className="cursor-pointer bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile rounded-2xl p-6 relative hover:bg-[#F9E2AF]/15 transition-all"
                    >
                      {/* Location & Quick Action Bar */}
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#2C2A29]/75 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D96B5F]" />
                            {mem.location}
                          </span>
                          {mem.author && (
                            <span className="text-[11px] font-bold text-[#2C2A29]/80 underline">
                              Oleh {mem.author}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditMemory(mem)}
                            title="Edit Cerita"
                            className="p-1 rounded-md bg-[#FDFBF7] hover:bg-[#F9E2AF] border border-[#2C2A29] transition"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#2C2A29]" />
                          </button>
                          <button
                            onClick={() => onDeleteMemory(mem)}
                            title="Hapus Momen"
                            className="p-1 rounded-md bg-[#FDFBF7] hover:bg-[#F4A298] border border-[#2C2A29] transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#2C2A29]" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2A29] mb-2 leading-snug">
                        {mem.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#2C2A29]/85 leading-relaxed line-clamp-4">
                        {mem.story}
                      </p>

                      {mem.secretNote && (
                        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#2C2A29]/25 flex items-start gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#A3B899] border border-[#2C2A29] px-2 py-0.5 rounded shadow-tactile-sm shrink-0">
                            Catatan Rahasia:
                          </span>
                          <p className="font-handwriting text-xl text-[#2C2A29] leading-tight">
                            "{mem.secretNote}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
