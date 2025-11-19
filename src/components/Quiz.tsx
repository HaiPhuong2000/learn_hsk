import React, { useState, useEffect } from 'react';
import type { VocabularyItem } from '../data/vocabulary';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface QuizProps {
  data: VocabularyItem[];
}

const Quiz: React.FC<QuizProps> = ({ data }) => {
  const [questions, setQuestions] = useState<{ item: VocabularyItem; options: string[] }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    startNewQuiz();
  }, [data]);

  const startNewQuiz = () => {
    const items = [...data].sort(() => Math.random() - 0.5).slice(0, 5);
    
    const newQuestions = items.map(item => {
      // Get 3 random wrong answers
      const wrongOptions = data
        .filter(v => v.id !== item.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.meaning);
      
      const options = [...wrongOptions, item.meaning].sort(() => Math.random() - 0.5);
      return { item, options };
    });

    setQuestions(newQuestions);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option);
    const correct = option === questions[currentQ].item.meaning;
    
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return <div>Đang tải...</div>;

  if (showResult) {
    return (
      <div className="fade-in glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Hoàn thành!</h2>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Điểm số của bạn: <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>{score} / {questions.length}</span>
        </p>
        <button onClick={startNewQuiz} className="glass-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={20} /> Làm lại
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Câu hỏi {currentQ + 1} / {questions.length}</span>
        <span style={{ color: 'var(--color-accent-primary)' }}>Điểm: {score}</span>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {currentQuestion.item.character}
        </div>
        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>
          {currentQuestion.item.pinyin}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {currentQuestion.options.map((option, idx) => {
          let bg = 'var(--color-glass-bg)';
          if (selectedOption) {
            if (option === currentQuestion.item.meaning) bg = 'rgba(46, 213, 115, 0.3)';
            else if (option === selectedOption) bg = 'rgba(255, 71, 87, 0.3)';
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="glass-button"
              style={{ 
                textAlign: 'left', 
                padding: '1rem 1.5rem',
                background: bg,
                borderColor: selectedOption === option ? 'var(--color-accent-primary)' : 'var(--color-glass-border)'
              }}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="fade-in" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={nextQuestion} className="glass-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Tiếp theo <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
