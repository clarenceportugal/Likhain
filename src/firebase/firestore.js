// Database Service (using Realtime Database)
import { realtimeService } from './realtime.js';

export const firestoreService = {
  // Poems collection
  poems: {
    // Get all poems
    getAll: async () => {
      return await realtimeService.poems.getAll();
    },

    // Get poem by ID
    getById: async (poemId) => {
      return await realtimeService.poems.getById(poemId);
    },

    // Create poem
    create: async (poemData) => {
      return await realtimeService.poems.create(poemData);
    },

    // Update poem
    update: async (poemId, poemData) => {
      return await realtimeService.poems.update(poemId, poemData);
    },

    // Delete poem
    delete: async (poemId) => {
      return await realtimeService.poems.delete(poemId);
    },

    // Toggle like
    toggleLike: async (poemId, userId) => {
      return await realtimeService.poems.toggleLike(poemId, userId);
    }
  },

  // Users collection
  users: {
    // Get all users
    getAll: async () => {
      return await realtimeService.users.getAll();
    },

    // Get user by ID
    getById: async (uid) => {
      return await realtimeService.users.getById(uid);
    },

    // Create user
    create: async (userData) => {
      return await realtimeService.users.create(userData);
    },

    // Update user
    update: async (uid, userData) => {
      return await realtimeService.users.update(uid, userData);
    },

    // Delete user
    delete: async (uid) => {
      return await realtimeService.users.delete(uid);
    }
  },

  // Stories collection
  stories: {
    // Get all stories
    getAll: async () => {
      return await realtimeService.stories.getAll();
    },

    // Get story by ID
    getById: async (storyId) => {
      return await realtimeService.stories.getById(storyId);
    },

    // Create story
    create: async (storyData) => {
      return await realtimeService.stories.create(storyData);
    },

    // Add chapter to story
    addChapter: async (storyId, chapterData) => {
      return await realtimeService.stories.addChapter(storyId, chapterData);
    },

    // Update story
    update: async (storyId, updateData) => {
      return await realtimeService.stories.update(storyId, updateData);
    },

    // Toggle like on story
    toggleLike: async (storyId, userId) => {
      return await realtimeService.stories.toggleLike(storyId, userId);
    },

    // Delete story
    delete: async (storyId) => {
      return await realtimeService.stories.delete(storyId);
    }
  },

          // Messages collection
          messages: {
            // Create message
            create: async (messageData) => {
              return await realtimeService.messages.create(messageData);
            },

            // Get conversation
            getConversation: async (userId1, userId2) => {
              return await realtimeService.messages.getConversation(userId1, userId2);
            }
          },

          // Comments collection
          comments: {
            // Create comment
            create: async (commentData) => {
              return await realtimeService.comments.create(commentData);
            },

            // Get comments for a poem
            getByPoemId: async (poemId) => {
              return await realtimeService.comments.getByPoemId(poemId);
            },

            // Create reply to comment
            createReply: async (parentCommentId, replyData) => {
              return await realtimeService.comments.createReply(parentCommentId, replyData);
            },

            // Toggle like on comment
            toggleLike: async (commentId, userId) => {
              return await realtimeService.comments.toggleLike(commentId, userId);
            },

            // Update comment
            update: async (commentId, updateData) => {
              return await realtimeService.comments.update(commentId, updateData);
            },

            // Delete comment
            delete: async (commentId) => {
              return await realtimeService.comments.delete(commentId);
            }
          },

  // Initialize sample data
  initSampleData: async () => {
    return await realtimeService.initSampleData();
  }
};