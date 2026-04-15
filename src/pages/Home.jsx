import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import BookReader from '../components/BookReader';
import SummaryCard from '../components/SummaryCard';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import UploadModal from '../components/common/UploadModal';
import Toast from '../components/common/Toast';
import { authService } from '../services/authService';
import { bookService } from '../services/bookService';
import { summaryService } from '../services/summaryService';
import { useAuth } from '../services/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useReader } from '../hooks/useReader';
import '../styles/home.css';

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('popular');
  const [userName, setUserName] = useState('Welcome!');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { authUser, getToken } = useAuth();
  const { isFavorite, isPending, toggleFavorite } = useFavorites();

  const {
    isReading, isBookLoading, bookPages, bookChapters, currentBookPage,
    isSummaryLoading, setIsSummaryLoading, summaryText, setSummaryText,
    showSummaryCard, setShowSummaryCard,
    openReader, closeReader, nextPage, prevPage, goToChapter, closeSummary,
  } = useReader();

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    checkAuthAndLoadBooks();
  }, []);

  const checkAuthAndLoadBooks = async () => {
    const stored_userName = localStorage.getItem('userName');
    if (stored_userName) setUserName(`Welcome, ${stored_userName}`);
    await loadBooks();
  };

  const loadBooks = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) { window.location.href = '/login'; return; }
    const result = await bookService.getBooks(token);

    if (result.success && result.data) {
      setBooks(result.data);
      sortBooks(result.data, 'popular');
    } else {
      const sampleBooks = bookService.getSampleBooks();
      setBooks(sampleBooks);
      sortBooks(sampleBooks, 'popular');
    }
    setLoading(false);
  };

  const loadUploadedBooks = async () => {
    setLoading(true);
    try {
      const userId = authUser?.uid;
      if (!userId) { alert('User not authenticated.'); setLoading(false); return; }

      const token = await getToken();
      if (!token) { window.location.href = '/login'; return; }
      const result = await bookService.getUserBooks(userId, token);

      if (result.success && result.data) {
        setUploadedBooks(result.data);
        setFilteredBooks(result.data);
      } else {
        setUploadedBooks([]);
        setFilteredBooks([]);
        alert('Failed to load uploaded books: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setUploadedBooks([]);
      setFilteredBooks([]);
      alert('Failed to load uploaded books: ' + error.message);
    }
    setLoading(false);
  };

  const sortBooks = (booksToSort, sortType) => {
    const sorted = [...booksToSort];
    switch (sortType) {
      case 'popular': sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0)); break;
      case 'recent': sorted.sort((a, b) => b.id - a.id); break;
      case 'top-rated': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    setFilteredBooks(sorted);
    setCurrentPage(1);
  };

  const handleSort = async (sortType) => {
    setCurrentSort(sortType);
    setCurrentPage(1);
    if (sortType === 'uploaded') {
      await loadUploadedBooks();
    } else {
      sortBooks(books, sortType);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      if (currentSort === 'uploaded') setFilteredBooks(uploadedBooks);
      else setFilteredBooks(books);
      setCurrentPage(1);
      return;
    }
    setLoading(true);
    const token = await getToken();
    if (!token) { window.location.href = '/login'; return; }
    const result = await bookService.searchBooks(query, token);

    if (result.success && result.data) {
      if (currentSort === 'uploaded') {
        const uploadedIds = new Set(uploadedBooks.map(b => b.id));
        setFilteredBooks(result.data.filter(b => uploadedIds.has(b.id)));
      } else {
        setFilteredBooks(result.data);
      }
    } else {
      setFilteredBooks([]);
    }
    setCurrentPage(1);
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await authService.signOut();
    if (result.success) window.location.href = '/login';
  };

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.type !== 'application/pdf') { alert('Please select a PDF file.'); return; }

      const userId = authUser?.uid;
      if (!userId) { alert('User not authenticated.'); return; }

      setIsUploading(true);
      setUploadMessage('Uploading and processing PDF...');
      setUploadProgress(0);

      const token = await getToken();
      if (!token) { setIsUploading(false); alert('Authentication failed.'); return; }
      const result = await bookService.uploadPdf(file, userId, token);
      setIsUploading(false);

      if (result.success) {
        alert(result.data.existingBookId ? 'Book already exists, added to your library' : 'Book uploaded successfully');
        await loadBooks();
      } else {
        alert(result.error?.includes('TEXT_EXTRACTION_FAILED') ? 'This PDF is scanned. OCR support coming soon.' : 'Upload failed');
      }
    };
    input.click();
  };

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleToggleFavorite = async () => {
    if (!selectedBook) return;
    const result = await toggleFavorite(selectedBook);
    if (result.added) {
      showToast(`❤️ "${selectedBook.title}" added to favorites!`);
    } else if (result.removed) {
      showToast(`💔 "${selectedBook.title}" removed from favorites`, 'info');
    } else if (!result.success) {
      showToast(`Failed to update favorites: ${result.error || 'Please try again'}`, 'error');
    }
  };

  const handleReadBook = async (book) => {
    setShowModal(false);
    await openReader(book);
  };

  const handleReadBookSummary = async () => {
    if (!selectedBook) return;
    setIsSummaryLoading(true);
    setSummaryText('');
    setShowSummaryCard(true);

    const token = await getToken();
    if (!token) { setIsSummaryLoading(false); return; }

    const bookContent = bookPages.length > 0 ? bookPages.slice(0, 5).join(' ') : selectedBook.description;
    const result = await summaryService.getBookSummary(
      selectedBook.title, selectedBook.author || 'Unknown Author', bookContent, token
    );

    if (result.success) {
      setSummaryText(result.data.summary || 'No summary available.');
    } else {
      alert(`Failed to generate summary: ${result.error}`);
      setShowSummaryCard(false);
    }
    setIsSummaryLoading(false);
  };

  const handleGetSummary = async () => {
    if (!selectedBook || bookPages.length === 0) { alert('Not enough content available.'); return; }
    setIsSummaryLoading(true);
    setSummaryText('');
    setShowSummaryCard(true);

    const token = await getToken();
    if (!token) { setIsSummaryLoading(false); return; }

    let result;
    if (bookChapters.length > 0) {
      const currentPageContent = bookPages[currentBookPage - 1];
      const currentChapter = bookChapters.find(ch => ch.page === currentBookPage)?.title || `Page ${currentBookPage}`;
      result = await summaryService.getChapterSummary(selectedBook.title, currentChapter, currentPageContent, token);
    } else {
      result = await summaryService.getBookSummary(selectedBook.title, selectedBook.author || 'Unknown Author', bookPages.join(' '), token);
    }

    if (result.success) {
      setSummaryText(result.data.summary || 'No summary available.');
    } else {
      alert(`Failed to generate summary: ${result.error}`);
      setShowSummaryCard(false);
    }
    setIsSummaryLoading(false);
  };

  // Pagination
  const itemsPerPage = 12;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

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
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onUpload={handleUpload}
      />

      <div className="container">
        <header className="header">
          <h1>📚 Discover Thousands of Books</h1>
          <p>Explore the world's finest collection of literature</p>
        </header>

        <Filters activeSort={currentSort} onSort={handleSort} />

        <div className="books-grid">
          {loading ? (
            <LoadingSpinner />
          ) : paginatedBooks.length > 0 ? (
            paginatedBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                isFavorite={isFavorite(book.id)}
                onClick={() => handleOpenModal(book)}
              />
            ))
          ) : (
            <div className="loading" style={{ gridColumn: '1 / -1' }}>
              <p>{currentSort === 'uploaded' ? 'No uploaded books yet.' : 'No books found.'}</p>
            </div>
          )}
        </div>

        {filteredBooks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => { if (currentPage < totalPages) { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            onPrev={() => { if (currentPage > 1) { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
          />
        )}
      </div>

      <BookModal
        book={selectedBook}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRead={() => handleReadBook(selectedBook)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedBook ? isFavorite(selectedBook.id) : false}
        isPending={selectedBook ? isPending(selectedBook.id) : false}
        onReadSummary={handleReadBookSummary}
        isSummaryLoading={isSummaryLoading}
      />

      <SummaryCard
        isOpen={showSummaryCard && !isReading}
        summaryText={summaryText}
        isLoading={isSummaryLoading}
        onClose={closeSummary}
      />

      <UploadModal
        isOpen={isUploading}
        message={uploadMessage}
        progress={uploadProgress}
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

export default Home;
