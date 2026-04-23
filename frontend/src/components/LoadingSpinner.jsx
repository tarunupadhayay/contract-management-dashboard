import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    <div className="spinner-wrapper" id="loading-spinner">
      <div className={`spinner spinner-${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
