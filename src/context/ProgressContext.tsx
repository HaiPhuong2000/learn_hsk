import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateCardProgress, getCardProgress, getCardLevel, type MemoryLevel } from '../utils/cardProgress';

interface ProgressContextType {
  progress: Record<string, number>;
  updateProgress: (id: string | number, isCorrect: boolean) => void;
  getStats: (ids: (string | number)[]) => {
    new: number;
    familiar: number;
    known: number;
    mastered: number;
  };
  getLevel: (id: string | number) => MemoryLevel;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Load progress from cardProgress
  useEffect(() => {
    const cardProg = getCardProgress();
    const scores: Record<string, number> = {};
    Object.keys(cardProg).forEach(key => {
      scores[key] = cardProg[key].memoryScore;
    });
    setProgress(scores);
  }, []);

  const updateProgress = (id: string | number, isCorrect: boolean) => {
    const strId = String(id);
    
    // Use cardProgress to update
    updateCardProgress(strId, isCorrect);
    
    // Update local state
    const cardProg = getCardProgress();
    const scores: Record<string, number> = {};
    Object.keys(cardProg).forEach(key => {
      scores[key] = cardProg[key].memoryScore;
    });
    setProgress(scores);
  };

  const getLevel = (id: string | number): MemoryLevel => {
    return getCardLevel(String(id));
  };

  const getStats = (ids: (string | number)[]) => {
    const stats = {
      new: 0,
      familiar: 0,
      known: 0,
      mastered: 0
    };

    ids.forEach(id => {
      const level = getLevel(id);
      if (level === 'new') stats.new++;
      else if (level === 'familiar') stats.familiar++;
      else if (level === 'known') stats.known++;
      else if (level === 'mastered') stats.mastered++;
    });

    return stats;
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, getStats, getLevel }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
