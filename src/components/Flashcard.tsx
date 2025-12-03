import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { Volume2, RotateCw } from 'lucide-react';
import { speak } from '../utils/audio';
import { parseExample } from '../utils/formatExample';

interface FlashcardProps {
  item: VocabularyItem;
  nextItem?: VocabularyItem;
  currentLevel: string;
  nextLevelOnRight: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export interface FlashcardRef {
  animateSwipe: (direction: 'left' | 'right') => void;
}

const Flashcard = forwardRef<FlashcardRef, FlashcardProps>(({ item, nextItem, currentLevel, nextLevelOnRight, onSwipeLeft, onSwipeRight }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [hasDragged, setHasDragged] = useState(false); // Track if user actually dragged
  
  const SWIPE_THRESHOLD = 100;
  const MAX_DRAG = 250;

  // Reset when card changes
  useEffect(() => {
    setIsFlipped(false);
    setDragOffset({ x: 0, y: 0 });
    setHasDragged(false);
  }, [item.character]);

  const handleFlip = () => {
    // Only flip if not dragging and user didn't just drag
    if (!isDragging && !isAnimating && !hasDragged) {
      setIsFlipped(!isFlipped);
    }
    // Reset hasDragged after a short delay
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), 100);
    }
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.character);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false); // Reset at start
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    
    // If moved more than 5px, mark as dragged
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }
    
    const limitedX = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, deltaX));
    
    setDragOffset({ x: limitedX, y: 0 });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check threshold
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (dragOffset.x > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasDragged(false); // Reset at start
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    
    // If moved more than 5px, mark as dragged
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true);
    }
    
    const limitedX = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, deltaX));
    
    setDragOffset({ x: limitedX, y: 0 });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (dragOffset.x > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, dragOffset]);

  // Touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragStart, dragOffset]);

  // Animate swipe (for keyboard)
  const animateSwipe = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    setTimeout(() => {
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight();
      }
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 300);
  };

  useImperativeHandle(ref, () => ({
    animateSwipe
  }), [onSwipeLeft, onSwipeRight]);

  // Calculate transform and opacity
  let effectiveOffset = dragOffset.x;
  if (isAnimating && animationDirection) {
    effectiveOffset = animationDirection === 'left' ? -400 : 400;
  }
  const rotation = effectiveOffset / 20;
  const overlayOpacity = Math.min(Math.abs(effectiveOffset) / SWIPE_THRESHOLD, 1);
  const nextCardOpacity = Math.min(Math.abs(dragOffset.x) / SWIPE_THRESHOLD, 0.6);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      {/* Next card preview */}
      {nextItem && (dragOffset.x !== 0 || isAnimating) && (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '500px',
          opacity: nextCardOpacity,
          transform: 'scale(0.95)',
          transition: 'opacity 0.2s ease-out',
          zIndex: 0,
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))'
          }}>
            <div style={{ fontSize: '6rem', fontWeight: 'bold' }}>
              {nextItem.character}
            </div>
          </div>
        </div>
      )}

      {/* Main card */}
      <div
        style={{
          perspective: '1000px',
          width: '100%',
          height: '500px',
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          zIndex: 1,
          transform: `translateX(${effectiveOffset}px) rotate(${rotation}deg)`,
          transition: isDragging || isAnimating ? 'none' : 'transform 0.3s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleFlip}
      >
        {/* Left swipe overlay */}
        {(dragOffset.x < -10 || (isAnimating && animationDirection === 'left')) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(239, 68, 68, ${overlayOpacity * 0.6})`,
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❌</div>
            <div style={{ fontSize: '1.5rem' }}>Không nhớ</div>
          </div>
        )}

        {/* Right swipe overlay */}
        {(dragOffset.x > 10 || (isAnimating && animationDirection === 'right')) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(34, 197, 94, ${overlayOpacity * 0.6})`,
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '1.5rem' }}>{nextLevelOnRight}</div>
          </div>
        )}

        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
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

            <div style={{marginTop: 'auto', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
    </div>
  );
});

export default Flashcard;
