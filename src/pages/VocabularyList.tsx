import React, { useState, useEffect, useMemo } from 'react';
import { getVocabulary, type VocabularyItem } from '../data/vocabulary';
import { Volume2, PenTool } from 'lucide-react';
import WritingPractice from '../components/WritingPractice';
import { speak } from '../utils/audio';
import { getStoredLevel, LEVEL_CHANGE_EVENT } from '../components/Layout';

const normalizePinyin = (pinyin: string): string => {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const VocabularyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceItem, setPracticeItem] = useState<VocabularyItem | null>(null);
  const [currentLevel, setCurrentLevel] = useState(getStoredLevel());
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    setVocabulary(getVocabulary(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    const handleLevelChange = (e: CustomEvent) => {
      setCurrentLevel(e.detail);
    };

    window.addEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    return () => {
      window.removeEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    };
  }, []);

  const filteredVocabulary = useMemo(() => {
    if (!searchTerm) return vocabulary;

    const lowerSearch = searchTerm.toLowerCase();
    const normalizedSearch = normalizePinyin(searchTerm);

    return vocabulary.filter(item => {
      const matchesCharacter = item.character.includes(searchTerm);
      const matchesMeaning = item.meaning.toLowerCase().includes(lowerSearch);

      // Pinyin matching:
      // 1. Exact match (with tones)
      // 2. Normalized match (without tones)
      const itemPinyin = item.pinyin.toLowerCase();
      const normalizedItemPinyin = normalizePinyin(item.pinyin);

      const matchesPinyin = itemPinyin.includes(lowerSearch) || normalizedItemPinyin.includes(normalizedSearch);

      return matchesCharacter || matchesMeaning || matchesPinyin;
    });
  }, [vocabulary, searchTerm]);

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
          Danh sách từ vựng HSK {currentLevel}
        </h1>
        <input
          type="text"
          placeholder="Tìm kiếm (Pinyin, Hán tự, Nghĩa)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 px-6 py-3 rounded-full bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVocabulary.map(item => (
          <VocabularyCard key={item.id} item={item} onPractice={() => setPracticeItem(item)} />
        ))}
      </div>

      {filteredVocabulary.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          Không tìm thấy từ vựng nào.
        </div>
      )}

      {practiceItem && (
        <WritingPractice
          id={practiceItem.id}
          character={practiceItem.character}
          pinyin={practiceItem.pinyin}
          meaning={practiceItem.meaning}
          onClose={() => setPracticeItem(null)}
        />
      )}
    </div>
  );
};

const VocabularyCard: React.FC<{ item: VocabularyItem, onPractice: () => void }> = ({ item, onPractice }) => {
  const playAudio = () => {
    speak(item.character);
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold mb-1">{item.character}</div>
          <div className="text-indigo-400 font-medium">{item.pinyin}</div>
        </div>
        <button
          onClick={playAudio}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-indigo-400 transition-colors"
          title="Nghe phát âm"
        >
          <Volume2 size={20} />
        </button>
      </div>

      <div className="text-slate-300 text-sm flex-grow">
        {item.meaning}
      </div>

      {item.example && (
        <div className="text-xs text-slate-500 italic">
          {item.example}
        </div>
      )}

      <button
        onClick={onPractice}
        className="w-full mt-2 py-2 px-4 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-indigo-500/20"
      >
        <PenTool size={16} />
        Luyện viết
      </button>
    </div>
  );
};

export default VocabularyList;
