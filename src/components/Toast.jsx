import React from 'react';
import { Stamp, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#F9E2AF] text-[#2C2A29]',
    info: 'bg-[#A3B899] text-[#2C2A29]',
    warning: 'bg-[#F4A298] text-[#2C2A29]',
    love: 'bg-[#F4A298] text-[#2C2A29]'
  };

  const icon = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2C2A29]" />,
    info: <Stamp className="w-5 h-5 shrink-0 text-[#2C2A29]" />,
    warning: <AlertCircle className="w-5 h-5 shrink-0 text-[#2C2A29]" />,
    love: <Sparkles className="w-5 h-5 shrink-0 text-[#2C2A29]" />
  }[toast.type || 'info'];

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm pointer-events-auto">
      <div 
        className={`border-2 border-[#2C2A29] shadow-tactile p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 ${bgStyles[toast.type] || bgStyles.info}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon}
          <p className="text-xs sm:text-sm font-bold leading-snug break-words">{toast.message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-xs font-bold underline hover:opacity-75 shrink-0 ml-2"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
