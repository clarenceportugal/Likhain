// Guest Functions Index
export { guestAuth } from './guestAuth.js';
export { guestPoetry } from './guestPoetry.js';

// Guest utility functions
export const guestUtils = {
  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Get reading time estimate
  getReadingTime: (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  },

  // Truncate text for previews
  truncateText: (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

