import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import WeeklyChart from '../components/WeeklyChart';
import { getHSKLevelStats, getTotalStats } from '../utils/statistics';
import { getFilteredWeeklyProgress } from '../utils/dailyStats';
import { getCardProgress } from '../utils/cardProgress';
import { getVocabulary } from '../data/vocabulary';

const Home: React.FC = () => {
  const { progress } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [stats, setStats] = useState({ new: 0, familiar: 0, known: 0, mastered: 0, total: 0 });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    // Update stats when level changes or progress updates
    const allWords = getVocabulary(1).concat(
      getVocabulary(2),
      getVocabulary(3),
      getVocabulary(4),
      getVocabulary(5),
      getVocabulary(6)
    );

    // Update Top Stats (Inventory)
    if (selectedLevel === 'all') {
      setStats(getTotalStats(allWords));
    } else {
      setStats(getHSKLevelStats(selectedLevel, allWords));
    }

    // Update Weekly Chart (Activity) - Filtered by Level
    // We pass the fresh progress from context (or getCardProgress if needed, but context progress triggers re-render)
    // Note: getFilteredWeeklyProgress internally uses getCardProgress if not passed, 
    // but we should pass the latest state to ensure sync.
    // However, getFilteredWeeklyProgress signature might need adjustment if we want to pass raw progress object 
    // that matches what getCardProgress returns. 
    // Actually, getCardProgress returns Record<string, CardProgress>, but context progress is Record<string, number>.
    // Let's rely on getCardProgress() inside the effect, but the effect is triggered by `progress` change.
    
    const currentProgress = getCardProgress();
    setWeeklyData(getFilteredWeeklyProgress(selectedLevel, allWords, currentProgress));
    
  }, [selectedLevel, progress]);

  const hskLevels = [1, 2, 3, 4, 5, 6];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="gradient-text text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400">Theo dõi tiến độ học tập của bạn</p>
      </div>

      {/* HSK Level Selector */}
      <div className="glass-panel p-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedLevel === 'all'
                ? 'bg-violet-500 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Tất cả
          </button>
          {hskLevels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              HSK {level}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen size={24} />
          Thống kê từ vựng {selectedLevel !== 'all' && `HSK ${selectedLevel}`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard label="Mới" count={stats.new} color="text-slate-400" icon="🆕" />
          <StatsCard label="Hơi nhớ" count={stats.familiar} color="text-blue-400" icon="💙" />
          <StatsCard label="Quen thuộc" count={stats.known} color="text-green-400" icon="💚" />
          <StatsCard label="Nhớ sâu" count={stats.mastered} color="text-yellow-400" icon="💛" />
        </div>
        <div className="mt-6 text-center text-slate-400">
          Tổng số từ: <span className="font-bold text-white">{stats.total}</span>
        </div>
      </div>

      {/* Today's Learning Stats */}
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">📚 Học tập hôm nay</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-3xl font-bold text-violet-400">
              {weeklyData[weeklyData.length - 1]?.total || 0}
            </div>
            <div className="text-sm text-slate-400 mt-1">Từ đã học</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-3xl font-bold text-green-400">
              {(weeklyData[weeklyData.length - 1]?.known || 0) + (weeklyData[weeklyData.length - 1]?.mastered || 0)}
            </div>
            <div className="text-sm text-slate-400 mt-1">Từ đã thuộc</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-3xl font-bold text-yellow-400">
              {stats.total > 0 ? Math.round(((stats.familiar + stats.known + stats.mastered) / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-slate-400 mt-1">Tiến độ tổng</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <WeeklyChart data={weeklyData} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Link to="/flashcards" className="glass-panel p-6 hover:bg-white/5 transition-all text-center">
          <div className="text-4xl mb-2">🃏</div>
          <div className="font-bold">Thẻ ghi nhớ</div>
          <div className="text-sm text-slate-400 mt-1">Luyện từ vựng</div>
        </Link>
        <Link to="/practice" className="glass-panel p-6 hover:bg-white/5 transition-all text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="font-bold">Bài tập</div>
          <div className="text-sm text-slate-400 mt-1">Kiểm tra kiến thức</div>
        </Link>
        <Link to="/vocabulary" className="glass-panel p-6 hover:bg-white/5 transition-all text-center">
          <div className="text-4xl mb-2">📖</div>
          <div className="font-bold">Từ vựng</div>
          <div className="text-sm text-slate-400 mt-1">Danh sách từ</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
