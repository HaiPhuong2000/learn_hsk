import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import HanziWriter from 'hanzi-writer';
import { X, Play, PenTool, Eye, EyeOff } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface WritingPracticeProps {
  id: string | number;
  character: string;
  pinyin: string;
  meaning: string;
  onClose: () => void;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ id, character, pinyin, meaning, onClose }) => {
  const { updateProgress } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HanziWriter[]>([]);
  const [showOutline, setShowOutline] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Split the character string into individual characters
  const characters = character.split('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous writers to prevent duplication (React StrictMode)
    containerRef.current.innerHTML = '';
    writersRef.current = [];

    const size = Math.min(window.innerWidth / characters.length - 20, 300); // Responsive size
    const clampedSize = Math.max(Math.min(size, 150), 80); // Clamp between 80 and 150

    characters.forEach((char) => {
      const charDiv = document.createElement('div');
      charDiv.style.display = 'inline-block';
      charDiv.style.margin = '5px';
      charDiv.style.backgroundColor = 'white';
      charDiv.style.borderRadius = '8px';
      containerRef.current?.appendChild(charDiv);

      const writer = HanziWriter.create(charDiv, char, {
        width: clampedSize,
        height: clampedSize,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        radicalColor: '#3b82f6', // Blue for radicals
      });

      writersRef.current.push(writer);
    });

    return () => {
      // Cleanup logic if needed
    };
  }, [character]);

  const animate = () => {
    setIsQuizMode(false);
    writersRef.current.forEach(writer => {
      writer.animateCharacter();
    });
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    writersRef.current.forEach(writer => {
      writer.quiz({
        onComplete: () => {
          updateProgress(id, true);
        }
      });
    });
  };

  const toggleOutline = () => {
    const newShow = !showOutline;
    setShowOutline(newShow);
    writersRef.current.forEach(writer => {
      if (newShow) {
        writer.showOutline();
      } else {
        writer.hideOutline();
      }
    });
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '600px',
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-glass-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '12px'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '0.5rem' }}>{character}</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>{pinyin}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{meaning}</div>
        </div>

        <div 
          ref={containerRef} 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            marginBottom: '1rem',
            gap: '1rem'
          }} 
        />

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={animate} 
            className="glass-button" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Play size={18} /> Mẫu
          </button>
          <button 
            onClick={startQuiz} 
            className="glass-button" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: isQuizMode ? 'var(--color-accent-primary)' : undefined 
            }}
          >
            <PenTool size={18} /> Tập viết
          </button>
          <button 
            onClick={toggleOutline} 
            className="glass-button" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {showOutline ? <EyeOff size={18} /> : <Eye size={18} />} 
            {showOutline ? 'Ẩn nét' : 'Hiện nét'}
          </button>
        </div>
        
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          {isQuizMode ? 'Hãy viết theo thứ tự nét bút.' : 'Xem hướng dẫn viết.'}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WritingPractice;