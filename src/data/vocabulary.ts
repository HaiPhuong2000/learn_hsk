import { hsk1Data } from './hsk1';
import { hsk2Data } from './hsk2';
import { hsk3Data } from './hsk3';
import { hsk4Data } from './hsk4';
import { hsk5Data } from './hsk5';
import { hsk6Data } from './hsk6';

export interface VocabularyItem {
  id: number | string;
  character: string;
  pinyin: string;
  meaning: string;
  level: number;
  example?: string;
}

export const getVocabulary = (level: number): VocabularyItem[] => {
  switch (level) {
    case 1: return hsk1Data;
    case 2: return hsk2Data;
    case 3: return hsk3Data;
    case 4: return hsk4Data;
    case 5: return hsk5Data;
    case 6: return hsk6Data;
    default: return hsk1Data;
  }
};

// Deprecated: Use getVocabulary(level) instead
export const vocabularyData: VocabularyItem[] = [
  ...hsk1Data,
  ...hsk2Data,
  ...hsk3Data,
  ...hsk4Data,
  ...hsk5Data,
  ...hsk6Data
];
