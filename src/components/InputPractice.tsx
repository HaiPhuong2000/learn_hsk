import React, { useState, useEffect } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { Check, RefreshCw } from 'lucide-react';
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

  if (!currentItem) return <div>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tự luận</span>
        <span style={{ color: 'var(--color-accent-primary)' }}>Chuỗi đúng: {streak}</span>
      </div>

      {/* Progress Stats */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem' }}>
        {(() => {
          const stats = getStats(data.map(d => d.id));
          return (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-text-secondary)' }}>Mới</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.new}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#3498db' }}>Hơi nhớ</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.familiar}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#2ecc71' }}>Quen thuộc</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.known}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f1c40f' }}>Nhớ sâu</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.mastered}</div>
              </div>
            </>
          );
        })()}
      </div>

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{currentItem.meaning}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{currentItem.pinyin}</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập chữ Hán..."
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-glass-border)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1.5rem',
              textAlign: 'center',
              width: '100%',
              maxWidth: '300px'
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckInput()}
            autoFocus
          />
        </div>

        <button 
          onClick={handleCheckInput}
          className="glass-button"
          style={{ 
            background: 'var(--color-accent-primary)',
            padding: '1rem 3rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
          }}
        >
          <p style={{ display: 'flex', alignItems: 'center' }}><Check size={20} style={{ marginRight: '0.5rem' }} /> Kiểm tra</p>
        </button>

        {checkResult && (
          <div className="fade-in" style={{ 
            marginTop: '2rem',
            padding: '1rem', 
            borderRadius: '8px', 
            background: checkResult === 'correct' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
            color: checkResult === 'correct' ? '#2ed573' : '#ff4757',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            {checkResult === 'correct' ? 'Chính xác! 🎉' : `Sai rồi. Đáp án đúng là: ${currentItem.character}`}
          </div>
        )}
      </div>

      <button 
        onClick={nextQuestion} 
        className="glass-button" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <RefreshCw size={16} /> Bỏ qua
      </button>
    </div>
  );
};

export default InputPractice;
