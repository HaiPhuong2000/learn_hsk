import type { MemoryLevel } from './cardProgress';

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  new: number;
  familiar: number;
  known: number;
  mastered: number;
  total: number;
  wordsStudied: string[];
}

const DAILY_PROGRESS_KEY = 'daily_progress';

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get all daily progress data
const getAllDailyProgress = (): Record<string, DailyProgress> => {
  const stored = localStorage.getItem(DAILY_PROGRESS_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

// Save daily progress
const saveDailyProgress = (data: Record<string, DailyProgress>) => {
  localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(data));
};

// Track that a word was studied today
export const trackWordStudied = (wordId: string, level: MemoryLevel) => {
  const today = getTodayDate();
  const allProgress = getAllDailyProgress();
  
  if (!allProgress[today]) {
    allProgress[today] = {
      date: today,
      new: 0,
      familiar: 0,
      known: 0,
      mastered: 0,
      total: 0,
      wordsStudied: []
    };
  }
  
  // Add word if not already tracked today
  if (!allProgress[today].wordsStudied.includes(wordId)) {
    allProgress[today].wordsStudied.push(wordId);
    allProgress[today].total = allProgress[today].wordsStudied.length;
    
    // Update level counts
    allProgress[today][level]++;
    
    saveDailyProgress(allProgress);
  }
};

// Get today's progress
export const getTodayProgress = (): DailyProgress => {
  const today = getTodayDate();
  const allProgress = getAllDailyProgress();
  
  return allProgress[today] || {
    date: today,
    new: 0,
    familiar: 0,
    known: 0,
    mastered: 0,
    total: 0,
    wordsStudied: []
  };
};

// Get progress for current week (Mon-Sun)
export const getCurrentWeekProgress = (): DailyProgress[] => {
  const result: DailyProgress[] = [];
  const allProgress = getAllDailyProgress();
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday
  
  // Calculate Monday of current week
  // If today is Sunday (0), Monday was 6 days ago. If today is Mon (1), Monday is today (0 days ago).
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(today.setDate(diff));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push(allProgress[dateStr] || {
      date: dateStr,
      new: 0,
      familiar: 0,
      known: 0,
      mastered: 0,
      total: 0,
      wordsStudied: []
    });
  }
  
  return result;
};

// Get day name in Vietnamese
export const getDayName = (dateStr: string): string => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const date = new Date(dateStr);
  return days[date.getDay()];
};
// Helper to get memory level from score (duplicated to avoid circular dependency)
const getLevelFromScore = (score: number) => {
  if (score >= 10) return 'mastered';
  if (score >= 5) return 'known';
  if (score >= 1) return 'familiar'; // Updated threshold: 1 is familiar
  return 'new';
};

// Get filtered progress for current week (Mon-Sun)
export const getFilteredWeeklyProgress = (
  level: number | 'all',
  allWords: { id: string | number; level: number }[],
  cardProgress: Record<string, { memoryScore: number }>
): DailyProgress[] => {
  const result: DailyProgress[] = [];
  const allProgress = getAllDailyProgress();
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday
  
  // Calculate Monday of current week
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(today.setDate(diff));
  
  // Create a map for fast word level lookup
  const wordLevelMap = new Map<string, number>();
  allWords.forEach(w => wordLevelMap.set(String(w.id), w.level));

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = allProgress[dateStr];
    
    const stats = {
      date: dateStr,
      new: 0,
      familiar: 0,
      known: 0,
      mastered: 0,
      total: 0,
      wordsStudied: [] as string[]
    };

    if (dayData && dayData.wordsStudied) {
      dayData.wordsStudied.forEach(wordId => {
        // Check if word matches selected HSK level
        const wordHskLevel = wordLevelMap.get(wordId);
        
        // Only process if word exists in vocabulary AND matches level filter
        if (wordHskLevel !== undefined && (level === 'all' || wordHskLevel === level)) {
          stats.wordsStudied.push(wordId);
          
          // Get current memory status
          const score = cardProgress[wordId]?.memoryScore || 0;
          const memoryLevel = getLevelFromScore(score);
          stats[memoryLevel]++;
        }
      });
      stats.total = stats.wordsStudied.length;
    }
    
    result.push(stats);
  }
  
  return result;
};
