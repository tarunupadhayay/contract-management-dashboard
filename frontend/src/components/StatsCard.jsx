import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = 'accent', trend = null }) => {
  return (
    <div className={`stats-card glass-card stats-${color}`} id={`stats-card-${title?.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="stats-card-header">
        <div className="stats-card-icon-wrapper">
          <span className="stats-card-icon">{icon}</span>
        </div>
        {trend !== null && (
          <span className={`stats-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="stats-card-body">
        <p className="stats-card-value">{value}</p>
        <p className="stats-card-title">{title}</p>
      </div>
      <div className="stats-card-glow"></div>
    </div>
  );
};

export default StatsCard;
