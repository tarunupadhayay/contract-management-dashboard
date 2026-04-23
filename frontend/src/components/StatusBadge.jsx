import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const statusClass = status ? status.toLowerCase() : 'draft';

  return (
    <span className={`status-badge status-${statusClass}`} id={`status-badge-${statusClass}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
