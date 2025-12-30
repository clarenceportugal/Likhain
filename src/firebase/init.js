// Firebase Initialization Script
import { realtimeService } from './realtime.js';

export const initializeFirebase = async () => {
  console.log("Initializing Firebase and checking for sample data...");
  try {
    await realtimeService.initSampleData();
    console.log("Firebase initialization complete. Sample data checked/added.");
  } catch (error) {
    console.error("Error during Firebase initialization or sample data setup:", error);
  }
};

// Export for use in other files
export default initializeFirebase;
