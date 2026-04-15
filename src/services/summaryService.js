// AI Summary Service
import { API_BASE_URL } from './apiConfig';

export const summaryService = {
  // Get book summary
  getBookSummary: async (title, author, content, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/summary/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title, author, content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Book summary error:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // Get chapter summary
  getChapterSummary: async (title, chapter, content, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/summary/chapter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title, chapter, content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Chapter summary error:', error);
      return { success: false, error: error.message, data: null };
    }
  }
};
