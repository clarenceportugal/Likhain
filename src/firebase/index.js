// Firebase Services Index
export { auth, db, storage, analytics } from './config.js';
export { authService } from './auth.js';
export { firestoreService } from './firestore.js';

// Re-export commonly used Firebase functions
export { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';

