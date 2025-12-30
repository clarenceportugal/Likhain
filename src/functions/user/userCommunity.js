// User Community Functions
export const userCommunity = {
  // Follow/unfollow user
  toggleFollow: async (userId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      
      const existingFollow = follows.find(follow => 
        follow.followerId === currentUser.id && follow.followingId === userId
      );

      if (existingFollow) {
        // Unfollow
        const updatedFollows = follows.filter(follow => follow.id !== existingFollow.id);
        localStorage.setItem('follows', JSON.stringify(updatedFollows));
        return { success: true, action: 'unfollowed' };
      } else {
        // Follow
        const newFollow = {
          id: Date.now(),
          followerId: currentUser.id,
          followingId: userId,
          createdAt: new Date().toISOString()
        };
        follows.push(newFollow);
        localStorage.setItem('follows', JSON.stringify(follows));
        return { success: true, action: 'followed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's followers
  getFollowers: async (userId) => {
    try {
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      const followers = follows.filter(follow => follow.followingId === userId);
      return { success: true, data: followers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get users that user is following
  getFollowing: async (userId) => {
    try {
      const follows = JSON.parse(localStorage.getItem('follows') || '[]');
      const following = follows.filter(follow => follow.followerId === userId);
      return { success: true, data: following };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Send message
  sendMessage: async (recipientId, message) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      
      const newMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        recipientId: recipientId,
        content: message,
        timestamp: new Date().toISOString(),
        read: false
      };

      messages.push(newMessage);
      localStorage.setItem('messages', JSON.stringify(messages));
      return { success: true, message: newMessage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get conversation messages
  getConversation: async (userId1, userId2) => {
    try {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const conversation = messages.filter(message => 
        (message.senderId === userId1 && message.recipientId === userId2) ||
        (message.senderId === userId2 && message.recipientId === userId1)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return { success: true, data: conversation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's conversations
  getUserConversations: async (userId) => {
    try {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const conversations = {};
      
      messages.forEach(message => {
        const otherUserId = message.senderId === userId ? message.recipientId : message.senderId;
        if (!conversations[otherUserId]) {
          conversations[otherUserId] = {
            lastMessage: message,
            unreadCount: 0
          };
        }
        if (message.recipientId === userId && !message.read) {
          conversations[otherUserId].unreadCount++;
        }
      });

      return { success: true, data: conversations };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

