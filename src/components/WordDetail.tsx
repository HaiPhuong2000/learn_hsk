import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import HanziWriter from 'hanzi-writer';
import { X, Play, PenTool, Eye, EyeOff, ArrowLeft, Volume2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import type { VocabularyItem } from '../data/vocabulary';
import { speak } from '../utils/audio';
import { parseExample } from '../utils/formatExample';

interface WordDetailProps {
  item: VocabularyItem;
  initialMode?: 'detail' | 'practice';
  onClose: () => void;
}

const WordDetail: React.FC<WordDetailProps> = ({ item, initialMode = 'detail', onClose }) => {
  const { updateProgress } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HanziWriter[]>([]);
  const [showOutline, setShowOutline] = useState(true);
  const [mode, setMode] = useState<'detail' | 'practice'>(initialMode);

  // Split the character string into individual characters
  const characters = item.character.split('');

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

    // Auto-play animation in detail mode OR start quiz in practice mode
    if (mode === 'detail') {
      setTimeout(() => {
        writersRef.current.forEach(writer => {
          writer.animateCharacter();
        });
      }, 300);
    } else if (mode === 'practice') {
      // Start quiz mode after writers are created
      setTimeout(() => {
        writersRef.current.forEach(writer => {
          writer.quiz({
            onComplete: () => {
              updateProgress(item.id, true);
            }
          });
        });
      }, 100);
    }

    return () => {
      // Clean up writers
    };
  }, [item.character, mode, updateProgress, item.id]);

  const animate = () => {
    writersRef.current.forEach(writer => {
      writer.animateCharacter();
    });
  };

  const startPractice = () => {
    setMode('practice');
    // Quiz will be started in useEffect when mode changes
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

  const goBackToDetail = () => {
    // Cancel quiz on all writers first
    writersRef.current.forEach(writer => {
      writer.cancelQuiz();
      writer.showOutline();
    });
    setShowOutline(true);
    setMode('detail');
    // Animation will restart in useEffect when mode changes
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

        {mode === 'practice' && (
          <button 
            onClick={goBackToDetail}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', width: '100%' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '1rem' }}>{item.character}</div>
          <div style={{ fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>{item.pinyin}</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{item.meaning}</div>
          
          {mode === 'detail' && item.example && (() => {
            const parsedExample = parseExample(item.example);
            if (!parsedExample) return null;
            
            return (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginTop: '1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '600'
                }}>
                  Ví dụ:
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(parsedExample.chinese);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      color: 'var(--color-accent-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Nghe ví dụ"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                  <div>{parsedExample.chinese}</div>
                  <div style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>{parsedExample.pinyin}</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{parsedExample.vietnamese}</div>
                </div>
              </div>
            );
          })()}
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

        {mode === 'detail' ? (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={animate} 
              className="glass-button" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Play size={18} /> Xem lại mẫu
            </button>
            <button 
              onClick={startPractice} 
              className="glass-button" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'var(--color-accent-primary)'
              }}
            >
              <PenTool size={18} /> Luyện viết
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={toggleOutline} 
              className="glass-button" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {showOutline ? <EyeOff size={18} /> : <Eye size={18} />} 
              {showOutline ? 'Ẩn nét' : 'Hiện nét'}
            </button>
          </div>
        )}
        
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          {mode === 'detail' ? 'Xem hướng dẫn viết chữ Hán.' : 'Hãy viết theo thứ tự nét bút.'}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WordDetail;