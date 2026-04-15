import firebase from 'firebase/app';
import 'firebase/auth';

const getRequiredEnvVar = (key) => {
  const value = import.meta.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`[Firebase Config] Missing required environment variable: ${key}`);
  }

  return value;
};

const createFirebaseConfig = () => {
  const config = {
    apiKey: getRequiredEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnvVar('VITE_FIREBASE_APP_ID'),
  };

  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  }

  return config;
};

// Initialize Firebase (this will be called in App.jsx)
export const initFirebase = () => {
  try {
    if (!firebase.apps.length) {
      const firebaseConfig = createFirebaseConfig();
      firebase.initializeApp(firebaseConfig);
    }
  } catch (error) {
    console.error(
      '[Firebase Config] Firebase initialization failed. Ensure all required VITE_FIREBASE_* environment variables are set.',
      error
    );
    throw error;
  }
};
