import React, { useState } from 'react';
import { 
  Lock, Unlock, Mail, Clock, Archive, Sparkles, 
  Send, Edit3, Trash2, ChevronRight, Stamp, X, Heart, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DoodleTape } from './Doodles';

export default function VaultSection({
  config,
  letters,
  countdownStats,
  currentUser = null,
  onAddLetter,
  onEditLetter,
  onDeleteLetter,
  onToggleLock,
  onShowToast = null
}) {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [shakingId, setShakingId] = useState(null);
  const [lockedNotice, setLockedNotice] = useState(null);

  // Trigger confetti burst using canvas-confetti
  const fireConfetti = () => {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F4A298', '#A3B899', '#F9E2AF', '#E2C2B3', '#2C2A29']
    });
  };

  const handleOpenLetter = (letter) => {
    const isAuthor = 
      letter.author?.toUpperCase() === currentUser?.username?.toUpperCase() ||
      letter.author?.toUpperCase() === 'AIS & ELL';

    const isEffectivelyLocked = letter.isLocked && !countdownStats.isAnnivUnlocked;

    // If locked and not the author: only the author can preview their own written letter
    if (isEffectivelyLocked && !isAuthor) {
      setShakingId(letter.id);
      setLockedNotice(`Surat rahasia dari ${letter.author}! Sabar ya, surat ini baru bisa kamu buka saat Hari Spesial tiba ✨`);
      setTimeout(() => setShakingId(null), 600);
      setTimeout(() => setLockedNotice(null), 4000);
      return;
    }

    fireConfetti();
    setSelectedLetter(letter);
  };

  return (
    <section className="space-y-8">
      {/* Notice popup if clicking a locked letter authored by partner */}
      {lockedNotice && (
        <div className="bg-[#F4A298] border-2 border-[#2C2A29] rounded-2xl p-4 shadow-tactile flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#2C2A29] shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-[#2C2A29]">{lockedNotice}</p>
          </div>
          <button 
            onClick={() => setLockedNotice(null)}
            className="text-xs font-bold underline hover:opacity-80 shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Live Countdown Ticket */}
      <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-lg rounded-2xl p-6 sm:p-8 relative overflow-hidden text-center">
        <DoodleTape color="rgba(249, 226, 175, 0.95)" position="top-center" />

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#F4A298]/50 border-2 border-[#2C2A29] px-4 py-1 rounded-full text-xs font-bold shadow-tactile-sm">
            <Clock className="w-3.5 h-3.5 text-[#D96B5F]" />
            <span>Target Berikutnya: {countdownStats.targetDateStr}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#2C2A29] tracking-tight">
            {countdownStats.isAnnivUnlocked
              ? `🎉 Selamat Hari Spesial, ${config.partner1Name} & ${config.partner2Name}! 🎉`
              : `Hitung Mundur ${config.nextAnnivTitle}`}
          </h2>

          <p className="font-handwriting text-2xl text-[#2C2A29]/85 max-w-lg mx-auto">
            {countdownStats.isAnnivUnlocked
              ? '"Hari yang dinantikan telah tiba! Segel amplop terbuka otomatis, mari baca surat masa depan kita."'
              : '"Surat masa depan yang masih tersegel lilin akan terbuka otomatis saat hitungan mundur ini selesai."'}
          </p>

          {/* 4 Flip Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-3 max-w-lg mx-auto">
            {[
              { label: 'Hari', val: countdownStats.days, bg: '#F9E2AF' },
              { label: 'Jam', val: countdownStats.hours, bg: '#FDFBF7' },
              { label: 'Menit', val: countdownStats.minutes, bg: '#A3B899' },
              { label: 'Detik', val: countdownStats.seconds, bg: '#F4A298' }
            ].map((box, i) => (
              <div
                key={box.label}
                style={{ backgroundColor: box.bg }}
                className={`p-3.5 rounded-xl border-2 border-[#2C2A29] shadow-tactile text-center ${
                  i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                }`}
              >
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2A29]">
                  {String(box.val).padStart(2, '0')}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2C2A29]/80 border-t border-dashed border-[#2C2A29]/30 mt-1 pt-0.5">
                  {box.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Letters Archive Header & Write CTA */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2A29] flex items-center gap-2">
              <Archive className="w-6 h-6 text-[#D96B5F]" />
              <span>Brankas Arsip Surat & Kapsul Waktu</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#2C2A29]/75 font-medium">
              Surat hanya dapat diubah atau dikelola oleh penulis aslinya. Pasangan hanya bisa membaca saat segel terbuka!
            </p>
          </div>

          <button
            onClick={onAddLetter}
            className="px-4 py-2.5 rounded-xl bg-[#2C2A29] text-[#FDFBF7] font-bold text-xs sm:text-sm border-2 border-[#2C2A29] shadow-tactile flex items-center gap-2 hover:bg-[#2C2A29]/90 hover:translate-x-0.5 hover:translate-y-0.5 transition w-max"
          >
            <Send className="w-4 h-4 text-[#F4A298]" />
            <span>Tulis Surat Masa Depan</span>
          </button>
        </div>

        {/* Letters Grid or Empty State */}
        {letters.length === 0 ? (
          <div className="bg-[#FDFBF7] border-2 border-dashed border-[#2C2A29] rounded-2xl p-10 text-center space-y-4 max-w-lg mx-auto my-6">
            <Mail className="w-12 h-12 mx-auto text-[#D96B5F]" />
            <h3 className="font-serif text-2xl font-bold text-[#2C2A29]">Belum Ada Surat</h3>
            <p className="text-sm text-[#2C2A29]/75 font-medium">
              Brankas surat dan kapsul waktu masih kosong. Tulis surat rahasia atau pesan masa depan untuk pasanganmu sekarang!
            </p>
            <button
              onClick={onAddLetter}
              className="px-5 py-2.5 rounded-xl bg-[#F4A298] text-[#2C2A29] border-2 border-[#2C2A29] font-bold text-sm shadow-tactile inline-flex items-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 transition"
            >
              <Send className="w-4 h-4" />
              <span>Tulis Surat Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {letters.map((letter) => {
            const isAuthor = 
              letter.author?.toUpperCase() === currentUser?.username?.toUpperCase() ||
              letter.author?.toUpperCase() === 'AIS & ELL';

            const isEffectivelyLocked = letter.isLocked && !countdownStats.isAnnivUnlocked;
            const isShaking = shakingId === letter.id;

            return (
              <div
                key={letter.id}
                onClick={() => handleOpenLetter(letter)}
                className={`cursor-pointer group relative rounded-2xl p-6 border-2 border-[#2C2A29] shadow-tactile flex flex-col justify-between min-h-[280px] transition-all duration-200 ${
                  isEffectivelyLocked && !isAuthor
                    ? 'bg-[#E2C2B3]/60 hover:bg-[#E2C2B3]/80'
                    : 'bg-[#FDFBF7] hover:bg-[#F9E2AF]/35 hover:shadow-tactile-lg'
                } ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
              >
                {/* Envelope Header with Author Role Badge */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#2C2A29] bg-[#F9E2AF] shadow-tactile-sm">
                      {letter.edition}
                    </span>
                    <span className="font-handwriting text-xl font-bold text-[#2C2A29]/80">
                      Dari: {letter.author}
                    </span>
                  </div>

                  {/* Relationship Badge: Mine vs To Me */}
                  <div>
                    {isAuthor ? (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#A3B899] border border-[#2C2A29] shadow-tactile-sm">
                        ✍️ Surat Tulisanmu (Dapat Dikelola)
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#F4A298] border border-[#2C2A29] shadow-tactile-sm">
                        💌 Untukmu dari {letter.author}
                      </span>
                    )}
                  </div>
                </div>

                {/* Wax Seal Center */}
                <div className="my-5 flex flex-col items-center justify-center text-center">
                  <div
                    style={{ backgroundColor: isEffectivelyLocked ? (letter.waxColor || '#D96B5F') : '#A3B899' }}
                    className="w-16 h-16 rounded-full border-2 border-[#2C2A29] shadow-tactile flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                  >
                    {isEffectivelyLocked ? (
                      <Lock className="w-7 h-7 text-[#FDFBF7]" />
                    ) : (
                      <Mail className="w-7 h-7 text-[#2C2A29]" />
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[#2C2A29] mt-3 px-2 leading-snug">
                    {letter.title}
                  </h4>

                  {isEffectivelyLocked && (
                    <span className="text-[11px] font-bold text-[#D96B5F] mt-1 bg-[#FDFBF7] border border-[#2C2A29] px-2.5 py-0.5 rounded-full shadow-tactile-sm">
                      {isAuthor ? 'Tersegel Lilin (Masa Depan)' : 'Buka saat Hari Spesial ✨'}
                    </span>
                  )}
                </div>

                {/* Footer Bar: Strict Author Permissions */}
                <div 
                  className="pt-3 border-t-2 border-dashed border-[#2C2A29]/25 flex items-center justify-between text-xs font-bold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[#2C2A29]/75 text-[11px]">
                    {new Date(letter.dateWritten).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Only the author can toggle lock, edit, or delete! */}
                    {isAuthor ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onToggleLock(letter.id, !letter.isLocked)}
                          title={letter.isLocked ? 'Buka Kunci Surat' : 'Kunci dengan Lilin'}
                          className="p-1.5 rounded-md bg-[#FDFBF7] border border-[#2C2A29] hover:bg-[#F9E2AF] transition shadow-tactile-sm"
                        >
                          {letter.isLocked ? <Lock className="w-3 h-3 text-[#D96B5F]" /> : <Unlock className="w-3 h-3 text-[#A3B899]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditLetter(letter)}
                          title="Edit Surat Tulisanmu"
                          className="p-1.5 rounded-md bg-[#FDFBF7] border border-[#2C2A29] hover:bg-[#A3B899] transition shadow-tactile-sm"
                        >
                          <Edit3 className="w-3 h-3 text-[#2C2A29]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteLetter(letter)}
                          title="Hapus Surat"
                          className="p-1.5 rounded-md bg-[#FDFBF7] border border-[#2C2A29] hover:bg-[#F4A298] transition shadow-tactile-sm"
                        >
                          <Trash2 className="w-3 h-3 text-[#2C2A29]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenLetter(letter)}
                          className="ml-1 underline flex items-center gap-0.5 text-xs font-bold text-[#2C2A29]"
                        >
                          <span>Buka</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      /* For non-author partner: Can only wait until open, or read if already unlocked */
                      <button
                        type="button"
                        onClick={() => handleOpenLetter(letter)}
                        className={`px-2.5 py-1 rounded-lg border border-[#2C2A29] text-xs font-bold flex items-center gap-1 shadow-tactile-sm ${
                          isEffectivelyLocked 
                            ? 'bg-[#E2C2B3] text-[#2C2A29]/75 cursor-not-allowed' 
                            : 'bg-[#A3B899] text-[#2C2A29] hover:bg-[#A3B899]/80'
                        }`}
                      >
                        {isEffectivelyLocked ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Menunggu Hari H</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3" />
                            <span>Buka Surat</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* LETTER READER MODAL */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-[#2C2A29]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-xl rounded-2xl max-w-xl w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <DoodleTape color="rgba(244, 162, 152, 0.85)" position="top-center" />

            <div className="flex items-center justify-between border-b-2 border-[#2C2A29] pb-3 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#A3B899] border border-[#2C2A29] px-2.5 py-0.5 rounded shadow-tactile-sm">
                  {selectedLetter.edition}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2C2A29] mt-1.5">
                  {selectedLetter.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="p-1.5 rounded-lg bg-[#F9E2AF] border-2 border-[#2C2A29] shadow-tactile-sm hover:opacity-85"
              >
                <X className="w-5 h-5 text-[#2C2A29]" />
              </button>
            </div>

            {/* Vintage Lined Stationery Sheet */}
            <div className="bg-[#FDFBF7] [background-image:repeating-linear-gradient(transparent,transparent_31px,#E2C2B3_31px,#E2C2B3_32px)] leading-8 p-6 rounded-2xl border-2 border-[#2C2A29] shadow-inner min-h-[260px]">
              <p className="font-handwriting text-2xl sm:text-3xl text-[#2C2A29] whitespace-pre-line leading-relaxed">
                {selectedLetter.content}
              </p>

              <div className="mt-8 text-right font-handwriting text-2xl sm:text-3xl font-bold text-[#2C2A29]">
                — Tertanda penuh sayang, {selectedLetter.author}
              </div>
            </div>

            {/* Footer actions: only author can edit inside modal */}
            <div className="mt-5 flex items-center justify-between text-xs font-bold text-[#2C2A29]/80 pt-2 border-t border-[#2C2A29]/20 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Stamp className="w-4 h-4 text-[#D96B5F]" />
                Ditulis oleh {selectedLetter.author} ({new Date(selectedLetter.dateWritten).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})
              </span>

              <div className="flex items-center gap-2">
                {/* Only author sees edit button in reader modal */}
                {(selectedLetter.author?.toUpperCase() === currentUser?.username?.toUpperCase() ||
                  selectedLetter.author?.toUpperCase() === 'AIS & ELL') && (
                  <button
                    onClick={() => {
                      const l = selectedLetter;
                      setSelectedLetter(null);
                      onEditLetter(l);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F9E2AF] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm flex items-center gap-1 hover:translate-x-0.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Surat
                  </button>
                )}

                <button
                  onClick={() => setSelectedLetter(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#F4A298] border-2 border-[#2C2A29] font-bold text-xs shadow-tactile-sm hover:translate-x-0.5"
                >
                  Tutup Lembaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
