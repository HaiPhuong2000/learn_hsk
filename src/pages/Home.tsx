import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Gamepad2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Chinh phục HSK 1-6</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Học từ vựng, ngữ pháp và luyện tập với các công cụ tương tác của chúng tôi.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/vocabulary" className="glass-button">Bắt đầu học</Link>
          <Link to="/exercises" className="glass-button" style={{ background: 'rgba(255,255,255,0.05)' }}>Luyện tập</Link>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <FeatureCard 
          icon={<BookOpen size={32} color="var(--color-accent-primary)" />}
          title="Từ vựng"
          description="Danh sách từ vựng đầy đủ với phát âm và ví dụ."
        />
        <FeatureCard 
          icon={<Layers size={32} color="var(--color-accent-secondary)" />}
          title="Thẻ ghi nhớ"
          description="Học từ mới hiệu quả với phương pháp lặp lại ngắt quãng."
        />
        <FeatureCard 
          icon={<Gamepad2 size={32} color="var(--color-accent-primary)" />}
          title="Bài tập"
          description="Kiểm tra kiến thức của bạn qua các trò chơi và bài kiểm tra."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="glass-panel" style={{ padding: '2rem' }}>
    <div style={{ marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ color: 'var(--color-accent-secondary)', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
  </div>
);

export default Home;
