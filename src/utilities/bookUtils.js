// Book utility functions
export const cleanBookText = (text) => {
  const start = text.indexOf("*** START");
  const end = text.indexOf("*** END");

  let clean = text;

  if (start !== -1 && end !== -1) {
    clean = text.substring(start, end);
  }

  // Normalize
  clean = clean.replace(/\r\n/g, "\n");

  // Remove extra empty lines
  clean = clean.replace(/\n{3,}/g, "\n\n");

  return clean.trim();
};

export const splitBookIntoPages = (text, maxWords = 500) => {
  const paragraphs = text.split(/\n\s*\n/);
  const pages = [];
  let currentPage = "";
  let wordCount = 0;

  const bookChapters = [];

  paragraphs.forEach(p => {
    const trimmed = p.trim();
    if (!trimmed) return;

    const isChapter = trimmed.match(/^(chapter|book|part)\s+\w+/i);

    // If chapter → force new page
    if (isChapter) {
      if (currentPage.trim()) {
        pages.push(currentPage.trim());
      }

      // Save chapter index
      bookChapters.push({
        title: trimmed,
        page: pages.length + 1
      });

      currentPage = trimmed + "\n\n";
      wordCount = trimmed.split(/\s+/).length;
      return;
    }

    const words = trimmed.split(/\s+/).length;

    if (wordCount + words > maxWords) {
      pages.push(currentPage.trim());
      currentPage = trimmed + "\n\n";
      wordCount = words;
    } else {
      currentPage += trimmed + "\n\n";
      wordCount += words;
    }
  });

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return { pages, chapters: bookChapters };
};

export const formatBookContent = (text) => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs.map((p, idx) => {
    const trimmed = p.trim();

    if (!trimmed) return null;

    // Chapter detection
    if (trimmed.match(/^(chapter|book|part)\s+\w+/i)) {
      return {
        type: "chapter",
        content: trimmed,
        key: `chapter-${idx}`
      };
    } else {
      return {
        type: "paragraph",
        content: trimmed,
        key: `para-${idx}`
      };
    }
  }).filter(Boolean);
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Favorites management
export const favoritesService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  },

  add: (book) => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.find(b => b.id === book.id)) {
      favorites.push(book);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return true;
    }
    return false;
  },

  remove: (bookId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(b => b.id !== bookId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  },

  isFavorite: (bookId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(b => b.id === bookId);
  }
};
