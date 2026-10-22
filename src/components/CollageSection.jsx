import React, { useState, useRef } from 'react';
import { 
  Grid, Layers, RotateCw, Edit3, Trash2, 
  Sparkles, Filter, Move, Check, Eye, HelpCircle
} from 'lucide-react';
import { DoodleTape, PaperClip } from './Doodles';
import { PRESET_FRAME_COLORS } from '../services/initialData';

export default function CollageSection({
  memories,
  onViewMemory,
  onEditMemory,
  onDeleteMemory,
  onSavePosition,
  onAddMemory
}) {
  const [collageMode, setCollageMode] = useState('masonry'); // 'masonry' | 'corkboard'
  const [filterMood, setFilterMood] = useState('Semua');
  const [flippedMap, setFlippedMap] = useState({});
  const [quickEditMem, setQuickEditMem] = useState(null);

  // Corkboard Drag State
  const [draggingId, setDraggingId] = useState(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });
  const containerRef = useRef(null);

  // Filter memories
  const displayedMemories = memories.filter(
    m => filterMood === 'Semua' || m.mood === filterMood
  );

  // Unique moods
  const uniqueMoods = ['Semua', ...Array.from(new Set(memories.map(m => m.mood).filter(Boolean)))];

  // Flip toggle
  const toggleFlip = (id) => {
    setFlippedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Pointer Down for Dragging on Corkboard
  const handlePointerDown = (e, mem) => {
    if (collageMode !== 'corkboard') return;
    // Don't drag if clicking buttons
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }

    setDraggingId(mem.id);
    const pos = mem.corkboardPos || { x: 50, y: 50 };
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: pos.x,
      initialY: pos.y
    };
  };

  // Pointer Move on Corkboard
  const handlePointerMove = (e) => {
    if (!draggingId || collageMode !== 'corkboard') return;
    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    const newX = Math.max(10, Math.min(1200, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(10, Math.min(1800, dragStartRef.current.initialY + deltaY));

    // Update locally for smooth rendering
    const target = memories.find(m => m.id === draggingId);
    if (target) {
      target.corkboardPos = { x: newX, y: newY };
    }
  };

  // Pointer Up - Persist coordinate to IndexedDB
  const handlePointerUp = () => {
    if (draggingId) {
      const target = memories.find(m => m.id === draggingId);
      if (target && target.corkboardPos) {
        onSavePosition(target.id, target.corkboardPos);
      }
      setDraggingId(null);
    }
  };

  return (
    <section 
      className="space-y-6 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Collage Controls Bar */}
      <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2A29] flex items-center gap-2">
            <span>Dinding Kolase Polaroid</span>
            <span className="text-xs font-bold bg-[#A3B899] border border-[#2C2A29] px-2.5 py-0.5 rounded-full shadow-tactile-sm">
              {displayedMemories.length} Foto Terkumpul
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#2C2A29]/75 font-medium mt-1">
            {collageMode === 'masonry'
              ? 'Tata letak buku kliping asimetris. Klik ikon putar 🔄 pada foto untuk membaca pesan rahasia di baliknya!'
              : 'Mode Papan Gabus Bebas: Tahan dan seret (drag) polaroid ke mana saja, koordinat otomatis tersimpan di database!'}
          </p>
        </div>

        {/* View Mode Switcher & Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl border-2 border-[#2C2A29] p-1 bg-[#E2C2B3]/35 shadow-tactile-sm">
            <button
              onClick={() => setCollageMode('masonry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                collageMode === 'masonry'
                  ? 'bg-[#F9E2AF] border border-[#2C2A29] shadow-tactile-sm'
                  : 'text-[#2C2A29]/70 hover:text-[#2C2A29]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Kolase</span>
            </button>

            <button
              onClick={() => setCollageMode('corkboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                collageMode === 'corkboard'
                  ? 'bg-[#F4A298] border border-[#2C2A29] shadow-tactile-sm'
                  : 'text-[#2C2A29]/70 hover:text-[#2C2A29]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Papan Gabus (Geser)</span>
            </button>
          </div>

          {/* Mood Tag Filter */}
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl px-3 py-2 text-xs font-bold shadow-tactile-sm focus:outline-none"
          >
            {uniqueMoods.map(m => (
              <option key={m} value={m}>{m === 'Semua' ? 'Semua Suasana' : m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Corkboard Mode Help Banner */}
      {collageMode === 'corkboard' && (
        <div className="bg-[#F9E2AF]/60 border-2 border-[#2C2A29] rounded-xl p-3.5 shadow-tactile-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D96B5F]" />
            <span>Papan Gabus Aktif: Klik tahan pada kartu polaroid lalu seret untuk mengatur tata letak favoritmu!</span>
          </div>
          <span className="text-[11px] font-normal italic text-[#2C2A29]/80">
            *Posisi koordinat otomatis tersimpan di IndexedDB browser.
          </span>
        </div>
      )}

      {/* CANVAS CONTAINER */}
      {displayedMemories.length === 0 ? (
        <div className="bg-[#FDFBF7] border-2 border-dashed border-[#2C2A29] rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto my-10">
          <Sparkles className="w-12 h-12 mx-auto text-[#D96B5F]" />
          <h3 className="font-serif text-2xl font-bold text-[#2C2A29]">
            {memories.length === 0
              ? 'Belum Ada Kenangan'
              : 'Belum Ada Foto dengan Mood Ini'}
          </h3>
          <p className="text-sm text-[#2C2A29]/75 font-medium">
            {memories.length === 0
              ? 'Dinding kolase foto polaroid masih kosong. Yuk tempel momen dan foto manis kalian pertama kali!'
              : `Belum ada foto yang ditandai dengan mood "${filterMood}". Coba ganti filter atau pilih "Semua".`}
          </p>
          {onAddMemory && (
            <button
              onClick={onAddMemory}
              className="px-5 py-2.5 rounded-xl bg-[#F4A298] text-[#2C2A29] border-2 border-[#2C2A29] font-bold text-sm shadow-tactile inline-flex items-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tempel Foto Pertama</span>
            </button>
          )}
        </div>
      ) : collageMode === 'masonry' ? (
        /* MODE 1: MASONRY ASYMMETRIC GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
          {displayedMemories.map((mem, index) => {
            const isFlipped = !!flippedMap[mem.id];
            const tilts = [-2, 1.8, -1.2, 2.3, -1.8, 1.5];
            const tilt = tilts[index % tilts.length];

            return (
              <div
                key={mem.id}
                style={{
                  backgroundColor: isFlipped ? '#FDFBF7' : (mem.frameColor || '#FFFFFF'),
                  transform: `rotate(${tilt}deg)`
                }}
                className="group relative p-4 pb-5 rounded-2xl border-2 border-[#2C2A29] shadow-tactile hover:!rotate-0 hover:shadow-tactile-lg transition-all duration-300"
              >
                {/* Washi Tape */}
                <DoodleTape 
                  color={mem.tapeColor || 'rgba(163, 184, 153, 0.85)'} 
                  position={index % 3 === 0 ? 'top-center' : index % 3 === 1 ? 'top-left' : 'top-right'} 
                />

                {!isFlipped ? (
                  /* FRONT */
                  <div>
                    <div 
                      onClick={() => onViewMemory(mem)}
                      className="cursor-pointer relative aspect-square w-full rounded-xl overflow-hidden border-2 border-[#2C2A29] bg-[#2C2A29]/5"
                    >
                      <img
                        src={mem.image}
                        alt={mem.title}
                        draggable={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#FDFBF7]/95 border border-[#2C2A29] px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm">
                        <Eye className="w-3.5 h-3.5 text-[#D96B5F]" />
                        Baca Cerita
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-start justify-between gap-2">
                      <div onClick={() => onViewMemory(mem)} className="cursor-pointer flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-base text-[#2C2A29] truncate leading-tight">
                            {mem.title}
                          </h4>
                          {mem.author && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#2C2A29] shadow-tactile-sm ${
                              mem.author.toUpperCase() === 'AIS' ? 'bg-[#F4A298]' : 'bg-[#A3B899]'
                            }`}>
                              ✍️ {mem.author}
                            </span>
                          )}
                        </div>
                        <p className="font-handwriting text-xl text-[#2C2A29]/80 truncate mt-0.5">
                          {new Date(mem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {mem.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => toggleFlip(mem.id)}
                          title="Balik Polaroid (Baca Catatan Belakang)"
                          className="p-1.5 rounded-lg bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#F4A298] transition"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-[#2C2A29]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditMemory(mem)}
                          title="Edit Polaroid & Cerita"
                          className="p-1.5 rounded-lg bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#A3B899] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#2C2A29]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BACK (SECRET NOTE) */
                  <div className="min-h-[290px] flex flex-col justify-between [background-image:repeating-linear-gradient(transparent,transparent_31px,#E2C2B3_31px,#E2C2B3_32px)] leading-8 p-4 rounded-xl border-2 border-dashed border-[#2C2A29]/50">
                    <div className="flex items-center justify-between border-b border-[#2C2A29]/20 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F4A298] border border-[#2C2A29] px-2 py-0.5 rounded shadow-tactile-sm">
                        Balik Layar Polaroid
                      </span>
                      <button
                        type="button"
                        onClick={() => onEditMemory(mem)}
                        className="text-xs font-bold underline hover:text-[#D96B5F]"
                      >
                        Edit Catatan
                      </button>
                    </div>

                    <div className="my-auto py-4 text-center px-2">
                      <p className="font-handwriting text-2xl text-[#2C2A29] leading-relaxed">
                        "{mem.secretNote || mem.story?.slice(0, 110) + '...'}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2C2A29]/20">
                      <span className="text-xs font-bold text-[#2C2A29]/70 truncate max-w-[140px]">
                        {mem.location}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlip(mem.id)}
                        className="px-3 py-1 rounded-lg bg-[#A3B899] border-2 border-[#2C2A29] text-xs font-bold shadow-tactile-sm flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        Balik ke Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* MODE 2: FREE-CANVAS CORKBOARD */
        <div 
          ref={containerRef}
          className="relative w-full h-[900px] rounded-2xl border-2 border-[#2C2A29] shadow-inner p-4 overflow-auto bg-[#E2C2B3]/50"
          style={{
            backgroundImage: `radial-gradient(#2C2A29 1.2px, transparent 1.2px), radial-gradient(#F9E2AF 1.2px, #E2C2B3 1.2px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        >
          {displayedMemories.map((mem, index) => {
            const isFlipped = !!flippedMap[mem.id];
            const pos = mem.corkboardPos || { 
              x: (index % 3) * 360 + 40, 
              y: Math.floor(index / 3) * 420 + 40 
            };
            const isBeingDragged = draggingId === mem.id;

            return (
              <div
                key={mem.id}
                onPointerDown={(e) => handlePointerDown(e, mem)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  backgroundColor: isFlipped ? '#FDFBF7' : (mem.frameColor || '#FFFFFF'),
                  transform: `rotate(${mem.rotation || 0}deg) ${isBeingDragged ? 'scale(1.05)' : ''}`,
                  zIndex: isBeingDragged ? 50 : 10 + index
                }}
                className={`absolute w-72 sm:w-80 p-4 pb-5 rounded-2xl border-2 border-[#2C2A29] shadow-tactile-lg cursor-grab active:cursor-grabbing transition-transform ${
                  isBeingDragged ? 'ring-2 ring-[#2C2A29]' : ''
                }`}
              >
                {/* Vintage Paper Clip on Top */}
                <div className="absolute -top-4 left-6 z-30 pointer-events-none">
                  <PaperClip className="w-6 h-10 text-[#2C2A29]" />
                </div>

                {/* Washi Tape */}
                <DoodleTape 
                  color={mem.tapeColor || 'rgba(163, 184, 153, 0.85)'} 
                  position="top-right" 
                />

                {!isFlipped ? (
                  <div>
                    <div 
                      onClick={() => onViewMemory(mem)}
                      className="cursor-pointer relative aspect-square w-full rounded-xl overflow-hidden border-2 border-[#2C2A29] bg-[#2C2A29]/5"
                    >
                      <img
                        src={mem.image}
                        alt={mem.title}
                        draggable={false}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0" onClick={() => onViewMemory(mem)}>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-sm text-[#2C2A29] truncate">
                            {mem.title}
                          </h4>
                          {mem.author && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#2C2A29] shadow-tactile-sm ${
                              mem.author.toUpperCase() === 'AIS' ? 'bg-[#F4A298]' : 'bg-[#A3B899]'
                            }`}>
                              ✍️ {mem.author}
                            </span>
                          )}
                        </div>
                        <p className="font-handwriting text-lg text-[#2C2A29]/80 truncate">
                          {new Date(mem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {mem.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFlip(mem.id)}
                          title="Balik Polaroid"
                          className="p-1 rounded-lg bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#F4A298]"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditMemory(mem)}
                          title="Edit"
                          className="p-1 rounded-lg bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#A3B899]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[260px] flex flex-col justify-between [background-image:repeating-linear-gradient(transparent,transparent_27px,#E2C2B3_27px,#E2C2B3_28px)] leading-7 p-3 rounded-xl border-2 border-dashed border-[#2C2A29]/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4A298] border border-[#2C2A29] px-2 py-0.5 rounded w-max">
                      Catatan Belakang
                    </span>

                    <p className="font-handwriting text-xl text-[#2C2A29] text-center my-auto py-2">
                      "{mem.secretNote || mem.story?.slice(0, 100) + '...'}"
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleFlip(mem.id)}
                      className="px-2.5 py-1 rounded bg-[#A3B899] border-2 border-[#2C2A29] text-xs font-bold shadow-tactile-sm flex items-center justify-center gap-1 mt-2"
                    >
                      <RotateCw className="w-3 h-3" />
                      Kembali ke Foto
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
