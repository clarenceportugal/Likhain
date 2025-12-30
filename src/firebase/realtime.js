import { 
  ref, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  onValue, 
  off,
  query,
  orderByChild,
  equalTo,
  limitToLast
} from 'firebase/database';
import { rtdb } from './config.js';

export const realtimeService = {
  // Users collection
  users: {
    // Create user
    create: async (userData) => {
      try {
        const userRef = ref(rtdb, `users/${userData.uid}`);
        await set(userRef, {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return { success: true, data: userData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get user by ID
    getById: async (uid) => {
      try {
        const userRef = ref(rtdb, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          return { success: true, data: { uid, ...snapshot.val() } };
        }
        return { success: false, error: 'User not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get all users
    getAll: async () => {
      try {
        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const users = Object.entries(snapshot.val()).map(([uid, data]) => ({
            uid,
            ...data
          }));
          return { success: true, data: users };
        }
        return { success: true, data: [] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Update user
    update: async (uid, userData) => {
      try {
        const userRef = ref(rtdb, `users/${uid}`);
        await update(userRef, {
          ...userData,
          updatedAt: new Date().toISOString()
        });
        return { success: true, data: userData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Delete user
    delete: async (uid) => {
      try {
        const userRef = ref(rtdb, `users/${uid}`);
        await remove(userRef);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Poems collection
  poems: {
    // Create poem
    create: async (poemData) => {
      try {
        const poemsRef = ref(rtdb, 'poems');
        const newPoemRef = push(poemsRef);
        const poemId = newPoemRef.key;
        
        await set(newPoemRef, {
          ...poemData,
          id: poemId,
          likes: 0,
          likedBy: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, data: { id: poemId, ...poemData } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get all poems
    getAll: async () => {
      try {
        const poemsRef = ref(rtdb, 'poems');
        const snapshot = await get(poemsRef);
        
        if (snapshot.exists()) {
          const poems = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
            likedBy: data.likedBy || {}
          }));
          return { success: true, data: poems };
        }
        return { success: true, data: [] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get poem by ID
    getById: async (poemId) => {
      try {
        const poemRef = ref(rtdb, `poems/${poemId}`);
        const snapshot = await get(poemRef);
        if (snapshot.exists()) {
          return { success: true, data: { id: poemId, ...snapshot.val() } };
        }
        return { success: false, error: 'Poem not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Toggle like
    toggleLike: async (poemId, userId) => {
      try {
        const poemRef = ref(rtdb, `poems/${poemId}`);
        const snapshot = await get(poemRef);
        
        if (!snapshot.exists()) {
          return { success: false, error: 'Poem not found' };
        }

        const poem = snapshot.val();
        const likedBy = poem.likedBy || {};
        const isLiked = likedBy[userId] || false;
        
        // Toggle like
        const newLikedBy = { ...likedBy };
        if (isLiked) {
          delete newLikedBy[userId];
        } else {
          newLikedBy[userId] = true;
        }
        
        const newLikes = Object.keys(newLikedBy).length;
        
        await update(poemRef, {
          likes: newLikes,
          likedBy: newLikedBy,
          updatedAt: new Date().toISOString()
        });
        
        return { 
          success: true, 
          isLiked: !isLiked, 
          likes: newLikes 
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Update poem
    update: async (poemId, poemData) => {
      try {
        const poemRef = ref(rtdb, `poems/${poemId}`);
        await update(poemRef, {
          ...poemData,
          updatedAt: new Date().toISOString()
        });
        return { success: true, data: poemData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Delete poem
    delete: async (poemId) => {
      try {
        const poemRef = ref(rtdb, `poems/${poemId}`);
        await remove(poemRef);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Stories collection
  stories: {
    // Create story
    create: async (storyData) => {
      try {
        const storiesRef = ref(rtdb, 'stories');
        const newStoryRef = push(storiesRef);
        const storyId = newStoryRef.key;
        
        await set(newStoryRef, {
          ...storyData,
          id: storyId,
          views: 0,
          likes: 0,
          likedBy: {},
          chapters: storyData.chapters || [{ 
            chapterNumber: 1, 
            title: storyData.title || 'Chapter 1', 
            content: storyData.content || '', 
            createdAt: new Date().toISOString() 
          }],
          totalChapters: 1,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, data: { id: storyId, ...storyData } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get all stories
    getAll: async () => {
      try {
        console.log('Fetching stories from Firebase Realtime Database...');
        const storiesRef = ref(rtdb, 'stories');
        const snapshot = await get(storiesRef);
        console.log('Stories snapshot exists:', snapshot.exists());
        
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          console.log('Raw stories data:', rawData);
          const stories = Object.entries(rawData).map(([id, data]) => ({
            id,
            ...data,
            likedBy: data.likedBy || {},
            chapters: data.chapters || [],
            totalChapters: data.totalChapters || 1,
            isCompleted: data.isCompleted || false
          }));
          console.log('Processed stories:', stories.length, stories);
          return { success: true, data: stories };
        }
        console.log('No stories found in database');
        return { success: true, data: [] };
      } catch (error) {
        console.error('Error fetching stories:', error);
        return { success: false, error: error.message };
      }
    },

    // Get story by ID
    getById: async (storyId) => {
      try {
        const storyRef = ref(rtdb, `stories/${storyId}`);
        const snapshot = await get(storyRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          return { 
            success: true, 
            data: { 
              id: storyId, 
              ...data,
              chapters: data.chapters || [],
              totalChapters: data.totalChapters || 1,
              isCompleted: data.isCompleted || false
            } 
          };
        }
        return { success: false, error: 'Story not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Add chapter to existing story
    addChapter: async (storyId, chapterData) => {
      try {
        const storyRef = ref(rtdb, `stories/${storyId}`);
        const snapshot = await get(storyRef);
        
        if (!snapshot.exists()) {
          return { success: false, error: 'Story not found' };
        }

        const story = snapshot.val();
        const currentChapters = story.chapters || [];
        const newChapterNumber = currentChapters.length + 1;
        
        const newChapter = {
          chapterNumber: newChapterNumber,
          title: chapterData.title || `Chapter ${newChapterNumber}`,
          content: chapterData.content,
          author: chapterData.author || story.author,
          authorId: chapterData.authorId || story.authorId,
          authorProfileImage: chapterData.authorProfileImage || story.authorProfileImage || '',
          createdAt: new Date().toISOString()
        };

        const updatedChapters = [...currentChapters, newChapter];
        
        await update(storyRef, {
          chapters: updatedChapters,
          totalChapters: newChapterNumber,
          updatedAt: new Date().toISOString()
        });

        return { success: true, data: newChapter };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Update story (mark as completed, etc.)
    update: async (storyId, updateData) => {
      try {
        const storyRef = ref(rtdb, `stories/${storyId}`);
        await update(storyRef, {
          ...updateData,
          updatedAt: new Date().toISOString()
        });
        return { success: true, data: updateData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Toggle like on story
    toggleLike: async (storyId, userId) => {
      try {
        const storyRef = ref(rtdb, `stories/${storyId}`);
        const snapshot = await get(storyRef);
        
        if (snapshot.exists()) {
          const story = snapshot.val();
          const likedBy = story.likedBy || {};
          const isLiked = likedBy[userId] || false;
          
          if (isLiked) {
            // Unlike
            delete likedBy[userId];
            await update(storyRef, {
              likedBy,
              likes: story.likes - 1
            });
          } else {
            // Like
            likedBy[userId] = true;
            await update(storyRef, {
              likedBy,
              likes: story.likes + 1
            });
          }
          
          return { 
            success: true, 
            isLiked: !isLiked, 
            likes: isLiked ? story.likes - 1 : story.likes + 1,
            likedBy
          };
        }
        
        return { success: false, error: 'Story not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Delete story
    delete: async (storyId) => {
      try {
        const storyRef = ref(rtdb, `stories/${storyId}`);
        await remove(storyRef);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Messages collection
  messages: {
    // Create message
    create: async (messageData) => {
      try {
        const messagesRef = ref(rtdb, 'messages');
        const newMessageRef = push(messagesRef);
        const messageId = newMessageRef.key;
        
        await set(newMessageRef, {
          ...messageData,
          id: messageId,
          createdAt: new Date().toISOString(),
          read: false
        });
        
        return { success: true, data: { id: messageId, ...messageData } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get messages between two users
    getConversation: async (userId1, userId2) => {
      try {
        const messagesRef = ref(rtdb, 'messages');
        const q = query(
          messagesRef,
          orderByChild('participants'),
          equalTo(`${userId1}_${userId2}`)
        );
        
        const snapshot = await get(q);
        if (snapshot.exists()) {
          const messages = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data
          }));
          return { success: true, data: messages };
        }
        return { success: true, data: [] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Comments collection
  comments: {
    // Create comment
    create: async (commentData) => {
      try {
        const commentsRef = ref(rtdb, 'comments');
        const newCommentRef = push(commentsRef);
        const commentId = newCommentRef.key;
        
        await set(newCommentRef, {
          ...commentData,
          id: commentId,
          likes: 0,
          likedBy: {},
          replies: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, data: { id: commentId, ...commentData } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get comments for a poem
    getByPoemId: async (poemId) => {
      try {
        const commentsRef = ref(rtdb, 'comments');
        const snapshot = await get(commentsRef);
        if (snapshot.exists()) {
          const comments = Object.entries(snapshot.val())
            .map(([id, data]) => ({ id, ...data }))
            .filter(comment => comment.poemId === poemId && !comment.parentCommentId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          
          // Get replies for each comment
          for (let comment of comments) {
            const replies = Object.entries(snapshot.val())
              .map(([id, data]) => ({ id, ...data }))
              .filter(reply => reply.parentCommentId === comment.id)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            comment.replies = replies;
          }
          
          return { success: true, data: comments };
        }
        return { success: true, data: [] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Create reply to comment
    createReply: async (parentCommentId, replyData) => {
      try {
        const commentsRef = ref(rtdb, 'comments');
        const newReplyRef = push(commentsRef);
        const replyId = newReplyRef.key;
        
        await set(newReplyRef, {
          ...replyData,
          id: replyId,
          parentCommentId,
          likes: 0,
          likedBy: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, data: { id: replyId, ...replyData } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Toggle like on comment
    toggleLike: async (commentId, userId) => {
      try {
        const commentRef = ref(rtdb, `comments/${commentId}`);
        const snapshot = await get(commentRef);
        
        if (snapshot.exists()) {
          const comment = snapshot.val();
          const likedBy = comment.likedBy || {};
          const isLiked = likedBy[userId] || false;
          
          if (isLiked) {
            // Unlike
            delete likedBy[userId];
            await update(commentRef, {
              likedBy,
              likes: comment.likes - 1,
              updatedAt: new Date().toISOString()
            });
          } else {
            // Like
            likedBy[userId] = true;
            await update(commentRef, {
              likedBy,
              likes: comment.likes + 1,
              updatedAt: new Date().toISOString()
            });
          }
          
          return { 
            success: true, 
            isLiked: !isLiked, 
            likes: isLiked ? comment.likes - 1 : comment.likes + 1 
          };
        }
        
        return { success: false, error: 'Comment not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Update comment
    update: async (commentId, updateData) => {
      try {
        const commentRef = ref(rtdb, `comments/${commentId}`);
        const snapshot = await get(commentRef);
        
        if (snapshot.exists()) {
          const currentData = snapshot.val();
          await update(commentRef, {
            ...updateData,
            updatedAt: new Date().toISOString()
          });
          return { success: true, data: { ...currentData, ...updateData } };
        }
        
        return { success: false, error: 'Comment not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Delete comment
    delete: async (commentId) => {
      try {
        const commentRef = ref(rtdb, `comments/${commentId}`);
        await remove(commentRef);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Initialize sample data (only creates admin user by default)
  initSampleData: async () => {
    try {
      // Check if sample data has already been initialized
      const initFlagRef = ref(rtdb, 'initialized');
      const initSnapshot = await get(initFlagRef);
      
      // Only create sample data if explicitly requested or if database is completely empty
      if (initSnapshot.exists()) {
        console.log('Sample data already initialized, skipping...');
        return { success: true, message: 'Sample data already exists' };
      }

      // Check if admin user exists
      const adminUserRef = ref(rtdb, 'users/renz42gal');
      const adminSnapshot = await get(adminUserRef);
      
      if (!adminSnapshot.exists()) {
        // Create admin user
        await set(adminUserRef, {
          uid: 'renz42gal',
          email: 'renz42gal@likhain.com',
          name: 'Renz Gal',
          role: 'admin',
          bio: 'Administrator of Likhain Poetry Platform',
          location: 'Philippines',
          website: '',
          profileImage: '',
          preferences: {
            language: 'filipino',
            notifications: true,
            publicProfile: true,
            emailUpdates: true
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('Admin user created successfully');
      }

      // Only create sample poems if database is completely empty (no poems at all)
      const poemsRef = ref(rtdb, 'poems');
      const poemsSnapshot = await get(poemsRef);
      
      // Check if we should create sample data (only if completely empty)
      const shouldCreateSampleData = !poemsSnapshot.exists() || Object.keys(poemsSnapshot.val()).length === 0;
      
      if (shouldCreateSampleData) {
        console.log('Database is empty, creating sample poems...');
        // Create sample poems
        const samplePoems = [
          {
            title: "Mga Tala ng Puso",
            content: "Sa bawat pagtibok ng puso,\nMay mga tala na sumisilip,\nMga pangarap na hindi pa natutupad,\nMga pag-asa na patuloy na lumalago.\n\nSa bawat paghinga,\nMay bagong pag-asa,\nSa bawat pagbangon,\nMay bagong lakas.",
            author: "Maria Santos",
            authorId: "sample_user_1",
            authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
            tags: ["love", "hope", "filipino", "emotions"],
            language: "filipino",
            category: "love",
            likes: 15,
            likedBy: {
              "sample_user_2": true,
              "sample_user_3": true
            },
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString()
          },
          {
            title: "Dahon sa Hangin",
            content: "Tulad ng dahon na sumasayaw sa hangin,\nAko'y naglalakbay sa buhay na walang tiyak na patutunguhan,\nNgunit sa bawat pag-ikot,\nMay bagong pag-asa na sumisilip.\n\nSa bawat pagbagsak,\nMay bagong pag-ahon,\nSa bawat pag-ikot,\nMay bagong direksyon.",
            author: "Juan Dela Cruz",
            authorId: "sample_user_2",
            authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNBMDUyMkQiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
            tags: ["nature", "journey", "life", "filipino"],
            language: "filipino",
            category: "life",
            likes: 8,
            likedBy: {
              "sample_user_1": true
            },
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString()
          },
          {
            title: "Mga Salita",
            content: "Ang mga salita ay tulad ng mga bituin,\nNagliliwanag sa kadiliman ng gabi,\nNagbibigay ng liwanag sa mga puso,\nNa puno ng lungkot at pighati.\n\nSa bawat salita,\nMay kapangyarihan,\nSa bawat tula,\nMay pag-asa.",
            author: "Ana Reyes",
            authorId: "sample_user_3",
            authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NTQzMjEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
            tags: ["words", "light", "hope", "filipino"],
            language: "filipino",
            category: "hope",
            likes: 23,
            likedBy: {
              "sample_user_1": true,
              "sample_user_2": true,
              "sample_user_4": true
            },
            createdAt: new Date('2024-01-08').toISOString(),
            updatedAt: new Date('2024-01-08').toISOString()
          },
          {
            title: "Silent Whispers",
            content: "In the quiet of the night,\nWhispers dance in moonlight,\nSecrets shared with stars above,\nTales of hope and endless love.\n\nIn the silence,\nVoices speak,\nIn the darkness,\nLight we seek.",
            author: "Michael Johnson",
            authorId: "sample_user_4",
            authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjlEQzMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
            tags: ["night", "whispers", "love", "english"],
            language: "english",
            category: "love",
            likes: 12,
            likedBy: {
              "sample_user_1": true,
              "sample_user_3": true
            },
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString()
          }
        ];

        for (const poem of samplePoems) {
          const newPoemRef = push(poemsRef);
          await set(newPoemRef, {
            ...poem,
            id: newPoemRef.key
          });
        }
        console.log('Sample poems created successfully');
      }

      // Only create sample users if we're creating sample data
      if (shouldCreateSampleData) {
        console.log('Creating sample users...');
        const usersRef = ref(rtdb, 'users');
        const usersSnapshot = await get(usersRef);
        
        if (!usersSnapshot.exists() || Object.keys(usersSnapshot.val()).length <= 1) {
        // Create sample users
        const sampleUsers = [
          {
            uid: 'sample_user_1',
            email: 'maria@example.com',
            name: 'Maria Santos',
            role: 'user',
            bio: 'Passionate poet from the Philippines',
            location: 'Manila, Philippines',
            website: '',
            profileImage: '',
            preferences: {
              language: 'filipino',
              notifications: true,
              publicProfile: true,
              emailUpdates: true
            },
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString()
          },
          {
            uid: 'sample_user_2',
            email: 'juan@example.com',
            name: 'Juan Dela Cruz',
            role: 'user',
            bio: 'Nature lover and poetry enthusiast',
            location: 'Cebu, Philippines',
            website: '',
            profileImage: '',
            preferences: {
              language: 'filipino',
              notifications: true,
              publicProfile: true,
              emailUpdates: false
            },
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString()
          },
          {
            uid: 'sample_user_3',
            email: 'ana@example.com',
            name: 'Ana Reyes',
            role: 'user',
            bio: 'Writer and dreamer',
            location: 'Davao, Philippines',
            website: '',
            profileImage: '',
            preferences: {
              language: 'filipino',
              notifications: true,
              publicProfile: true,
              emailUpdates: true
            },
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString()
          },
          {
            uid: 'sample_user_4',
            email: 'michael@example.com',
            name: 'Michael Johnson',
            role: 'user',
            bio: 'International poet and traveler',
            location: 'New York, USA',
            website: '',
            profileImage: '',
            preferences: {
              language: 'english',
              notifications: true,
              publicProfile: true,
              emailUpdates: true
            },
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString()
          }
        ];

        for (const user of sampleUsers) {
          const userRef = ref(rtdb, `users/${user.uid}`);
          await set(userRef, user);
        }
        console.log('Sample users created successfully');
        }
      }

      // Only create sample comments if we're creating sample data
      if (shouldCreateSampleData) {
        console.log('Creating sample comments...');
        const commentsRef = ref(rtdb, 'comments');
        const commentsSnapshot = await get(commentsRef);
        
        if (!commentsSnapshot.exists() || Object.keys(commentsSnapshot.val()).length === 0) {
        // Get the first poem ID to add comments to
        const poemsRef = ref(rtdb, 'poems');
        const poemsSnapshot = await get(poemsRef);
        
        if (poemsSnapshot.exists()) {
          const poems = Object.entries(poemsSnapshot.val()).map(([id, data]) => ({ id, ...data }));
          const firstPoem = poems[0];
          
          if (firstPoem) {
            // Create sample comments
            const sampleComments = [
              {
                poemId: firstPoem.id,
                content: "Ang ganda ng tula na ito! Napakamakabuluhan ng mga salita. 💖",
                author: "Maria Santos",
                authorId: "sample_user_1",
                likes: 3,
                likedBy: {
                  "sample_user_2": true,
                  "sample_user_3": true,
                  "renz42gal": true
                },
                createdAt: new Date('2024-01-06T10:30:00').toISOString(),
                updatedAt: new Date('2024-01-06T10:30:00').toISOString()
              },
              {
                poemId: firstPoem.id,
                content: "Salamat sa pagbabahagi ng magandang tula! Nakaka-inspire talaga. ✨",
                author: "Juan Dela Cruz",
                authorId: "sample_user_2",
                likes: 1,
                likedBy: {
                  "sample_user_1": true
                },
                createdAt: new Date('2024-01-06T11:15:00').toISOString(),
                updatedAt: new Date('2024-01-06T11:15:00').toISOString()
              },
              {
                poemId: firstPoem.id,
                content: "Napakagandang pagpapahayag ng damdamin! Ang galing mo talaga sa pagsusulat. 👏",
                author: "Ana Reyes",
                authorId: "sample_user_3",
                likes: 2,
                likedBy: {
                  "sample_user_1": true,
                  "renz42gal": true
                },
                createdAt: new Date('2024-01-06T14:20:00').toISOString(),
                updatedAt: new Date('2024-01-06T14:20:00').toISOString()
              }
            ];

            for (const comment of sampleComments) {
              const newCommentRef = push(commentsRef);
              await set(newCommentRef, {
                ...comment,
                id: newCommentRef.key
              });
            }

            // Add a reply to the first comment
            const firstCommentRef = push(commentsRef);
            await set(firstCommentRef, {
              id: firstCommentRef.key,
              poemId: firstPoem.id,
              parentCommentId: sampleComments[0].id,
              content: "Salamat! Masaya ako na nagustuhan mo ang tula ko. 😊",
              author: "Maria Santos",
              authorId: "sample_user_1",
              likes: 1,
              likedBy: {
                "sample_user_2": true
              },
              createdAt: new Date('2024-01-06T10:45:00').toISOString(),
              updatedAt: new Date('2024-01-06T10:45:00').toISOString()
            });

            console.log('Sample comments created successfully');
          }
        }
        }
      }

      // Set initialization flag
      await set(initFlagRef, {
        initialized: true,
        timestamp: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error initializing sample data:', error);
      return { success: false, error: error.message };
    }
  },

  // Manually create sample data (for testing/demo purposes)
  createSampleData: async () => {
    try {
      console.log('Manually creating sample data...');
      
      // Create sample poems
      const poemsRef = ref(rtdb, 'poems');
      const samplePoems = [
        {
          title: "Mga Tala ng Puso",
          content: "Sa bawat pagtibok ng puso,\nMay mga tala na sumisilip,\nMga pangarap na hindi pa natutupad,\nMga pag-asa na patuloy na lumalago.\n\nSa bawat paghinga,\nMay bagong pag-asa,\nSa bawat pagbangon,\nMay bagong lakas.",
          author: "Maria Santos",
          authorId: "sample_user_1",
          authorProfileImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4QjQ1MTMiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
          tags: ["love", "hope", "filipino", "emotions"],
          language: "filipino",
          category: "love",
          likes: 15,
          likedBy: {
            "sample_user_2": true,
            "sample_user_3": true
          },
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        }
      ];

      for (const poem of samplePoems) {
        const newPoemRef = push(poemsRef);
        await set(newPoemRef, {
          ...poem,
          id: newPoemRef.key
        });
      }

      // Create sample users
      const usersRef = ref(rtdb, 'users');
      const sampleUsers = [
        {
          uid: 'sample_user_1',
          email: 'maria@example.com',
          name: 'Maria Santos',
          role: 'user',
          bio: 'Poet and dreamer',
          location: 'Manila, Philippines',
          website: '',
          profileImage: '',
          preferences: {
            language: 'filipino',
            notifications: true,
            publicProfile: true,
            emailUpdates: true
          },
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-01').toISOString()
        }
      ];

      for (const user of sampleUsers) {
        const userRef = ref(rtdb, `users/${user.uid}`);
        await set(userRef, user);
      }

      console.log('Sample data created successfully');
      return { success: true, message: 'Sample data created' };
    } catch (error) {
      console.error('Error creating sample data:', error);
      return { success: false, error: error.message };
    }
  }
};
