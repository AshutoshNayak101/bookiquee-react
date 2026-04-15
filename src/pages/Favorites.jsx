import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import BookReader from '../components/BookReader';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import { authService } from '../services/authService';
import { bookService } from '../services/bookService';
import { summaryService } from '../services/summaryService';
import { useAuth } from '../services/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useReader } from '../hooks/useReader';
import '../styles/home.css';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [userName, setUserName] = useState('Welcome!');
  const [searchQuery, setSearchQuery] = useState('');

  const { authUser, authLoading, getToken } = useAuth();
  const { isFavorite, isPending, toggleFavorite, syncFromBackend } = useFavorites();
  const {
    isReading, isBookLoading, bookPages, bookChapters, currentBookPage,
    isSummaryLoading, setIsSummaryLoading, summaryText, setSummaryText,
    showSummaryCard, setShowSummaryCard,
    openReader, closeReader, nextPage, prevPage, goToChapter, closeSummary,
  } = useReader();

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const stored = localStorage.getItem('userName');
    if (stored) setUserName(`Welcome, ${stored}`);
  }, []);

  // Wait for auth to be ready before fetching favorites
  useEffect(() => {
    if (!authLoading) loadFavorites();
  }, [authLoading]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const userId = authUser?.uid;
      if (!userId) { navigate('/login'); return; }

      const token = await getToken();
      if (!token) { navigate('/login'); return; }
      const result = await bookService.getFavorites(userId, token);

      if (result.success && result.data) {
        setFavorites(result.data);
        syncFromBackend(result.data); // keep useFavorites in sync with backend truth
      } else {
        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(local);
        syncFromBackend(local);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(local);
      syncFromBackend(local);
    }
    setLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!selectedBook) return;
    const result = await toggleFavorite(selectedBook);
    if (result.removed) {
      setFavorites(prev => prev.filter(b => b.id !== selectedBook.id));
      showToast(`"${selectedBook.title}" removed from favorites`, 'info');
      setShowModal(false);
    } else if (result.added) {
      showToast(`"${selectedBook.title}" added to favorites`);
    } else if (!result.success) {
      showToast(`Failed to update favorites: ${result.error || 'Please try again'}`, 'error');
    }
  };

  const handleReadBook = async (book) => {
    setShowModal(false);
    await openReader(book);
  };

  const handleGetSummary = async () => {
    if (!selectedBook || bookPages.length === 0) {
      alert('Not enough content available.');
      return;
    }
    setIsSummaryLoading(true);
    setSummaryText('');
    setShowSummaryCard(true);

    const token = await getToken();
    if (!token) { setIsSummaryLoading(false); return; }

    const result = await summaryService.getBookSummary(
      selectedBook.title,
      selectedBook.author || 'Unknown Author',
      bookPages.slice(0, 5).join(' '),
      token
    );

    if (result.success) {
      setSummaryText(result.data.summary || 'No summary available.');
    } else {
      alert(`Failed to generate summary: ${result.error}`);
      setShowSummaryCard(false);
    }
    setIsSummaryLoading(false);
  };

  const handleReadSummary = async () => {
    if (!selectedBook) return;
    setIsSummaryLoading(true);
    setSummaryText('');
    setShowSummaryCard(true);

    const token = await getToken();
    if (!token) { setIsSummaryLoading(false); return; }

    const result = await summaryService.getBookSummary(
      selectedBook.title,
      selectedBook.author || 'Unknown Author',
      selectedBook.description || '',
      token
    );

    if (result.success) {
      setSummaryText(result.data.summary || 'No summary available.');
    } else {
      alert(`Failed to generate summary: ${result.error}`);
      setShowSummaryCard(false);
    }
    setIsSummaryLoading(false);
  };

  const handleLogout = async () => {
    const result = await authService.signOut();
    if (result.success) navigate('/login');
  };

  if (isReading) {
    if (isBookLoading) {
      return (
        <div className="reader-loader" style={{ minHeight: '100vh' }}>
          <div className="spinner"></div>
          <p>Loading book content...</p>
        </div>
      );
    }
    if (bookPages.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>No content available.</p>
          <button onClick={closeReader}>Go Back</button>
        </div>
      );
    }
    return (
      <>
        <BookReader
          book={selectedBook}
          pages={bookPages}
          chapters={bookChapters}
          currentPage={currentBookPage}
          onClose={closeReader}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onGoToChapter={goToChapter}
          onGetSummary={handleGetSummary}
          isSummaryLoading={isSummaryLoading}
        />
        <SummaryCard
          isOpen={showSummaryCard}
          summaryText={summaryText}
          isLoading={isSummaryLoading}
          onClose={closeSummary}
        />
      </>
    );
  }

  return (
    <>
      <Navbar
        userName={userName}
        onLogout={handleLogout}
        onSearch={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onUpload={() => {}}
      />

      <div className="container">
        <div className="favorites-header">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Back to Home
          </button>
          <div className="favorites-title-wrap">
            <h1 className="favorites-title">❤️ My Favorites</h1>
            {!loading && (
              <span className="favorites-count">{favorites.length} book{favorites.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="books-grid">
          {loading ? (
            <LoadingSpinner />
          ) : favorites.length > 0 ? (
            favorites.map((book, index) => (
              <div key={book.id} className="book-card-wrap">
                <BookCard
                  book={book}
                  index={index}
                  isFavorite={true}
                  onClick={() => { setSelectedBook(book); setShowModal(true); }}
                />
                <button
                  className="btn-remove-fav"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const result = await toggleFavorite(book);
                    if (result.removed) {
                      setFavorites(prev => prev.filter(b => b.id !== book.id));
                      showToast(`"${book.title}" removed from favorites`, 'info');
                    } else if (!result.success) {
                      showToast(`Failed to remove: ${result.error || 'Please try again'}`, 'error');
                    }
                  }}
                  disabled={isPending(book.id)}
                  style={{ opacity: isPending(book.id) ? 0.6 : 1, cursor: isPending(book.id) ? 'not-allowed' : 'pointer' }}
                  title="Remove from favorites"
                >
                  {isPending(book.id) ? '⏳ Removing...' : '💔 Remove'}
                </button>
              </div>
            ))
          ) : (
            <div className="empty-favorites">
              <div className="empty-fav-icon">💔</div>
              <h2>No favorites yet</h2>
              <p>Books you add to favorites will appear here.</p>
              <button className="btn-read" onClick={() => navigate('/home')}>
                Browse Books
              </button>
            </div>
          )}
        </div>
      </div>

      <BookModal
        book={selectedBook}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRead={() => handleReadBook(selectedBook)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedBook ? isFavorite(selectedBook.id) : false}
        isPending={selectedBook ? isPending(selectedBook.id) : false}
        onReadSummary={handleReadSummary}
        isSummaryLoading={isSummaryLoading}
      />

      <SummaryCard
        isOpen={showSummaryCard && !isReading}
        summaryText={summaryText}
        isLoading={isSummaryLoading}
        onClose={closeSummary}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default Favorites;
