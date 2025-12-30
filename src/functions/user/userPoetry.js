// User Poetry Functions
export const userPoetry = {
  // Upload new poem
  uploadPoem: async (poemData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const newPoem = {
        id: Date.now(),
        title: poemData.title,
        content: poemData.content,
        author: user.name,
        authorId: user.id,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // In real app, this would be an API call
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      poems.push(newPoem);
      localStorage.setItem('poems', JSON.stringify(poems));

      return { success: true, poem: newPoem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Like/unlike poem
  toggleLike: async (poemId) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const poemIndex = poems.findIndex(poem => poem.id === poemId);
      
      if (poemIndex === -1) {
        return { success: false, error: 'Poem not found' };
      }

      const poem = poems[poemIndex];
      poem.isLiked = !poem.isLiked;
      poem.likes += poem.isLiked ? 1 : -1;

      poems[poemIndex] = poem;
      localStorage.setItem('poems', JSON.stringify(poems));

      return { success: true, poem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's poems
  getUserPoems: async (userId) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const userPoems = poems.filter(poem => poem.authorId === userId);
      return { success: true, data: userPoems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Edit poem
  editPoem: async (poemId, updatedData) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const poemIndex = poems.findIndex(poem => poem.id === poemId);
      
      if (poemIndex === -1) {
        return { success: false, error: 'Poem not found' };
      }

      poems[poemIndex] = {
        ...poems[poemIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('poems', JSON.stringify(poems));
      return { success: true, poem: poems[poemIndex] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete poem
  deletePoem: async (poemId) => {
    try {
      const poems = JSON.parse(localStorage.getItem('poems') || '[]');
      const filteredPoems = poems.filter(poem => poem.id !== poemId);
      localStorage.setItem('poems', JSON.stringify(filteredPoems));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

