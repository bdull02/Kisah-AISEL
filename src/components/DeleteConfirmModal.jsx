import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { DoodleTape } from './Doodles';

export default function DeleteConfirmModal({
  isOpen,
  title = 'Lepas dari Buku Kenangan?',
  message = 'Apakah kamu yakin ingin menghapus lembaran ini? Kenangan yang sudah dilepas tidak bisa dikembalikan lagi ya.',
  confirmText = 'Ya, Lepas Kenangan',
  cancelText = 'Batal Simpan',
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A29]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border-2 border-[#2C2A29] shadow-tactile-lg rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <DoodleTape color="rgba(244, 162, 152, 0.85)" position="top-center" />

        <div className="flex items-start justify-between border-b-2 border-[#2C2A29] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F4A298] border-2 border-[#2C2A29] rounded-lg -rotate-3">
              <Trash2 className="w-5 h-5 text-[#2C2A29]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2C2A29]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#FDFBF7] border-2 border-[#2C2A29] hover:bg-[#F9E2AF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm font-medium text-[#2C2A29]/85 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-[#2C2A29] font-bold text-sm bg-[#FDFBF7] hover:bg-[#E2C2B3]/40 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl border-2 border-[#2C2A29] font-bold text-sm bg-[#F4A298] text-[#2C2A29] shadow-tactile-sm hover:translate-x-0.5 hover:translate-y-0.5 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
