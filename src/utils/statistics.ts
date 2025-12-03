import { getCardLevel } from './cardProgress';

export interface LevelStats {
  new: number;
  familiar: number;
  known: number;
  mastered: number;
  total: number;
}

// Get statistics for specific HSK level
export const getHSKLevelStats = (level: number, allWords: { id: string | number; level: number }[]): LevelStats => {
  const wordsInLevel = allWords.filter(w => w.level === level);
  const stats: LevelStats = {
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
    total: wordsInLevel.length
  };
  
  wordsInLevel.forEach(word => {
    const memoryLevel = getCardLevel(String(word.id));
    stats[memoryLevel]++;
  });
  
  return stats;
};

// Get total statistics across all words
export const getTotalStats = (allWords: { id: string | number }[]): LevelStats => {
  const stats: LevelStats = {
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
    total: allWords.length
  };
  
  allWords.forEach(word => {
    const level = getCardLevel(String(word.id));
    stats[level]++;
  });
  
  return stats;
};
