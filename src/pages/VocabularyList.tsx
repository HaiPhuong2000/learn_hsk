import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getVocabulary, type VocabularyItem } from '../data/vocabulary';
import { Volume2, PenTool } from 'lucide-react';
import WordDetail from '../components/WordDetail';
import { speak } from '../utils/audio';
import { getStoredLevel, LEVEL_CHANGE_EVENT } from '../components/Layout';
import { parseExample } from '../utils/formatExample';

const normalizePinyin = (pinyin: string): string => {
  return pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const VocabularyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceItem, setPracticeItem] = useState<VocabularyItem | null>(null);
  const [detailItem, setDetailItem] = useState<VocabularyItem | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(getStoredLevel());
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [displayCount, setDisplayCount] = useState(50); // Show 50 items initially
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // When user scrolls to 80% of the content, load more
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setDisplayCount(prev => Math.min(prev + 50, filteredVocabulary.length));
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [filteredVocabulary.length]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(50);
  }, [searchTerm, currentLevel]);

  return (
    <div className="fade-in" style={{ paddingTop: '1rem' }}>
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

      <div 
        ref={scrollContainerRef}
        style={{ 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE/Edge
        }}
        className="hide-scrollbar"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVocabulary.slice(0, displayCount).map(item => (
            <VocabularyCard 
              key={item.id} 
              item={item} 
              onCardClick={() => {
                setDetailItem(item);
                setPracticeItem(item);
              }}
              onPractice={(e) => {
                e.stopPropagation();
                setPracticeItem(item);
              }} 
            />
          ))}
        </div>

        {filteredVocabulary.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Không tìm thấy từ vựng nào.
          </div>
        )}

        {displayCount < filteredVocabulary.length && (
          <div className="text-center py-4 text-slate-400 text-sm">
            Đang hiển thị {displayCount} / {filteredVocabulary.length} từ. Cuộn xuống để xem thêm...
          </div>
        )}
      </div>

      {practiceItem && (
        <WordDetail
          item={practiceItem}
          initialMode={practiceItem === detailItem ? 'detail' : 'practice'}
          onClose={() => {
            setPracticeItem(null);
            setDetailItem(null);
          }}
        />
      )}
    </div>
  );
};

const VocabularyCard: React.FC<{ 
  item: VocabularyItem, 
  onCardClick: () => void,
  onPractice: (e: React.MouseEvent) => void 
}> = ({ item, onCardClick, onPractice }) => {
  const playAudio = () => {
    speak(item.character);
  };

  return (
    <div 
      className="glass-panel p-6 flex flex-col hover:bg-white/5 transition-colors cursor-pointer"
      onClick={onCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="text-3xl font-bold mb-2">{item.character}</div>
          <div className="text-indigo-400 font-medium text-lg mb-1">{item.pinyin}</div>
          <div className="text-slate-300 text-base">{item.meaning}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playAudio();
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-indigo-400 transition-colors flex-shrink-0"
          title="Nghe phát âm"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {item.example && (() => {
        const parsed = parseExample(item.example);
        if (!parsed) return null;
        
        return (
          <div className="text-xs text-slate-400 mb-3" style={{ lineHeight: '1.6' }}>
            <div>{parsed.chinese}</div>
            <div style={{ fontStyle: 'italic' }}>{parsed.pinyin}</div>
            <div>{parsed.vietnamese}</div>
          </div>
        );
      })()}

      <button
        onClick={onPractice}
        className="w-full py-2 px-4 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-indigo-500/20"
      >
        <PenTool size={16} />
        Luyện viết
      </button>
    </div>
  );
};

export default VocabularyList;
