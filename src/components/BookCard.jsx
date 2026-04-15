import React from 'react';
import '../styles/components.css';

export const BookCard = ({ book, index, onClick, isFavorite }) => {
  const { cover, title, author, rating, downloads } = book;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div
      className="book-card"
      onClick={onClick}
      style={{ animationDelay: `${0.05 + index * 0.05}s` }}
    >
      <div className="book-image">
        {cover ? (
          <img
            src={cover}
            alt={title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="book-image-placeholder">📖</div>';
            }}
          />
        ) : (
          <div className="book-image-placeholder">📖</div>
        )}
        {isFavorite && <div className="card-fav-badge">❤️</div>}
      </div>
      <div className="book-info">
        <div className="book-title">{title}</div>
        <div className="book-author">{author || 'Unknown Author'}</div>
        <div className="book-stats">
          <span className="book-rating">⭐ {(rating || 4.0).toFixed(1)}</span>
          <span className="book-downloads">{formatNumber(downloads || 0)} reads</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
