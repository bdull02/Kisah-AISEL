import React, { useState, useEffect } from 'react';
import { X, Send, Lock, Unlock, Mail, Heart, Calendar } from 'lucide-react';
import { DoodleTape } from './Doodles';

export default function AddEditLetterModal({
  isOpen,
  initialData = null,
  currentUser = null,
  partner1Name = 'AIS',
  partner2Name = 'ELL',
  onClose,
  onSave
}) {
  const [edition, setEdition] = useState('');
  const [author, setAuthor] = useState('');
  const [targetUnlockDate, setTargetUnlockDate] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [waxColor, setWaxColor] = useState('#D96B5F');

  useEffect(() => {
    if (initialData) {
      setEdition(initialData.edition || '');
      setAuthor(initialData.author || currentUser?.username || partner1Name);
      setTargetUnlockDate(initialData.targetUnlockDate || new Date().toISOString().slice(0, 10));
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setIsLocked(initialData.isLocked ?? true);
      setWaxColor(initialData.waxColor || '#D96B5F');
    } else {
      setEdition('Spesial Hari Anniversary Mendatang');
      setAuthor(currentUser?.username || partner1Name);
      setTargetUnlockDate(new Date().toISOString().slice(0, 10));
      setTitle('');
      setContent('');
      setIsLocked(true);
      setWaxColor('#D96B5F');
    }
  }, [initialData, isOpen, currentUser, partner1Name]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      id: initialData?.id || 'let-' + Date.now(),
      edition: edition.trim() || 'Edisi Spesial Kita',
      author: author.trim() || 'Kita Berdua',
      dateWritten: initialData?.dateWritten || new Date().toISOString().slice(0, 10),
      targetUnlockDate: targetUnlockDate || new Date().toISOString().slice(0, 10),
      title: title.trim(),
      content: content.trim(),
      isLocked,
      waxColor: isLocked ? waxColor : '#A3B899'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A29]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-xl rounded-2xl max-w-lg w-full p-5 sm:p-7 relative my-auto max-h-[92vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <DoodleTape color="rgba(249, 226, 175, 0.95)" position="top-center" />

        <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F9E2AF] border border-[#2C2A29] px-2 py-0.5 rounded shadow-tactile-sm">
              {initialData ? 'Perbarui Surat' : 'Surat Kapsul Waktu Baru'}
            </span>
            <h2 className="font-serif text-2xl font-bold mt-1">
              {initialData ? 'Edit Surat Kasih' : 'Tulis Surat Masa Depan'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F4A298] border-2 border-[#2C2A29] shadow-tactile-sm hover:opacity-85"
          >
            <X className="w-5 h-5 text-[#2C2A29]" />
          </button>
        </div>

        {/* Edition & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-bold uppercase block mb-1">
              Edisi / Label Momen *
            </label>
            <input
              type="text"
              required
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
              placeholder="Contoh: Anniversary Ke-3 Tahun"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase block mb-1">
              Ditulis Oleh (Pengirim) *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
              placeholder={`${partner1Name} atau ${partner2Name}`}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-bold uppercase block mb-1">
            Judul Surat / Perihal *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 text-sm font-bold focus:outline-none"
            placeholder="Contoh: Harapan dan Doa Kita di Tahun Ini"
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-xs font-bold uppercase block mb-1">
            Isi Surat Penuh Kasih *
          </label>
          <textarea
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#FDFBF7] [background-image:repeating-linear-gradient(transparent,transparent_28px,#E2C2B3_28px,#E2C2B3_29px)] leading-7 border-2 border-[#2C2A29] rounded-xl p-3.5 font-handwriting text-2xl text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]"
            placeholder="Tuliskan kata-kata tulus yang akan menghangatkan hatinya saat amplop ini dibuka..."
          />
        </div>

        {/* Lock Settings */}
        <div className="bg-[#F9E2AF]/45 border-2 border-[#2C2A29] rounded-xl p-3.5 space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="w-4 h-4 accent-[#2C2A29]"
            />
            <span className="text-xs font-bold text-[#2C2A29]">
              Kunci amplop dengan segel lilin (Hanya terbuka saat hari spesial tiba)
            </span>
          </label>

          {isLocked && (
            <div className="flex items-center gap-2 pt-1 border-t border-[#2C2A29]/20 text-xs">
              <span className="font-bold">Warna Segel Lilin:</span>
              {[
                { label: 'Merah Terakota', hex: '#D96B5F' },
                { label: 'Hijau Sage', hex: '#7A9A6E' },
                { label: 'Emas Kuning', hex: '#D4A346' },
                { label: 'Dusty Rose', hex: '#F4A298' }
              ].map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setWaxColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border-2 border-[#2C2A29] ${
                    waxColor === c.hex ? 'ring-2 ring-black scale-110' : 'opacity-80'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-2 flex justify-end gap-3 border-t border-[#2C2A29]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-[#2C2A29] font-bold text-xs bg-[#FDFBF7] hover:bg-[#E2C2B3]/40"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#A3B899] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{initialData ? 'Perbarui Surat' : 'Segel & Masukkan ke Brankas'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
