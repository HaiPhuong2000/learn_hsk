import React, { useState, useEffect } from 'react';
import { getVocabulary } from '../data/vocabulary';
import Flashcard from '../components/Flashcard';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { getStoredLevel, LEVEL_CHANGE_EVENT } from '../components/Layout';

const Flashcards: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(getStoredLevel());
  const [deck, setDeck] = useState(() => getVocabulary(currentLevel));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleLevelChange = (e: CustomEvent) => {
      const newLevel = e.detail;
      setCurrentLevel(newLevel);
      setDeck(getVocabulary(newLevel));
      setCurrentIndex(0);
    };

    window.addEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    return () => {
      window.removeEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    };
  }, []);

  const currentCard = deck[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const shuffleDeck = () => {
    const newDeck = [...deck].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    setCurrentIndex(0);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Thẻ ghi nhớ</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <Flashcard item={currentCard} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
        <button onClick={prevCard} className="glass-button" disabled={currentIndex === 0}>
          <ChevronLeft size={24} />
        </button>
        
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '80px' }}>
          {currentIndex + 1} / {deck.length}
        </span>
        
        <button onClick={nextCard} className="glass-button" disabled={currentIndex === deck.length - 1}>
          <ChevronRight size={24} />
        </button>
      </div>

      <button 
        onClick={shuffleDeck} 
        className="glass-button" 
        style={{ marginTop: '2rem', gap: '0.5rem' }}
      >
        <Shuffle size={18} />
        Trộn thẻ
      </button>
      
      <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px', height: '4px', background: 'var(--color-bg-secondary)', borderRadius: '2px' }}>
        <div style={{ 
          width: `${((currentIndex + 1) / deck.length) * 100}%`, 
          height: '100%', 
          background: 'var(--color-accent-secondary)', 
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default Flashcards;
