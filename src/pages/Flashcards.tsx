import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getVocabulary } from '../data/vocabulary';
import Flashcard, { type FlashcardRef } from '../components/Flashcard';
import Modal from '../components/Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStoredLevel, LEVEL_CHANGE_EVENT } from '../components/Layout';
import { resetProgress, MEMORY_LEVELS, type MemoryLevel } from '../utils/cardProgress';
import { useProgress } from '../context/ProgressContext';

const Flashcards: React.FC = () => {
  const { progress, updateProgress, getLevel } = useProgress();
  const [currentLevel, setCurrentLevel] = useState(getStoredLevel());
  const [deck, setDeck] = useState(() => getVocabulary(currentLevel));
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<FlashcardRef>(null);

  const [showResetModal, setShowResetModal] = useState(false);

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

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipeLeft();
      } else if (e.key === 'ArrowRight') {
        handleSwipeRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, deck]);

  const goToNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const goToPrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const shuffleDeck = () => {
    const newDeck = [...deck].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    setCurrentIndex(0);
  };

  const handleSwipeLeft = useCallback(() => {
    // Didn't remember - decrease score
    const card = deck[currentIndex];
    if (!card) return;
    
    updateProgress(card.character, false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [currentIndex, deck, updateProgress]);

  const handleSwipeRight = useCallback(() => {
    // Remembered - increase score
    const card = deck[currentIndex];
    if (!card) return;
    
    updateProgress(card.character, true);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [currentIndex, deck, updateProgress]);

  const confirmReset = () => {
    resetProgress();
    window.location.reload();
  };

  const currentCard = deck[currentIndex];
  const nextCard = deck[(currentIndex + 1) % deck.length];
  const currentMemoryLevel = currentCard ? getLevel(currentCard.character) : 'new';
  const levelInfo = MEMORY_LEVELS[currentMemoryLevel];
  
  // Calculate what level user will reach if they swipe right
  const currentScore = currentCard ? (progress[currentCard.character] || 0) : 0;
  const nextScore = currentScore + 1;
  const getNextLevel = (score: number): MemoryLevel => {
    if (score >= 10) return 'mastered';
    if (score >= 5) return 'known';
    if (score >= 2) return 'familiar';
    return 'new';
  };
  const nextLevel = getNextLevel(nextScore);
  const nextLevelInfo = MEMORY_LEVELS[nextLevel];

  return (
    <div className="fade-in max-w-2xl mx-auto text-center py-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">
        Thẻ ghi nhớ
      </h1>
      
      <div className="mb-6 flex justify-between items-center w-full max-w-sm mx-auto">
        <button 
          onClick={() => setShowResetModal(true)}
          className="glass-button text-sm"
          title="Học lại từ đầu"
        >
          Học lại từ đầu
        </button>
        
        <button 
          onClick={shuffleDeck} 
          className="glass-button text-sm"
        >
          Trộn thẻ
        </button>
      </div>
      
      <div className="mb-8 flex justify-center">
        <Flashcard 
          ref={cardRef}
          item={currentCard}
          nextItem={nextCard}
          currentLevel={levelInfo.label}
          nextLevelOnRight={nextLevelInfo.label}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>

      <div className="flex flex-col justify-center gap-4 items-center">
        <div className="flex justify-center gap-4 items-center">
          <button onClick={goToPrevCard} className="glass-button" disabled={currentIndex === 0}>
            <ChevronLeft size={24} />
          </button>
          
          <span className="text-xl font-bold min-w-[80px]">
            {currentIndex + 1} / {deck.length}
          </span>
          
          <button onClick={goToNextCard} className="glass-button" disabled={currentIndex === deck.length - 1}>
            <ChevronRight size={24} />
          </button>
        </div>


      </div>
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Xác nhận học lại"
        footer={
          <>
            <button 
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={confirmReset}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
            >
              Đồng ý reset
            </button>
          </>
        }
      >
        <p className="text-xl font-bold">Bạn có chắc chắn muốn reset tất cả tiến trình học tập về trạng thái "Mới"?</p>
        <p className="text-sm text-slate-400 mt-2">Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default Flashcards;
