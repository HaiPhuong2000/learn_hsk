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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div 
        className="glass-panel"
        style={{
          padding: '3rem',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          className="gradient-text" 
          style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          Chào mừng! 🎉
        </h2>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--color-text-secondary)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Lập trình bởi <span style={{ 
            color: 'var(--color-accent-primary)', 
            fontWeight: 'bold' 
          }}>Nguyễn Hải Phương</span>
        </p>

        <button 
          onClick={handleClose}
          className="glass-button"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Bắt đầu học
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
