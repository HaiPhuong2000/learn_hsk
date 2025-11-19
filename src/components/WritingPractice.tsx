import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { X, Play, PenTool, Eye, EyeOff } from 'lucide-react';

interface WritingPracticeProps {
  character: string;
  pinyin: string;
  meaning: string;
  onClose: () => void;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ character, pinyin, meaning, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HanziWriter[]>([]);
  const [showOutline, setShowOutline] = useState(true);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Split the character string into individual characters
  const characters = character.split('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous writers
    containerRef.current.innerHTML = '';
    writersRef.current = [];

    const size = Math.min(window.innerWidth / characters.length - 20, 300); // Responsive size
    const clampedSize = Math.max(Math.min(size, 200), 100); // Clamp between 100 and 200

    characters.forEach((char) => {
      const charDiv = document.createElement('div');
      charDiv.style.display = 'inline-block';
      charDiv.style.margin = '5px';
      charDiv.style.backgroundColor = 'white';
      charDiv.style.borderRadius = '8px';
      // charDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
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
      // Cleanup if necessary, though HanziWriter doesn't have a strict destroy method that removes DOM
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
      writer.quiz();
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

  return (
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
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '800px', 
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-glass-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
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
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '0.5rem' }}>{character}</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>{pinyin}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{meaning}</div>
        </div>

        {/* Container for Hanzi Writers */}
        <div 
          ref={containerRef} 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            marginBottom: '2rem',
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
    </div>
  );
};

export default WritingPractice;
