import React from 'react';
import '../../styles/components.css';

export const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading books...</p>
    </div>
  );
};

export default LoadingSpinner;
