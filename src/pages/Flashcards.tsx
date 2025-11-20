import React, { useState, useEffect } from 'react';
import { getVocabulary } from '../data/vocabulary';
import Flashcard from '../components/Flashcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="fade-in max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent mb-8">
        Thẻ ghi nhớ
      </h1>
      
      <div className="mb-8 flex justify-center">
        <Flashcard item={currentCard} />
      </div>

      <div className="flex flex-col justify-center gap-4 items-center">
        <div className="flex justify-center gap-4 items-center">
          <button onClick={prevCard} className="glass-button" disabled={currentIndex === 0}>
            <ChevronLeft size={24} />
          </button>
          
          <span className="text-xl font-bold min-w-[80px]">
            {currentIndex + 1} / {deck.length}
          </span>
          
          <button onClick={nextCard} className="glass-button" disabled={currentIndex === deck.length - 1}>
            <ChevronRight size={24} />
          </button>
        </div>

        <button 
          onClick={shuffleDeck} 
          className="glass-button mt-8 gap-2"
        >
          Trộn thẻ
        </button>
        
        <div className="mt-8 w-full max-w-sm h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
