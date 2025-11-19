import React, { useState, useEffect } from 'react';
import MatchingGame from '../components/MatchingGame';
import Quiz from '../components/Quiz';
import { HelpCircle } from 'lucide-react';
import { getVocabulary } from '../data/vocabulary';
import { getStoredLevel, LEVEL_CHANGE_EVENT } from '../components/Layout';

const Exercises: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matching' | 'quiz'>('matching');
  const [currentLevel, setCurrentLevel] = useState(getStoredLevel());
  const [levelData, setLevelData] = useState(() => getVocabulary(currentLevel));

  useEffect(() => {
    const handleLevelChange = (e: CustomEvent) => {
      const newLevel = e.detail;
      setCurrentLevel(newLevel);
      setLevelData(getVocabulary(newLevel));
    };

    window.addEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    return () => {
      window.removeEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    };
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Bài tập</h1>
      
      <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button 
          className={`glass-button ${activeTab === 'matching' ? 'active' : ''}`}
          style={{ flex: 1, background: activeTab === 'matching' ? 'var(--color-accent-primary)' : 'transparent' }}
          onClick={() => setActiveTab('matching')}
        >
          Ghép từ
        </button>
        <button 
          className={`glass-button ${activeTab === 'quiz' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            background: activeTab === 'quiz' ? 'var(--color-accent-primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircle size={20} /> Trắc nghiệm
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {activeTab === 'matching' ? (
          <MatchingGame data={levelData} />
        ) : (
          <Quiz data={levelData} />
        )}
      </div>
    </div>
  );
};

export default Exercises;
