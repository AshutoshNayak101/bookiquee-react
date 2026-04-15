import React from 'react';
import '../styles/components.css';

export const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="pagination">
      <button
        className="btn-prev"
        onClick={onPrev}
        disabled={isPrevDisabled}
      >
        ← Previous
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button
        className="btn-next"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
