import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = createContext(null);

const TOKEN_REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes

export const AuthProvider = ({ children }) => {
  // null = still loading, false = not authed, object = authed user
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const saveToken = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  const scheduleRefresh = useCallback((user) => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);

    refreshTimerRef.current = setInterval(async () => {
      try {
        const token = await user.getIdToken(true);
        saveToken(token);
      } catch {
        // If refresh fails the onAuthStateChanged will fire and handle it
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, []);

  // getToken — always returns a fresh-enough token, forces refresh if >55 min old
  const getToken = useCallback(async () => {
    const user = firebase.auth().currentUser;
    if (!user) return null;

    const timestamp = parseInt(localStorage.getItem('tokenTimestamp') || '0');
    const age = Date.now() - timestamp;

    if (age > TOKEN_REFRESH_INTERVAL) {
      try {
        const token = await user.getIdToken(true);
        saveToken(token);
        return token;
      } catch {
        return null;
      }
    }

    return localStorage.getItem('token');
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Always get a fresh token when auth state is confirmed
          const token = await user.getIdToken(false);
          saveToken(token);
          localStorage.setItem('userName', user.displayName || user.email || 'User');
          localStorage.setItem('userEmail', user.email || '');
          setAuthUser(user);
          scheduleRefresh(user);
        } catch {
          setAuthUser(false);
          clearToken();
        }
      } else {
        setAuthUser(false);
        clearToken();
        if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  return (
    <AuthContext.Provider value={{ authUser, authLoading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
