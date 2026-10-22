import React from 'react';
import { X, MapPin, Edit3, Trash2, Calendar, Heart, Stamp } from 'lucide-react';
import { DoodleTape, DoodleHeart } from './Doodles';

export default function MemoryModal({
  memory,
  onClose,
  onEdit,
  onDelete
}) {
  if (!memory) return null;

  const formattedDate = new Date(memory.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A29]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-xl rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <DoodleTape color={memory.tapeColor || 'rgba(244, 162, 152, 0.85)'} position="top-center" />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#F9E2AF] border border-[#2C2A29] px-2.5 py-0.5 rounded-full shadow-tactile-sm">
              {memory.mood}
            </span>
            {memory.author && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#2C2A29] shadow-tactile-sm ${
                memory.author.toUpperCase() === 'AIS' ? 'bg-[#F4A298]' : 'bg-[#A3B899]'
              }`}>
                ✍️ Ditulis oleh {memory.author}
              </span>
            )}
            <span className="text-xs text-[#2C2A29]/60">•</span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#2C2A29]/80">
              <MapPin className="w-3.5 h-3.5 text-[#D96B5F]" />
              {memory.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(memory)}
              title="Edit Lembaran Kenangan Ini"
              className="p-1.5 rounded-lg bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm hover:bg-[#F9E2AF]/80 transition flex items-center gap-1 text-xs font-bold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit Cerita</span>
            </button>

            <button
              onClick={() => onDelete(memory)}
              title="Hapus Momen Ini"
              className="p-1.5 rounded-lg bg-[#FDFBF7] hover:bg-[#F4A298] border-2 border-[#2C2A29] shadow-tactile-sm transition text-[#2C2A29]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F4A298] border-2 border-[#2C2A29] shadow-tactile-sm hover:opacity-85 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Date */}
        <div className="mb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29] leading-tight">
            {memory.title}
          </h2>
          <p className="font-handwriting text-2xl text-[#2C2A29]/80 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D96B5F]" />
            {formattedDate}
          </p>
        </div>

        {/* Crisp Photo Frame */}
        <div 
          style={{ backgroundColor: memory.frameColor || '#FFFFFF' }}
          className="p-3 sm:p-4 rounded-xl border-2 border-[#2C2A29] shadow-tactile mb-5"
        >
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border-2 border-[#2C2A29] bg-[#2C2A29]/5">
            <img
              src={memory.image}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Full Story Content in Vintage Lined Paper Styling */}
        <div className="bg-[#FDFBF7] [background-image:repeating-linear-gradient(transparent,transparent_31px,#E2C2B3_31px,#E2C2B3_32px)] leading-8 p-5 rounded-xl border-2 border-[#2C2A29] shadow-inner mb-4">
          <p className="text-base text-[#2C2A29] font-medium whitespace-pre-line">
            {memory.story}
          </p>
        </div>

        {/* Secret Note Card if present */}
        {memory.secretNote && (
          <div className="bg-[#F9E2AF]/75 border-2 border-dashed border-[#2C2A29] rounded-xl p-4 flex items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block text-[#2C2A29]/75">
                Catatan Rahasia di Balik Polaroid:
              </span>
              <p className="font-handwriting text-2xl font-bold text-[#2C2A29] mt-0.5">
                "{memory.secretNote}"
              </p>
            </div>
            <DoodleHeart className="w-7 h-7 shrink-0 -rotate-6" />
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-[#2C2A29]/20 flex items-center justify-between">
          <button
            onClick={() => onDelete(memory)}
            className="text-xs font-bold text-[#2C2A29]/70 hover:text-[#D96B5F] flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Lepas kenangan ini dari buku</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#A3B899] border-2 border-[#2C2A29] font-bold text-sm shadow-tactile-sm hover:translate-x-0.5 hover:translate-y-0.5 transition"
          >
            Tutup Halaman
          </button>
        </div>
      </div>
    </div>
  );
}
