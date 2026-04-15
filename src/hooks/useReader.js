import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { bookService } from '../services/bookService';
import { cleanBookText, splitBookIntoPages } from '../utilities/bookUtils';

export const useReader = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [isReading, setIsReading] = useState(false);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookPages, setBookPages] = useState([]);
  const [bookChapters, setBookChapters] = useState([]);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [showSummaryCard, setShowSummaryCard] = useState(false);

  const openReader = async (book) => {
    if (!book.urlText) {
      alert('Read link not available. Please check back later.');
      return;
    }

    setSelectedBook(book);
    setIsReading(true);
    setIsBookLoading(true);

    const token = await getToken();
    if (!token) { navigate('/login'); return; }

    const result = await bookService.getBookContent(book.urlText, token);

    if (!result.success) {
      alert(`Failed to load book content: ${result.error || 'Unknown error'}`);
      setIsReading(false);
      setIsBookLoading(false);
      return;
    }

    const cleanedText = cleanBookText(result.data);
    const { pages, chapters } = splitBookIntoPages(cleanedText, 500);

    if (!pages || pages.length === 0) {
      alert('No readable content found in this book.');
      setIsReading(false);
      setIsBookLoading(false);
      return;
    }

    setBookPages(pages);
    setBookChapters(chapters);
    setCurrentBookPage(1);
    setIsBookLoading(false);
  };

  const closeReader = () => {
    setIsReading(false);
    setIsBookLoading(false);
    setBookPages([]);
    setBookChapters([]);
    setCurrentBookPage(1);
  };

  const nextPage = () => {
    if (currentBookPage < bookPages.length) setCurrentBookPage(p => p + 1);
  };

  const prevPage = () => {
    if (currentBookPage > 1) setCurrentBookPage(p => p - 1);
  };

  const closeSummary = () => {
    setShowSummaryCard(false);
    setSummaryText('');
  };

  return {
    isReading, isBookLoading, selectedBook, setSelectedBook,
    bookPages, bookChapters, currentBookPage,
    isSummaryLoading, setIsSummaryLoading,
    summaryText, setSummaryText,
    showSummaryCard, setShowSummaryCard,
    openReader, closeReader, nextPage, prevPage,
    goToChapter: setCurrentBookPage,
    closeSummary,
  };
};
