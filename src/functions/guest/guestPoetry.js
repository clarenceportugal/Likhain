// Guest Poetry Functions
export const guestPoetry = {
  // Get public poems for guests
  getPublicPoems: async () => {
    try {
      // Mock data - in real app, this would be an API call
      const poems = [
        {
          id: 1,
          title: "Mga Tala ng Puso",
          author: "Maria Santos",
          content: "Sa bawat pagtibok ng puso,\nMay mga tala na sumisilip,\nMga pangarap na hindi pa natutupad,\nMga pag-asa na patuloy na lumalago.",
          likes: 45,
          createdAt: "2024-01-15",
          isLiked: false
        },
        {
          id: 2,
          title: "Silent Whispers",
          author: "Juan Dela Cruz",
          content: "In the quiet of the night,\nWhispers dance in moonlight,\nSecrets shared with stars above,\nTales of hope and endless love.",
          likes: 32,
          createdAt: "2024-02-20",
          isLiked: false
        }
      ];
      return { success: true, data: poems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get public stories for guests
  getPublicStories: async () => {
    try {
      const stories = [
        {
          id: 1,
          title: "The Journey of a Poet",
          author: "Likhain Team",
          excerpt: "Discover how Maria Santos found her voice through poetry...",
          readTime: "5 min read"
        },
        {
          id: 2,
          title: "Poetry Across Cultures",
          author: "Likhain Team",
          excerpt: "Explore how different cultures express emotions...",
          readTime: "7 min read"
        }
      ];
      return { success: true, data: stories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search public content
  searchPublicContent: async (query) => {
    try {
      const poems = await guestPoetry.getPublicPoems();
      const stories = await guestPoetry.getPublicStories();
      
      const allContent = [
        ...poems.data.map(poem => ({ ...poem, type: 'poem' })),
        ...stories.data.map(story => ({ ...story, type: 'story' }))
      ];

      const filtered = allContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(query.toLowerCase()))
      );

      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

