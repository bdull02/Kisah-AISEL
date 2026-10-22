import React from 'react';

export const DoodleSparkle = ({ className = "w-6 h-6", color = "#F9E2AF" }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path 
      d="M20 3C20 12 28 20 37 20C28 20 20 28 20 37C20 28 12 20 3 20C12 20 20 12 20 3Z" 
      fill={color} 
      stroke="#2C2A29" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleHeart = ({ className = "w-7 h-7", color = "#F4A298" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path 
      d="M24 41C24 41 7 29.6 7 16.5C7 10.5 11.8 6 17.3 6C20.8 6 23.2 8.1 24 10.5C24.8 8.1 27.2 6 30.7 6C36.2 6 41 10.5 41 16.5C41 29.6 24 41 24 41Z" 
      fill={color} 
      stroke="#2C2A29" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleTape = ({ color = "rgba(244, 162, 152, 0.8)", position = "top-center", className = "" }) => {
  const posClasses = {
    "top-center": "-top-3.5 left-1/2 -translate-x-1/2 -rotate-2 w-28 h-7",
    "top-left": "-top-3.5 -left-3 -rotate-12 w-24 h-6",
    "top-right": "-top-3.5 -right-3 rotate-12 w-24 h-6",
    "bottom-right": "-bottom-3 -right-3 -rotate-6 w-24 h-6",
    "custom": ""
  };

  return (
    <div 
      className={`absolute z-20 pointer-events-none border border-[#2C2A29]/25 shadow-sm transition-transform ${posClasses[position] || posClasses["top-center"]} ${className}`}
      style={{ 
        backgroundColor: color,
        clipPath: 'polygon(3% 0%, 97% 2%, 100% 93%, 95% 100%, 4% 97%, 0% 7%)'
      }}
    >
      <div className="w-full h-full opacity-25 bg-[radial-gradient(#2C2A29_1px,transparent_1px)] [background-size:4px_4px]" />
    </div>
  );
};

export const PaperClip = ({ className = "w-5 h-8 text-[#2C2A29]" }) => (
  <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 14v17a6 6 0 1 0 12 0V9a8 8 0 1 0-16 0v21" />
  </svg>
);

export const WaxSealStamp = ({ isLocked = true, color = "#D96B5F", size = "w-16 h-16" }) => (
  <div 
    style={{ backgroundColor: color }}
    className={`${size} rounded-full border-2 border-[#2C2A29] shadow-tactile flex items-center justify-center transition-all duration-300 relative group-hover:scale-105`}
  >
    <div className="w-[82%] h-[82%] rounded-full border border-dashed border-[#FDFBF7]/60 flex items-center justify-center">
      <span className="font-serif font-black text-xl text-[#FDFBF7] drop-shadow-sm">
        {isLocked ? '🔒' : '💌'}
      </span>
    </div>
  </div>
);
