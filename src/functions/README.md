# Functions Directory Structure

This directory contains all the business logic functions organized by user type and functionality.

## Directory Structure

```
src/functions/
├── guest/           # Guest user functions
│   ├── guestAuth.js      # Guest authentication and permissions
│   ├── guestPoetry.js    # Guest poetry viewing functions
│   └── index.js          # Guest functions export
├── user/            # Regular user functions
│   ├── userAuth.js       # User authentication and management
│   ├── userPoetry.js     # User poetry creation and management
│   ├── userCommunity.js  # User community features (follow, chat)
│   └── index.js          # User functions export
├── admin/           # Admin user functions
│   ├── adminAuth.js           # Admin authentication and permissions
│   ├── adminUserManagement.js # User management functions
│   ├── adminContentManagement.js # Content moderation functions
│   ├── adminAnalytics.js       # Analytics and reporting
│   └── index.js               # Admin functions export
├── index.js         # Main functions export
└── README.md        # This documentation
```

## Usage

### Import specific functions
```javascript
import { userAuth, userPoetry } from '../functions/user';
import { adminAuth, adminUserManagement } from '../functions/admin';
import { guestAuth, guestPoetry } from '../functions/guest';
```

### Import all functions
```javascript
import { userAuth, adminAuth, guestAuth, utils } from '../functions';
```

## Function Categories

### Guest Functions (`/guest/`)
- **guestAuth.js**: Guest authentication, permissions, and access control
- **guestPoetry.js**: Public poetry viewing, searching, and content discovery
- **index.js**: Guest utility functions and exports

### User Functions (`/user/`)
- **userAuth.js**: User login, registration, logout, and profile management
- **userPoetry.js**: Poetry creation, editing, deletion, and like functionality
- **userCommunity.js**: Following users, messaging, and community features
- **index.js**: User utility functions and exports

### Admin Functions (`/admin/`)
- **adminAuth.js**: Admin authentication, permissions, and access control
- **adminUserManagement.js**: User management, role changes, banning, and statistics
- **adminContentManagement.js**: Content moderation, flagging, and deletion
- **adminAnalytics.js**: Platform analytics, user growth, and content statistics
- **index.js**: Admin utility functions and exports

### Utility Functions (`utils`)
- Date formatting
- Email validation
- Password strength validation
- Debounce and throttle functions
- ID generation

## Data Storage

All functions use localStorage for data persistence. In a production environment, these would be replaced with API calls to a backend service.

### Storage Keys
- `users`: Array of user objects
- `poems`: Array of poem objects
- `stories`: Array of story objects
- `follows`: Array of follow relationships
- `messages`: Array of chat messages
- `contentFlags`: Array of flagged content
- `contentDeletions`: Array of deleted content logs
- `backup`: System backup data

## Error Handling

All functions return a consistent response format:
```javascript
{
  success: boolean,
  data?: any,
  error?: string
}
```

## Examples

### Guest: View public poems
```javascript
import { guestPoetry } from '../functions/guest';

const result = await guestPoetry.getPublicPoems();
if (result.success) {
  console.log(result.data); // Array of poems
} else {
  console.error(result.error);
}
```

### User: Upload a poem
```javascript
import { userPoetry } from '../functions/user';

const result = await userPoetry.uploadPoem({
  title: 'My Poem',
  content: 'Poem content here...'
});
if (result.success) {
  console.log('Poem uploaded:', result.poem);
}
```

### Admin: Get platform statistics
```javascript
import { adminAnalytics } from '../functions/admin';

const result = await adminAnalytics.getPlatformStats();
if (result.success) {
  console.log('Platform stats:', result.data);
}
```

