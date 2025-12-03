import React, { useState, useEffect } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { Check } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface InputPracticeProps {
  data: VocabularyItem[];
}

const InputPractice: React.FC<InputPracticeProps> = ({ data }) => {
  const { updateProgress, getStats } = useProgress();
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [checkResult, setCheckResult] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    nextQuestion();
  }, [data]);

  const nextQuestion = () => {
    if (data.length === 0) return;
    
    // Simple random selection for now, could be improved with SRS logic
    const randomItem = data[Math.floor(Math.random() * data.length)];
    setCurrentItem(randomItem);
    setInputVal('');
    setCheckResult(null);
  };

  const handleCheckInput = () => {
    if (!currentItem) return;

    const isCorrect = inputVal.trim() === currentItem.character;
    setCheckResult(isCorrect ? 'correct' : 'incorrect');
    updateProgress(currentItem.id, isCorrect);
    
    if (isCorrect) {
      setStreak(s => s + 1);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setStreak(0);
    }
  };

  if (!currentItem) return <div className="text-center text-slate-400 py-8">Đang tải...</div>;

  const stats = getStats(data.map(d => d.id));

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xl font-bold">Tự luận</span>
        <span className="text-violet-500 font-bold">Chuỗi đúng: {streak}</span>
      </div>

      {/* Progress Stats */}
      <div className="glass-panel p-4 mb-8 flex justify-around text-sm">
        <div className="text-center">
          <div className="text-slate-400">Mới</div>
          <div className="font-bold text-lg">{stats.new}</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400">Hơi nhớ</div>
          <div className="font-bold text-lg">{stats.familiar}</div>
        </div>
        <div className="text-center">
          <div className="text-emerald-400">Quen thuộc</div>
          <div className="font-bold text-lg">{stats.known}</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400">Nhớ sâu</div>
          <div className="font-bold text-lg">{stats.mastered}</div>
        </div>
      </div>

      <div className="glass-panel p-12 mb-8">
        <div className="mb-8">
          <div className="text-4xl font-bold mb-2">{currentItem.meaning}</div>
        </div>

        <div className="flex justify-center mb-8">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập chữ Hán..."
            className="w-full max-w-xs px-4 py-4 rounded-lg bg-white/10 border border-white/10 text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && handleCheckInput()}
            autoFocus
          />
        </div>

        <button 
          onClick={handleCheckInput}
          className="glass-button px-12 py-4 text-lg font-bold bg-violet-500 hover:bg-violet-600 flex items-center justify-center gap-2 mx-auto"
        >
          <Check size={24} /> Kiểm tra
        </button>

        {checkResult && (
          <div className={`fade-in mt-8 p-4 rounded-lg font-bold text-xl ${
            checkResult === 'correct' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/20 text-rose-500'
          }`}>
            {checkResult === 'correct' ? 'Chính xác! 🎉' : `Sai rồi. Đáp án đúng là: ${currentItem.character} (${currentItem.pinyin})`}
          </div>
        )}
      </div>

      <button 
        onClick={nextQuestion} 
        className="glass-button inline-flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800"
      >
        Bỏ qua
      </button>
    </div>
  );
};

export default InputPractice;
