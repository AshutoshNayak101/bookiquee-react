import React from 'react';
import '../styles/components.css';

export const Filters = ({ activeSort, onSort }) => {
  const sorts = [
    { key: 'popular', label: 'Popular' },
    { key: 'recent', label: 'Recent' },
    { key: 'top-rated', label: 'Top Rated' },
    { key: 'uploaded', label: 'Uploaded Books' }
  ];

  return (
    <div className="filters">
      {sorts.map(sort => (
        <button
          key={sort.key}
          className={`filter-btn ${activeSort === sort.key ? 'active' : ''}`}
          onClick={() => onSort(sort.key)}
        >
          {sort.label}
        </button>
      ))}
    </div>
  );
};

export default Filters;
