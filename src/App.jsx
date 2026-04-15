import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initFirebase } from './services/firebaseConfig';
import { AuthProvider, useAuth } from './services/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Favorites from './pages/Favorites';

initFirebase();

const ProtectedRoute = ({ element }) => {
  const { authUser, authLoading } = useAuth();

  // Wait for Firebase to restore session before making any routing decision
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'linear-gradient(135deg, #f0eeff 0%, #dcd6f7 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '4px solid #f3f3f3',
            borderTop: '4px solid #f5457e', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#f5457e', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return authUser ? element : <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/favorites" element={<ProtectedRoute element={<Favorites />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
