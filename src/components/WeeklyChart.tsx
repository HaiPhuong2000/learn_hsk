import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyProgress } from '../utils/dailyStats';
import { getDayName } from '../utils/dailyStats';

interface WeeklyChartProps {
  data: DailyProgress[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  // Transform data for recharts
  const chartData = data.map(day => ({
    name: getDayName(day.date),
    'Mới': day.new,
    'Hơi nhớ': day.familiar,
    'Quen thuộc': day.known,
    'Nhớ sâu': day.mastered
  }));

  return (
    <div className="glass-panel p-6">
      <h3 className="text-xl font-bold mb-4">Tiến độ 7 ngày qua</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px'
            }}
          />
          {/* Removed "Mới" bar as requested */}
          <Bar dataKey="Hơi nhớ" stackId="a" fill="#60a5fa" />
          <Bar dataKey="Quen thuộc" stackId="a" fill="#34d399" />
          <Bar dataKey="Nhớ sâu" stackId="a" fill="#fbbf24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
