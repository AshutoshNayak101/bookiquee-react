import React from 'react';
import '../styles/components.css';

export const SummaryCard = ({ isOpen, summaryText, isLoading, onClose }) => {
  if (!isOpen && !isLoading) return null;

  return (
    <div className="summary-overlay" onClick={onClose}>
      <div className="summary-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="summary-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="summary-header">
          <h3>✨ AI Summary (Powered by Gemini)</h3>
        </div>

        {/* Content */}
        <div className="summary-content">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
              <p>Generating summary...</p>
            </div>
          ) : summaryText ? (
            <div className="summary-text">
              {summaryText}
            </div>
          ) : (
            <p>No summary available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
