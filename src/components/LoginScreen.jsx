import React, { useState } from 'react';
import { KeyRound, Heart, Lock, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DoodleTape } from './Doodles';
import { VALID_USERS, ANNIV_PASSWORD } from '../services/initialData';

export default function LoginScreen({ config = null, onLogin }) {
  const [selectedUser, setSelectedUser] = useState('AIS'); // 'AIS' | 'ELL'
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Synchronize avatar and name with site config if customized
  const userList = [
    {
      username: 'AIS',
      name: config?.partner1Name || 'AIS',
      color: '#F4A298',
      avatar: config?.partner1Avatar || VALID_USERS[0].avatar
    },
    {
      username: 'ELL',
      name: config?.partner2Name || 'ELL',
      color: '#A3B899',
      avatar: config?.partner2Avatar || VALID_USERS[1].avatar
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = selectedUser.trim().toUpperCase();
    const trimmedPass = password.trim();

    // Verify user
    const matchedUser = userList.find(
      u => u.username.toUpperCase() === trimmedUser
    );

    if (!matchedUser) {
      triggerError('Pilih atau masukkan pengguna yang benar (AIS atau ELL).');
      return;
    }

    // Verify password (251025)
    if (trimmedPass !== ANNIV_PASSWORD) {
      setShowHint(true);
      triggerError('Kata kunci salah! Coba ingat kembali tanggal spesial kita ya.');
      return;
    }

    // Success! Confetti burst
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F4A298', '#A3B899', '#F9E2AF', '#E2C2B3', '#2C2A29']
    });

    // Save session
    const sessionData = {
      username: matchedUser.username,
      name: matchedUser.name,
      color: matchedUser.color,
      avatar: matchedUser.avatar,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('kisah_kita_session', JSON.stringify(sessionData));

    onLogin(sessionData);
  };

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 selection:bg-[#F4A298]/40"
      style={{
        backgroundColor: '#FDFBF7',
        backgroundImage: `radial-gradient(#2C2A29 0.85px, transparent 0.85px), radial-gradient(#E2C2B3 0.85px, #FDFBF7 0.85px)`,
        backgroundSize: '28px 28px',
        backgroundPosition: '0 0, 14px 14px'
      }}
    >
      <div 
        className={`bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-xl rounded-3xl max-w-md w-full p-6 sm:p-8 relative my-8 transition-transform duration-200 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
      >
        {/* Decorative Washi Tapes */}
        <DoodleTape color="rgba(244, 162, 152, 0.85)" position="top-left" />
        <DoodleTape color="rgba(163, 184, 153, 0.85)" position="top-right" />

        {/* Header Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 bg-[#F9E2AF] border-2 border-[#2C2A29] px-3.5 py-1 rounded-full shadow-tactile-sm -rotate-1">
            <Lock className="w-3.5 h-3.5 text-[#2C2A29]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Gerbang Rahasia Kita
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C2A29] tracking-tight">
            {config?.websiteTitle || 'Kisah Kita'}
          </h1>

          <p className="font-handwriting text-2xl text-[#2C2A29]/80">
            "Ruang arsip kenangan, tawa, dan surat cinta kita berdua."
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* User Selection Radio Cards with Synced Photos */}
          <div>
            <label className="text-xs font-bold uppercase block mb-2 text-[#2C2A29] flex items-center justify-between">
              <span>Siapa yang sedang membuka jurnal? *</span>
              <span className="text-[11px] font-normal italic text-[#2C2A29]/70">Pilih salah satu</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {userList.map((user) => {
                const isSelected = selectedUser === user.username;
                return (
                  <button
                    key={user.username}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user.username);
                      setErrorMsg('');
                    }}
                    style={{
                      backgroundColor: isSelected ? user.color : '#FDFBF7'
                    }}
                    className={`p-3 rounded-2xl border-2 border-[#2C2A29] flex items-center gap-3 transition-all ${
                      isSelected 
                        ? 'shadow-tactile -translate-y-0.5 ring-2 ring-[#2C2A29]' 
                        : 'opacity-75 hover:opacity-100 shadow-tactile-sm'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full border-2 border-[#2C2A29] overflow-hidden bg-white shrink-0 shadow-sm">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-serif font-bold text-base text-[#2C2A29] leading-tight truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">
                        {user.username === 'AIS' ? 'Partner 1' : 'Partner 2'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-bold uppercase block mb-1.5 text-[#2C2A29] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D96B5F]" />
                Kunci Rahasia (Password) *
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan kata sandi..."
                className="w-full bg-white border-2 border-[#2C2A29] rounded-xl pl-3.5 pr-11 py-2.5 text-sm font-bold shadow-tactile-sm focus:outline-none focus:ring-2 focus:ring-[#2C2A29] tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2C2A29]/70 hover:text-[#2C2A29]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Hint Box: only shown if wrong password was entered */}
            {showHint && (
              <div className="mt-2.5 bg-[#F9E2AF]/75 border-2 border-dashed border-[#2C2A29] rounded-xl p-2.5 text-xs font-bold text-[#2C2A29] flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#D96B5F] shrink-0" />
                <span>💡 Petunjuk: Tanggal jadian kita berdua (Format 6 digit: DDMMYY)</span>
              </div>
            )}
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="bg-[#F4A298] border-2 border-[#2C2A29] rounded-xl p-3 text-xs font-bold text-[#2C2A29] shadow-tactile-sm flex items-center gap-2">
              <Heart className="w-4 h-4 shrink-0 fill-[#D96B5F]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2C2A29] text-[#FDFBF7] font-bold text-sm border-2 border-[#2C2A29] shadow-tactile hover:bg-[#2C2A29]/90 hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            <span>Buka Lembaran Buku</span>
            <ArrowRight className="w-4 h-4 text-[#F9E2AF]" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#2C2A29]/25 text-center text-xs text-[#2C2A29]/70 font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#A3B899]" />
          <span>Hanya untuk AIS & ELL • Terproteksi & Bersama Selamanya</span>
        </div>
      </div>
    </div>
  );
}
