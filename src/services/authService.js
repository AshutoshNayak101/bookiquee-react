import firebase from 'firebase/app';
import 'firebase/auth';

const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes

const saveToken = (token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

export const authService = {
  signUp: async (email, password, displayName) => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await user.updateProfile({ displayName });
      const token = await user.getIdToken();
      saveToken(token);
      localStorage.setItem('userName', displayName);
      localStorage.setItem('userEmail', email);
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      saveToken(token);
      localStorage.setItem('userName', user.displayName || user.email);
      localStorage.setItem('userEmail', user.email);
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  googleSignIn: async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      const token = await user.getIdToken();
      saveToken(token);
      localStorage.setItem('userName', user.displayName || 'User');
      localStorage.setItem('userEmail', user.email);
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await firebase.auth().signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTimestamp');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('favorites');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Always returns a valid token — forces refresh if token is >55 min old.
  // Uses firebase.auth().currentUser which is guaranteed to be set after
  // onAuthStateChanged fires (i.e. after AuthProvider finishes loading).
  refreshTokenIfNeeded: async () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      // No Firebase user — check if we still have a token in storage
      // (could be a brief race on first load, caller should handle null)
      const stored = localStorage.getItem('token');
      return stored
        ? { success: true, token: stored }
        : { success: false, error: 'No authenticated user' };
    }

    const timestamp = parseInt(localStorage.getItem('tokenTimestamp') || '0');
    const age = Date.now() - timestamp;

    if (age > TOKEN_REFRESH_INTERVAL) {
      try {
        const token = await user.getIdToken(true);
        saveToken(token);
        return { success: true, token };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true, token: localStorage.getItem('token') };
  },
};
