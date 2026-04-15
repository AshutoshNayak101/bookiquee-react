import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/components.css';

export const Navbar = ({ userName, onLogout, onSearch, searchQuery, setSearchQuery, onUpload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showSearchButtons = searchQuery.trim().length > 0;

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') onSearch(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="logo" onClick={() => navigate('/home')}>
            <div className="logo-icon">🅱️</div>
            <div className="logo-info">
              <span className="logo-text">BOOKIQUEE</span>
              <span className="user-name">{userName}</span>
            </div>
          </div>
        </div>

        <div className="navbar-center">
          <div className={`search-wrapper ${showSearchButtons ? 'has-value' : ''}`}>
            <input
              type="text"
              className="search-bar"
              placeholder="🔍 Search books..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
            {showSearchButtons && (
              <>
                <button className="search-icon search-reset" onClick={handleClearSearch} title="Reset search">←</button>
                <button className="search-icon search-clear" onClick={handleClearSearch} title="Clear search">✕</button>
              </>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <button
            className={`nav-fav-btn ${location.pathname === '/favorites' ? 'active' : ''}`}
            onClick={() => navigate('/favorites')}
          >
            ❤️ Favorites
          </button>
          <button className="upload-btn" onClick={onUpload}>
            📤 Upload PDF
          </button>
          <button className="logout-btn" onClick={onLogout}>
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
