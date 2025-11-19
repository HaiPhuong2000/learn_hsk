import React, { useState, useEffect } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { RefreshCw } from 'lucide-react';
import { speak } from '../utils/audio';
import { useProgress } from '../context/ProgressContext';

interface MatchingGameProps {
  data: VocabularyItem[];
}

const MatchingGame: React.FC<MatchingGameProps> = ({ data }) => {
  const { updateProgress } = useProgress();
  const [cards, setCards] = useState<{ id: string | number; text: string; type: 'char' | 'meaning'; matched: boolean; character?: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [data]);

  const initializeGame = () => {
    // Select 6 random items
    const items = [...data].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const gameCards = items.flatMap(item => [
      { id: item.id, text: item.character, type: 'char' as const, matched: false, character: item.character },
      { id: item.id, text: item.meaning, type: 'meaning' as const, matched: false, character: item.character }
    ]);

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setSelected([]);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (selected.length === 2 || cards[index].matched || selected.includes(index)) return;

    // Play audio when clicking a card with character (only for character cards)
    if (cards[index].type === 'char' && cards[index].character) {
      speak(cards[index].character!);
    }

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (cards[first].id === cards[second].id) {
        // Match
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].matched = true;
          newCards[second].matched = true;
          setCards(newCards);
          setSelected([]);
          
          // Update SRS progress (Correct)
          updateProgress(cards[first].id, true);

          if (newCards.every(c => c.matched)) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match
        // Update SRS progress (Incorrect)
        updateProgress(cards[first].id, false);
        
        setTimeout(() => {
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Ghép từ</h2>
        <button 
          onClick={initializeGame}
          className="glass-button"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
        >
          <RefreshCw size={16} /> Chơi lại
        </button>
      </div>

      {gameWon ? (
        <div className="fade-in glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tuyệt vời!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Bạn đã ghép đúng tất cả các cặp từ.</p>
          <button onClick={initializeGame} className="glass-button">Chơi lại</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
          gap: '1rem' 
        }}>
          {cards.map((card, index) => {
            const isSelected = selected.includes(index);
            const isMatched = card.matched;
            
            let bg = 'var(--color-glass-bg)';
            if (isMatched) bg = 'rgba(46, 213, 115, 0.2)'; // Green
            else if (isSelected) bg = 'rgba(55, 66, 250, 0.3)'; // Blue

            return (
              <div 
                key={index}
                onClick={() => handleCardClick(index)}
                className="glass-panel"
                style={{ 
                  height: '120px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '1rem',
                  textAlign: 'center',
                  cursor: isMatched ? 'default' : 'pointer',
                  background: bg,
                  border: isSelected ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-glass-border)',
                  transition: 'all 0.2s',
                  opacity: isMatched ? 0.5 : 1,
                  fontSize: card.type === 'char' ? '1.5rem' : '0.85rem',
                  overflow: 'hidden'
                }}
                title={card.text}
              >
                <div style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: '100%'
                }}>
                  {card.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
