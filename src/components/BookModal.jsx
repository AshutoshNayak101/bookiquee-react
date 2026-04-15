import React from 'react';
import '../styles/components.css';

export const BookModal = ({ book, isOpen, onClose, onRead, onToggleFavorite, isFavorite, isPending, onReadSummary, isSummaryLoading }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="modal show" id="bookModal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-cover-wrap">
            <img
              className="modal-book-cover"
              src={book.cover || 'https://via.placeholder.com/300x400'}
              alt={book.title}
            />
            {isFavorite && (
              <div className="modal-fav-badge">❤️ In Favorites</div>
            )}
          </div>
          <div className="modal-info">
            <h2>{book.title}</h2>
            <p className="modal-author">{book.author || 'Unknown Author'}</p>
            <p className="modal-description">{book.description || 'No description available.'}</p>
            <div className="modal-actions">
              <button className="btn-read" onClick={onRead}>
                📖 Read Online
              </button>
              <button
                className="btn-read"
                onClick={onReadSummary}
                disabled={isSummaryLoading}
                style={{
                  background: isSummaryLoading ? '#ccc' : 'linear-gradient(90deg, #f5457e, #c0105a)',
                  cursor: isSummaryLoading ? 'not-allowed' : 'pointer',
                  opacity: isSummaryLoading ? 0.7 : 1
                }}
              >
                {isSummaryLoading ? '⏳ Loading...' : '✨ Read Summary (Powered by Gemini)'}
              </button>
              <button
                className={`btn-favorite ${isFavorite ? 'btn-favorite-active' : ''}`}
                onClick={onToggleFavorite}
                disabled={isPending}
                style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
              >
                {isPending
                  ? '⏳ Saving...'
                  : isFavorite
                    ? '💔 Remove from Favorites'
                    : '❤️ Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
