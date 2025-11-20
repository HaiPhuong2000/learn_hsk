import React, { useState, useEffect } from 'react';

const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã xem modal chưa
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="glass-panel p-12 max-w-lg w-[90%] text-center bg-gradient-to-br from-slate-800/95 to-slate-900/98 border border-white/10 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
          Chào mừng! 🎉
        </h2>
        
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          Lập trình bởi <span className="text-violet-500 font-bold">Nguyễn Hải Phương</span>
        </p>

        <button 
          onClick={handleClose}
          className="glass-button px-8 py-3 text-base font-bold bg-gradient-to-br from-violet-500 to-teal-500 border-none cursor-pointer hover:shadow-lg hover:shadow-violet-500/20"
        >
          Bắt đầu học
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
