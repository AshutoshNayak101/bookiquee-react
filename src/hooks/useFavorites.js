import { useState, useCallback } from 'react';
import { useAuth } from '../services/AuthContext';
import { bookService } from '../services/bookService';

const getLocalFavorites = () => JSON.parse(localStorage.getItem('favorites') || '[]');
const setLocalFavorites = (favs) => localStorage.setItem('favorites', JSON.stringify(favs));

export const useFavorites = () => {
  const { authUser, getToken } = useAuth();

  // Set of book IDs confirmed saved (from backend or localStorage)
  const [favoriteIds, setFavoriteIds] = useState(() => {
    return new Set(getLocalFavorites().map(b => b.id));
  });

  // Set of book IDs currently being processed — prevents double-clicks
  const [pendingIds, setPendingIds] = useState(new Set());

  const isFavorite = useCallback((bookId) => favoriteIds.has(bookId), [favoriteIds]);
  const isPending = useCallback((bookId) => pendingIds.has(bookId), [pendingIds]);

  const addFavorite = async (book) => {
    if (favoriteIds.has(book.id)) return { success: false, alreadyAdded: true };
    if (pendingIds.has(book.id)) return { success: false, pending: true };

    // Mark as pending — disable button immediately
    setPendingIds(prev => new Set([...prev, book.id]));

    try {
      const userId = authUser?.uid;
      if (!userId) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(book.id); return n; });
        return { success: false, error: 'Not authenticated' };
      }

      const token = await getToken();
      if (!token) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(book.id); return n; });
        return { success: false, error: 'No token' };
      }

      const result = await bookService.addFavorite(userId, book, token);

      if (!result.success) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(book.id); return n; });
        return { success: false, error: result.error || 'Failed to add favorite' };
      }

      // Only update UI after backend confirms
      setFavoriteIds(prev => new Set([...prev, book.id]));
      setLocalFavorites([...getLocalFavorites(), book]);
      setPendingIds(prev => { const n = new Set(prev); n.delete(book.id); return n; });
      return { success: true };

    } catch (err) {
      setPendingIds(prev => { const n = new Set(prev); n.delete(book.id); return n; });
      return { success: false, error: err.message };
    }
  };

  const removeFavorite = async (bookId) => {
    if (!favoriteIds.has(bookId)) return { success: false, notFound: true };
    if (pendingIds.has(bookId)) return { success: false, pending: true };

    setPendingIds(prev => new Set([...prev, bookId]));

    try {
      const userId = authUser?.uid;
      if (!userId) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
        return { success: false, error: 'Not authenticated' };
      }

      const token = await getToken();
      if (!token) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
        return { success: false, error: 'No token' };
      }

      const result = await bookService.removeFavorite(userId, bookId, token);

      if (!result.success) {
        setPendingIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
        return { success: false, error: result.error || 'Failed to remove favorite' };
      }

      // Only update UI after backend confirms
      setFavoriteIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
      setLocalFavorites(getLocalFavorites().filter(b => b.id !== bookId));
      setPendingIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
      return { success: true };

    } catch (err) {
      setPendingIds(prev => { const n = new Set(prev); n.delete(bookId); return n; });
      return { success: false, error: err.message };
    }
  };

  const toggleFavorite = async (book) => {
    if (favoriteIds.has(book.id)) {
      const result = await removeFavorite(book.id);
      return { ...result, removed: result.success };
    }
    const result = await addFavorite(book);
    return { ...result, added: result.success };
  };

  // Sync favoriteIds from a freshly fetched list (called by Favorites page on load)
  const syncFromBackend = useCallback((books) => {
    const ids = new Set(books.map(b => b.id));
    setFavoriteIds(ids);
    setLocalFavorites(books);
  }, []);

  return { isFavorite, isPending, addFavorite, removeFavorite, toggleFavorite, syncFromBackend, favoriteIds };
};
