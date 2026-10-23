import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check, Sparkles, MapPin, Tag, Heart } from 'lucide-react';
import { DoodleTape } from './Doodles';
import { PRESET_MOODS, PRESET_FRAME_COLORS } from '../services/initialData';

export default function AddEditMemoryModal({
  isOpen,
  initialData = null, // if provided, we are EDITING
  currentUser = null,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [author, setAuthor] = useState(currentUser?.username || 'AIS');
  const [mood, setMood] = useState(PRESET_MOODS[0].label);
  const [customMood, setCustomMood] = useState('');
  const [isCustomMoodActive, setIsCustomMoodActive] = useState(false);
  const [frameColor, setFrameColor] = useState(PRESET_FRAME_COLORS[0].hex);
  const [tapeColor, setTapeColor] = useState(PRESET_FRAME_COLORS[0].tape);
  const [rotation, setRotation] = useState(-1.5);
  const [story, setStory] = useState('');
  const [secretNote, setSecretNote] = useState('');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=90');
  const [imageFileName, setImageFileName] = useState('');

  // Sync state when editing existing or creating new
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
      setLocation(initialData.location || '');
      setAuthor(initialData.author || currentUser?.username || 'AIS');
      
      const foundMood = PRESET_MOODS.find(m => m.label === initialData.mood);
      if (foundMood) {
        setMood(initialData.mood);
        setIsCustomMoodActive(false);
        setCustomMood('');
      } else {
        setIsCustomMoodActive(true);
        setCustomMood(initialData.mood || '');
      }

      setFrameColor(initialData.frameColor || PRESET_FRAME_COLORS[0].hex);
      setTapeColor(initialData.tapeColor || PRESET_FRAME_COLORS[0].tape);
      setRotation(initialData.rotation || -1.5);
      setStory(initialData.story || '');
      setSecretNote(initialData.secretNote || '');
      setImagePreview(initialData.image || '');
      setImageFileName('');
    } else {
      // Defaults for brand new memory
      setTitle('');
      setDate(new Date().toISOString().slice(0, 10));
      setLocation('');
      setAuthor(currentUser?.username || 'AIS');
      setMood(PRESET_MOODS[0].label);
      setIsCustomMoodActive(false);
      setCustomMood('');
      setFrameColor(PRESET_FRAME_COLORS[0].hex);
      setTapeColor(PRESET_FRAME_COLORS[0].tape);
      setRotation(Math.random() > 0.5 ? 1.5 : -1.8);
      setStory('');
      setSecretNote('');
      setImagePreview('https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90');
      setImageFileName('');
    }
  }, [initialData, isOpen, currentUser]);

  if (!isOpen) return null;

  // High-Clarity Image Reader - Preserves high visual fidelity for IndexedDB
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max dimension 1800px ensures ultra-crisp display on retina screens without browser blow-up
        const maxDim = 1800;
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        // High quality JPEG (0.92) for vivid colors and sharp details
        const highQualityDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setImagePreview(highQualityDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFrame = (f) => {
    setFrameColor(f.hex);
    setTapeColor(f.tape);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    const finalMood = isCustomMoodActive 
      ? (customMood.trim() || 'Spesial')
      : mood;

    const memoryPayload = {
      id: initialData?.id || 'mem-' + Date.now(),
      title: title.trim(),
      date,
      location: location.trim() || 'Tempat Spesial Kita',
      author: author.trim() || currentUser?.username || 'AIS',
      mood: finalMood,
      frameColor,
      tapeColor,
      rotation: Number(rotation) || 0,
      secretNote: secretNote.trim(),
      image: imagePreview,
      story: story.trim(),
      corkboardPos: initialData?.corkboardPos || { 
        x: Math.floor(Math.random() * 400) + 50, 
        y: Math.floor(Math.random() * 300) + 50 
      }
    };

    onSave(memoryPayload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A29]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-lg rounded-2xl max-w-2xl w-full p-5 sm:p-7 relative my-auto max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <DoodleTape color={tapeColor || "rgba(163, 184, 153, 0.85)"} position="top-center" />

        <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F9E2AF] border border-[#2C2A29] px-2 py-0.5 rounded">
              {initialData ? 'Perbarui Lembaran' : 'Tempel Lembaran Baru'}
            </span>
            <h2 className="font-serif text-2xl font-bold mt-1">
              {initialData ? 'Edit Momen Kenangan' : 'Tambah Kenangan & Foto Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F4A298] border-2 border-[#2C2A29] hover:bg-[#F4A298]/80 transition"
          >
            <X className="w-5 h-5 text-[#2C2A29]" />
          </button>
        </div>

        {/* Photo Upload & Preview Section */}
        <div className="bg-[#E2C2B3]/35 p-4 rounded-xl border-2 border-dashed border-[#2C2A29] flex flex-col sm:flex-row items-center gap-4">
          <div 
            style={{ backgroundColor: frameColor }}
            className="w-40 sm:w-44 aspect-square shrink-0 p-2.5 rounded-lg border-2 border-[#2C2A29] shadow-tactile-sm flex flex-col justify-between"
          >
            <div className="w-full h-[76%] rounded overflow-hidden border border-[#2C2A29] bg-[#2C2A29]/10">
              <img 
                src={imagePreview} 
                alt="Pratinjau Foto" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center font-handwriting text-sm font-bold truncate text-[#2C2A29]">
              {title || 'Pratinjau Polaroid'}
            </div>
          </div>

          <div className="space-y-2.5 w-full">
            <h4 className="font-bold text-sm text-[#2C2A29] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#D96B5F]" />
              Pilih Foto Kenangan (Kualitas Tinggi)
            </h4>
            <p className="text-xs text-[#2C2A29]/80 leading-relaxed">
              Foto disimpan langsung ke IndexedDB tanpa penurunan resolusi tajam. Mendukung format JPEG, PNG, WEBP.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="px-4 py-2 rounded-xl bg-[#F9E2AF] border-2 border-[#2C2A29] text-xs font-bold shadow-tactile-sm cursor-pointer hover:bg-[#F9E2AF]/80 transition inline-flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>{imageFileName ? 'Ganti Foto Terpilih' : 'Unggah Dari Perangkat'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {imageFileName && (
                <span className="text-xs font-mono bg-white border border-[#2C2A29] px-2 py-1 rounded truncate max-w-[200px]">
                  {imageFileName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Inputs: Title & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase block mb-1">Judul Momen / Judul Cerita *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kencan Pertama di Tengah Hujan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2A29]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase block mb-1">Tanggal Kejadian *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2A29]"
            />
          </div>
        </div>

        {/* Author / Penulis Selector */}
        <div className="bg-[#FDFBF7] p-3 rounded-xl border-2 border-[#2C2A29] shadow-tactile-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block text-[#2C2A29]">
              ✍️ Ditulis / Ditempel Oleh:
            </span>
            <span className="text-[11px] text-[#2C2A29]/75">
              Tandai siapa yang mengabadikan momen manis ini
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'AIS', label: 'AIS 🌸', color: '#F4A298' },
              { id: 'ELL', label: 'ELL 🌿', color: '#A3B899' }
            ].map((p) => {
              const isSelected = author === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAuthor(p.id)}
                  style={{
                    backgroundColor: isSelected ? p.color : '#FFFFFF'
                  }}
                  className={`px-3.5 py-1.5 rounded-xl border-2 border-[#2C2A29] text-xs font-bold transition-all ${
                    isSelected
                      ? 'shadow-tactile-sm ring-2 ring-[#2C2A29] -translate-y-0.5'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs: Location & Mood */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D96B5F]" />
              Lokasi / Nama Tempat
            </label>
            <input
              type="text"
              placeholder="Contoh: Kedai Sudut Kecil, Blok M"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#2C2A29]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#A3B899]" />
                Badge Suasana (Mood)
              </label>
              <button
                type="button"
                onClick={() => setIsCustomMoodActive(!isCustomMoodActive)}
                className="text-[11px] font-bold text-[#D96B5F] underline"
              >
                {isCustomMoodActive ? 'Gunakan Pilihan Preset' : '+ Buat Mood Kustom'}
              </button>
            </div>

            {isCustomMoodActive ? (
              <input
                type="text"
                placeholder="Ketik suasana sendiri (misal: Rindu Banget)"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                className="w-full bg-[#F9E2AF]/40 border-2 border-[#2C2A29] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none"
              />
            ) : (
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-white border-2 border-[#2C2A29] rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none"
              >
                {PRESET_MOODS.map(m => (
                  <option key={m.label} value={m.label}>{m.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Frame & Tape Customization */}
        <div>
          <label className="text-xs font-bold uppercase block mb-1.5">
            Warna Bingkai Polaroid & Selotip (Washi Tape)
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_FRAME_COLORS.map((fc) => (
              <button
                key={fc.name}
                type="button"
                onClick={() => handleSelectFrame(fc)}
                style={{ backgroundColor: fc.hex }}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#2C2A29] text-xs font-bold flex items-center gap-1.5 transition ${
                  frameColor === fc.hex ? 'shadow-tactile-sm ring-2 ring-[#2C2A29]' : 'opacity-75 hover:opacity-100'
                }`}
              >
                {frameColor === fc.hex && <Check className="w-3.5 h-3.5 text-[#2C2A29]" />}
                {fc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Story Textarea */}
        <div>
          <label className="text-xs font-bold uppercase block mb-1">
            Cerita Lengkap di Balik Foto *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Tuliskan cerita hangat, detail momen, candaan kecil, atau alasan mengapa foto ini begitu berharga..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full bg-white border-2 border-[#2C2A29] rounded-xl p-3.5 text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2C2A29]"
          />
        </div>

        {/* Secret Back-of-Photo Note */}
        <div className="bg-[#F9E2AF]/35 p-3.5 rounded-xl border-2 border-dashed border-[#2C2A29]">
          <label className="text-xs font-bold uppercase block mb-1 text-[#2C2A29] flex items-center justify-between">
            <span>Catatan Rahasia di Balik Polaroid</span>
            <span className="text-[11px] font-normal italic">Muncul saat kartu dibalik di Dinding Kolase!</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Waktu itu sebenernya aku deg-degan banget sampai tangan dingin!"
            value={secretNote}
            onChange={(e) => setSecretNote(e.target.value)}
            className="w-full bg-[#FDFBF7] border-2 border-[#2C2A29] rounded-xl px-3.5 py-2 font-handwriting text-xl text-[#2C2A29] focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t-2 border-[#2C2A29]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border-2 border-[#2C2A29] font-bold text-sm bg-[#FDFBF7] hover:bg-[#E2C2B3]/40 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl border-2 border-[#2C2A29] font-bold text-sm bg-[#F4A298] text-[#2C2A29] shadow-tactile hover:-translate-y-0.5 transition"
          >
            {initialData ? 'Simpan Pembaruan Momen' : 'Tempel ke Jurnal Kita'}
          </button>
        </div>
      </form>
    </div>
  );
}
