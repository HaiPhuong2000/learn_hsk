import { trackWordStudied } from './dailyStats';

export type MemoryLevel = 'new' | 'familiar' | 'known' | 'mastered';

export interface CardProgress {
  memoryScore: number;
  lastReviewed: number;
}

// Memory level thresholds and labels
export const MEMORY_LEVELS = {
  new: { min: 0, max: 0, label: 'Mới', color: 'text-slate-400' },
  familiar: { min: 1, max: 4, label: 'Hơi nhớ', color: 'text-blue-400' },
  known: { min: 5, max: 9, label: 'Quen thuộc', color: 'text-green-400' },
  mastered: { min: 10, max: Infinity, label: 'Nhớ sâu', color: 'text-yellow-400' }
} as const;

const getMemoryLevel = (score: number): MemoryLevel => {
  if (score >= MEMORY_LEVELS.mastered.min) return 'mastered';
  if (score >= MEMORY_LEVELS.known.min) return 'known';
  if (score >= MEMORY_LEVELS.familiar.min) return 'familiar';
  return 'new';
};

const STORAGE_KEY = 'flashcard_progress';

export function getCardProgress(): Record<string, CardProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function updateCardProgress(cardId: string, remembered: boolean): MemoryLevel {
  const progress = getCardProgress();
  const current = progress[cardId] || { memoryScore: 0, lastReviewed: Date.now() };
  
  const newScore = remembered 
    ? current.memoryScore + 1 
    : Math.max(0, current.memoryScore - 1);
    
  const newLevel = getMemoryLevel(newScore);
  
  // Track that this word was studied today
  trackWordStudied(cardId, newLevel);
  
  const newProgress = {
    ...progress,
    [cardId]: {
      memoryScore: newScore,
      lastReviewed: Date.now()
    }
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  
  return newLevel;
}

export const getCardScore = (characterId: string): number => {
  const progress = getCardProgress();
  return progress[characterId]?.memoryScore || 0;
};

export const getCardLevel = (characterId: string): MemoryLevel => {
  const progress = getCardProgress();
  const score = progress[characterId]?.memoryScore || 0;
  return getMemoryLevel(score);
};

export const resetProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};
