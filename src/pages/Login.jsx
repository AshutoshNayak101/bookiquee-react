import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../services/AuthContext';
import firebase from 'firebase/app';
import 'firebase/auth';
import '../styles/auth.css';

export const Login = () => {
  const navigate = useNavigate();
  const { authUser, authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  // Redirect already-authenticated users away from login
  useEffect(() => {
    if (!authLoading && authUser) navigate('/home', { replace: true });
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      shakeButton();
      return;
    }

    setLoading(true);
    const result = await authService.signIn(email, password);

    if (result.success) {
      window.location.href = '/home';
    } else {
      setError(result.error);
      shakeButton();
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await authService.googleSignIn();

    if (result.success) {
      window.location.href = '/home';
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage('');
    setError('');

    // Validation
    if (!forgotPasswordEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setForgotPasswordLoading(true);

    try {
      await firebase.auth().sendPasswordResetEmail(forgotPasswordEmail.trim());
      setForgotPasswordMessage('Password reset email sent. Check your inbox.');
      setForgotPasswordEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send password reset email';

      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
    }

    setForgotPasswordLoading(false);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
    setForgotPasswordMessage('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setError('');
    setForgotPasswordMessage('');
  };

  const shakeButton = () => {
    const btn = document.querySelector('.btn-signin');
    if (btn) {
      btn.style.animation = 'none';
      btn.style.transform = 'translateX(-6px)';
      setTimeout(() => { btn.style.transform = 'translateX(6px)'; }, 80);
      setTimeout(() => { btn.style.transform = 'translateX(-4px)'; }, 160);
      setTimeout(() => { btn.style.transform = ''; btn.style.animation = ''; }, 240);
    }
  };

  return (
    <div className="auth-page">
      {showWelcome && (
        <div className="welcome-screen" id="welcomeScreen">
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="filmstrip"></div>
          <div className="filmstrip-btm"></div>
          <div className="welcome-content">
            <div className="logo2">📚 Bookiquee</div>
            <h1>Welcome to Bookiquee</h1>
            <p>Read Smarter. Summarise Instantly.</p>
          </div>
        </div>
      )}

      <div className="bg-blobs">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="card">
        <div className="left">
          <div className="logo">
            <div className="logo-icon">🅱️</div>
            <span className="logo-text">BOOKIQUEE</span>
          </div>

          {!showForgotPassword ? (
            <>
              <h2>Sign in use</h2>

              <button
                className="google-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <div className="google-icon-wrapper">
                  <img
                    className="google-icon"
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                  />
                </div>
                <span className="btn-text">Sign in with Google</span>
              </button>

              <div className="divider">or use your email account:</div>

              {error && <div style={{ color: '#e9136e', marginBottom: '12px', fontSize: '12px' }}>{error}</div>}

              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                <input
                  type="email"
                  id="emailInput"
                  placeholder="Email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passInput"
                  placeholder="Password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Show/hide password"
                ></button>
              </div>

              <div className="forgot" onClick={handleShowForgotPassword} style={{ cursor: 'pointer' }}>
                Forget your password?
              </div>
              <button
                className="btn-signin"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && <div style={{ color: '#e9136e', marginBottom: '12px', fontSize: '12px' }}>{error}</div>}
              {forgotPasswordMessage && <div style={{ color: '#28a745', marginBottom: '12px', fontSize: '12px' }}>{forgotPasswordMessage}</div>}

              <form onSubmit={handleForgotPassword}>
                <div className="input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    disabled={forgotPasswordLoading}
                  />
                </div>

                <button
                  className="btn-signin"
                  type="submit"
                  disabled={forgotPasswordLoading}
                  style={{ marginTop: '20px' }}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px', margin: '0 auto 0 0' }}></div>
                      SENDING...
                    </>
                  ) : (
                    'SEND RESET LINK'
                  )}
                </button>
              </form>

              <div
                className="forgot"
                onClick={handleBackToLogin}
                style={{ cursor: 'pointer', marginTop: '16px' }}
              >
                ← Back to Login
              </div>
            </>
          )}
        </div>

        <div className="right">
          <div className="deco-circle"></div>
          <div className="deco-circle"></div>
          <div className="deco-circle"></div>

          <div className="book-animation">
            <div className="book">
              <div className="book-front">
                <div className="book-spine"></div>
                <div className="book-cover">
                  <div className="book-title">BOOKIQUEE</div>
                  <div className="book-icon">📖</div>
                </div>
              </div>
              <div className="book-back">
                <div className="book-content"></div>
              </div>
            </div>
            <div className="book-shadow"></div>
          </div>

          <h2>New to BOOKIQUEE?</h2>
          <p>Read and summarise your best book by signing up here!</p>
          <button
            className="btn-hello"
            onClick={() => window.location.href = '/signup'}
            disabled={loading}
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
