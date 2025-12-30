// Admin Content Management Functions
export const adminContentManagement = {
  // Get all poems
  getAllPoems: async () => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      return { success: true, data: poems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all stories
  getAllStories: async () => {
    try {
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      return { success: true, data: stories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete poem
  deletePoem: async (poemId, reason = '') => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const poemIndex = poems.findIndex(poem => poem.id === poemId);
      
      if (poemIndex === -1) {
        return { success: false, error: 'Poem not found' };
      }

      const deletedPoem = poems[poemIndex];
      const filteredPoems = poems.filter(poem => poem.id !== poemId);
      localStorage.setItem('poems', JSON.stringify(filteredPoems));

      // Log the deletion
      const deletions = JSON.parse(localStorage.getItem('contentDeletions') || '[]');
      deletions.push({
        id: Date.now(),
        type: 'poem',
        contentId: poemId,
        title: deletedPoem.title,
        author: deletedPoem.author,
        reason: reason,
        deletedAt: new Date().toISOString(),
        deletedBy: JSON.parse(localStorage.getItem('user')).id
      });
      localStorage.setItem('contentDeletions', JSON.stringify(deletions));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete story
  deleteStory: async (storyId, reason = '') => {
    try {
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      const storyIndex = stories.findIndex(story => story.id === storyId);
      
      if (storyIndex === -1) {
        return { success: false, error: 'Story not found' };
      }

      const deletedStory = stories[storyIndex];
      const filteredStories = stories.filter(story => story.id !== storyId);
      localStorage.setItem('stories', JSON.stringify(filteredStories));

      // Log the deletion
      const deletions = JSON.parse(localStorage.getItem('contentDeletions') || '[]');
      deletions.push({
        id: Date.now(),
        type: 'story',
        contentId: storyId,
        title: deletedStory.title,
        author: deletedStory.author,
        reason: reason,
        deletedAt: new Date().toISOString(),
        deletedBy: JSON.parse(localStorage.getItem('user')).id
      });
      localStorage.setItem('contentDeletions', JSON.stringify(deletions));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Flag content for review
  flagContent: async (contentId, contentType, reason) => {
    try {
      const flags = JSON.parse(localStorage.getItem('contentFlags') || '[]');
      const newFlag = {
        id: Date.now(),
        contentId: contentId,
        contentType: contentType,
        reason: reason,
        flaggedAt: new Date().toISOString(),
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null
      };

      flags.push(newFlag);
      localStorage.setItem('contentFlags', JSON.stringify(flags));
      return { success: true, flag: newFlag };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get flagged content
  getFlaggedContent: async () => {
    try {
      const flags = JSON.parse(localStorage.getItem('contentFlags') || '[]');
      return { success: true, data: flags };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Review flagged content
  reviewFlaggedContent: async (flagId, action, adminNote = '') => {
    try {
      const flags = JSON.parse(localStorage.getItem('contentFlags') || '[]');
      const flagIndex = flags.findIndex(flag => flag.id === flagId);
      
      if (flagIndex === -1) {
        return { success: false, error: 'Flag not found' };
      }

      flags[flagIndex].status = action; // 'approved', 'rejected', 'deleted'
      flags[flagIndex].adminNote = adminNote;
      flags[flagIndex].reviewedBy = JSON.parse(localStorage.getItem('user')).id;
      flags[flagIndex].reviewedAt = new Date().toISOString();

      localStorage.setItem('contentFlags', JSON.stringify(flags));
      return { success: true, flag: flags[flagIndex] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

