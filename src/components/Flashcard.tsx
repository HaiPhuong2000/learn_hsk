import React, { useState } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { Volume2, RotateCw } from 'lucide-react';
import { speak } from '../utils/audio';
import { parseExample } from '../utils/formatExample';

interface FlashcardProps {
  item: VocabularyItem;
  onNext?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.character);
  };

  return (
    <div 
      style={{ 
        perspective: '1000px', 
        width: '100%', 
        maxWidth: '400px', 
        height: '500px',
        cursor: 'pointer'
      }}
      onClick={handleFlip}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div className="glass-panel" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))'
        }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            HSK Level {item.level}
          </div>
          
          <div style={{ fontSize: '6rem', fontWeight: 'bold', marginBottom: '3rem' }}>
            {item.character}
          </div>

          <div style={{ marginTop: 'auto', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCw size={16} /> Click to flip
          </div>
        </div>

        {/* Back */}
        <div className="glass-panel" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <h3 style={{ fontSize: '2.5rem', color: 'var(--color-accent-primary)', margin: 0 }}>{item.pinyin}</h3>
             <button 
              onClick={playAudio}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                borderRadius: '50%', 
                padding: '0.5rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <Volume2 size={20} />
            </button>
          </div>

          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
            {item.meaning}
          </p>

          {item.example && (() => {
            const parsed = parseExample(item.example);
            if (!parsed) return null;
            
            return (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.7'
              }}>
                <div>{parsed.chinese}</div>
                <div style={{ fontStyle: 'italic' }}>{parsed.pinyin}</div>
                <div>{parsed.vietnamese}</div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
