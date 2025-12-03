import React from 'react';

interface StatsCardProps {
  label: string;
  count: number;
  color: string;
  icon?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, count, color, icon }) => {
  return (
    <div className="text-center">
      <div className={`text-sm ${color} mb-1`}>{label}</div>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-3xl font-bold">{count}</div>
    </div>
  );
};

export default StatsCard;
