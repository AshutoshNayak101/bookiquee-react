import React from 'react';
import '../../styles/components.css';

export const UploadModal = ({ isOpen, message, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <div className="upload-spinner"></div>
        <p className="upload-message">{message}</p>
        {progress !== undefined && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;