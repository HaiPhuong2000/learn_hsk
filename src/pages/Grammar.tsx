import React, { useState } from 'react';
import { grammarData, type GrammarPoint } from '../data/grammar';
import { ChevronDown, ChevronUp, Book } from 'lucide-react';

const Grammar: React.FC = () => {
  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Ngữ pháp HSK 1</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {grammarData.map((point) => (
          <GrammarCard key={point.id} point={point} />
        ))}
      </div>
    </div>
  );
};

const GrammarCard: React.FC<{ point: GrammarPoint }> = ({ point }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--color-accent-primary)', 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {point.id}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{point.title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="fade-in" style={{ padding: '1.5rem', borderTop: '1px solid var(--color-glass-border)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--color-accent-secondary)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Book size={16} /> Cấu trúc
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
              {point.structure}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {point.explanation}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Ví dụ:</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {point.examples.map((ex, idx) => (
                <li key={idx} style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--color-accent-primary)' }}>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ex.chinese}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{ex.pinyin}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{ex.meaning}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grammar;
