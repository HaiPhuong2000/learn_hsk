import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  progress: Record<string, number>;
  updateProgress: (id: string | number, isCorrect: boolean) => void;
  getStats: (ids: (string | number)[]) => {
    new: number;
    familiar: number;
    known: number;
    mastered: number;
  };
  getLevel: (id: string | number) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem('hsk_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
  }, []);

  const updateProgress = (id: string | number, isCorrect: boolean) => {
    const strId = String(id);
    setProgress((prev) => {
      const currentLevel = prev[strId] || 0;
      let newLevel;

      if (isCorrect) {
        // Increment level, max 3
        newLevel = Math.min(3, currentLevel + 1);
      } else {
        // Reset to 0 on ANY mistake
        newLevel = 0;
      }

      const newProgress = { ...prev, [strId]: newLevel };
      localStorage.setItem('hsk_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const getLevel = (id: string | number) => {
    return progress[String(id)] || 0;
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
      if (level === 0) stats.new++;
      else if (level === 1) stats.familiar++;
      else if (level === 2) stats.known++;
      else if (level === 3) stats.mastered++;
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
