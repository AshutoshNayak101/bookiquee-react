import React, { useState } from 'react';
import { authService } from '../services/authService';
import '../styles/auth.css';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      shakeButton();
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      shakeButton();
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      shakeButton();
      return;
    }

    setLoading(true);
    const result = await authService.signUp(email, password, name);

    if (result.success) {
      alert('Signup successful ✅');
      window.location.href = '/home';
    } else {
      setError(result.error);
      shakeButton();
    }

    setLoading(false);
  };

  const shakeButton = () => {
    const btn = document.querySelector('.btn-signup');
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

          <h2>Create Account</h2>

          <div className="divider">Join Bookiquee Today</div>

          {error && <div style={{ color: '#e9136e', marginBottom: '12px', fontSize: '12px' }}>{error}</div>}

          <div className="input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            <input
              type="email"
              placeholder="Email Address"
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
              placeholder="Create Password"
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

          <div className="input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              className="eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title="Show/hide password"
            ></button>
          </div>

          <p className="terms">
            By signing up, you agree to our{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Terms of Service</span> and{' '}
            <span style={{ color: '#6c63ff', cursor: 'pointer' }}>Privacy Policy</span>
          </p>

          <button
            className="btn-signup"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
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

          <h2>Already have an account?</h2>
          <p>Sign in to your Bookiquee account</p>
          <button
            className="btn-signin"
            onClick={() => window.location.href = '/login'}
            disabled={loading}
          >
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
