// Book service API calls
import { API_BASE_URL } from './apiConfig';

export const bookService = {
  // Get all books
  getBooks: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: null };
    }
  },

  // Search books
  searchBooks: async (query, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message, data: null };
    }
  },

  // Get book content
  getBookContent: async (url, token) => {
    if (!url) {
      return { success: false, error: 'Invalid book URL', data: null };
    }

    try {
      // Ensure URL is absolute and valid to avoid DNS/ERR_NAME_NOT_RESOLVED issues
      let validatedUrl;
      try {
        validatedUrl = new URL(url);
      } catch (err) {
        return { success: false, error: 'Invalid book URL', data: null };
      }

      let finalUrl = url;

      // 🔥 Allow firebase URLs directly
      if (url.startsWith("firebase://")) {
        finalUrl = url;
      } else {
        try {
          const validatedUrl = new URL(url);

          if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
            return { success: false, error: 'Unsupported URL protocol', data: null };
          }

          finalUrl = validatedUrl.toString();

        } catch (err) {
          return { success: false, error: 'Invalid book URL', data: null };
        }
      }

      const response = await fetch(
        `${API_BASE_URL}/books/content?url=${encodeURIComponent(finalUrl)}`,
        {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return { success: true, data: text };
    } catch (error) {
      return { success: false, error: error.message, data: null };
    }
  },

  // Sample books (fallback)
  getSampleBooks: () => {
    return [
      {
        id: 1,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        cover: "https://via.placeholder.com/200x300?text=Pride+and+Prejudice",
        downloads: 42000,
        rating: 4.5,
        urlOnline: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
        urlText: "https://www.gutenberg.org/files/1342/1342.txt",
        description: "A romantic novel of manners and marriage from the author Jane Austen."
      },
      {
        id: 2,
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        cover: "https://via.placeholder.com/200x300?text=Jane+Eyre",
        downloads: 35000,
        rating: 4.4,
        urlOnline: "https://www.gutenberg.org/files/1260/1260-h/1260-h.htm",
        urlText: "https://www.gutenberg.org/files/1260/1260.txt",
        description: "A gothic romance novel with mystery and drama."
      },
      {
        id: 3,
        title: "Wuthering Heights",
        author: "Emily Brontë",
        cover: "https://via.placeholder.com/200x300?text=Wuthering+Heights",
        downloads: 28000,
        rating: 4.2,
        urlOnline: "https://www.gutenberg.org/files/768/768-h/768-h.htm",
        urlText: "https://www.gutenberg.org/files/768/768.txt",
        description: "A dark and passionate tale of love and revenge."
      },
      {
        id: 4,
        title: "The Odyssey",
        author: "Homer",
        cover: "https://via.placeholder.com/200x300?text=The+Odyssey",
        downloads: 31000,
        rating: 4.3,
        urlOnline: "https://www.gutenberg.org/files/1727/1727-h/1727-h.htm",
        urlText: "https://www.gutenberg.org/files/1727/1727.txt",
        description: "An epic poem about the hero Odysseus and his journey home."
      }
    ];
  },

  // Upload PDF
  uploadPdf: async (file, userId, token, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add book to favorites
  addFavorite: async (userId, book, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/favorite?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's favorites
  getFavorites: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/favorites?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove book from favorites
  removeFavorite: async (userId, bookId, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/favorite?userId=${encodeURIComponent(userId)}&bookId=${encodeURIComponent(bookId)}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's uploaded books
  getUserBooks: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/uploaded?userId=${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
