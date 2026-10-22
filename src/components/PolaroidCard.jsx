import React, { useState } from 'react';
import { RotateCw, Eye, Edit3, Trash2, MapPin, Stamp, Heart } from 'lucide-react';
import { DoodleTape } from './Doodles';

export default function PolaroidCard({
  memory,
  onView,
  onEdit,
  onDelete,
  tapePosition = 'top-center',
  showFlipButton = true,
  isDraggable = false,
  className = ""
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const formattedDate = new Date(memory.date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      style={{
        backgroundColor: isFlipped ? '#FDFBF7' : (memory.frameColor || '#FFFFFF'),
        transform: `rotate(${memory.rotation || 0}deg)`
      }}
      className={`group relative p-4 pb-5 rounded-2xl border-2 border-[#2C2A29] shadow-tactile transition-all duration-300 hover:!rotate-0 hover:shadow-tactile-lg ${className}`}
    >
      {/* Decorative Washi Tape */}
      <DoodleTape 
        color={memory.tapeColor || 'rgba(244, 162, 152, 0.85)'} 
        position={tapePosition} 
      />

      {!isFlipped ? (
        /* FRONT OF POLAROID */
        <div className="flex flex-col">
          {/* Photo Frame */}
          <div 
            onClick={() => onView(memory)}
            className="cursor-pointer relative aspect-square sm:aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-[#2C2A29] bg-[#2C2A29]/5"
          >
            <img
              src={memory.image}
              alt={memory.title}
              draggable={false}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="absolute bottom-2 right-2 bg-[#FDFBF7]/95 border border-[#2C2A29] px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100">
              <Eye className="w-3.5 h-3.5 text-[#D96B5F]" />
              Baca Kisah
            </div>

            {memory.mood && (
              <div className="absolute top-2 left-2 bg-[#F9E2AF] border border-[#2C2A29] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                {memory.mood}
              </div>
            )}
          </div>

          {/* Handwritten Caption & Action Controls */}
          <div className="mt-3.5 flex items-start justify-between gap-2">
            <div 
              onClick={() => onView(memory)}
              className="cursor-pointer flex-1 min-w-0"
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-serif font-bold text-base text-[#2C2A29] truncate leading-snug">
                  {memory.title}
                </h4>
                {memory.author && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#2C2A29] shadow-tactile-sm ${
                    memory.author.toUpperCase() === 'AIS' ? 'bg-[#F4A298]' : 'bg-[#A3B899]'
                  }`}>
                    ✍️ {memory.author}
                  </span>
                )}
              </div>
              <p className="font-handwriting text-xl text-[#2C2A29]/80 truncate mt-0.5">
                {formattedDate} • {memory.location}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
              {showFlipButton && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  title="Balik Polaroid (Baca Catatan Rahasia)"
                  className="p-1.5 rounded-lg bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#F4A298] transition"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#2C2A29]" />
                </button>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(memory);
                  }}
                  title="Edit Kenangan Ini"
                  className="p-1.5 rounded-lg bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#A3B899] transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#2C2A29]" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* BACK OF POLAROID (SECRET NOTE & LINED PAPER) */
        <div className="min-h-[290px] flex flex-col justify-between [background-image:repeating-linear-gradient(transparent,transparent_31px,#E2C2B3_31px,#E2C2B3_32px)] leading-8 p-4 rounded-xl border-2 border-dashed border-[#2C2A29]/50">
          <div className="flex items-center justify-between border-b border-[#2C2A29]/20 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F4A298] border border-[#2C2A29] px-2 py-0.5 rounded shadow-tactile-sm">
              Sisi Belakang Polaroid
            </span>
            <Stamp className="w-4 h-4 text-[#2C2A29]/70" />
          </div>

          <div className="my-auto py-4 text-center px-2">
            <p className="font-handwriting text-2xl text-[#2C2A29] leading-relaxed">
              "{memory.secretNote || memory.story?.slice(0, 120) + '...'}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#2C2A29]/20">
            <span className="text-xs font-bold text-[#2C2A29]/70 truncate max-w-[150px]">
              {memory.location}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="px-3 py-1 rounded-lg bg-[#A3B899] border-2 border-[#2C2A29] text-xs font-bold shadow-tactile-sm flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Lihat Foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
