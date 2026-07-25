import React from 'react';
import './StatsCard.css';

export const StatsCard = ({ icon, title, value, subtext, trend, color = 'blue' }) => {
  return (
    <div className={`stats-card stats-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {subtext && <p className="stats-subtext">{subtext}</p>}
      </div>
      {trend && (
        <div className={`stats-trend ${trend.direction}`}>
          {trend.direction === 'up' ? '▲' : '▼'} {trend.value}%
        </div>
      )}
    </div>
  );
};
