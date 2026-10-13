import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import movieApi from '../api/movieApi';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState('Sci-Fi, Action, Drama');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await movieApi.register({
          username,
          email,
          password,
          fullName,
          favoriteGenres,
        });
        if (res.data.success) {
          onAuthSuccess(res.data);
          onClose();
        } else {
          setError(res.data.message || 'Registration failed');
        }
      } else {
        const res = await movieApi.login({ username, password });
        if (res.data.success) {
          onAuthSuccess(res.data);
          onClose();
        } else {
          setError(res.data.message || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await movieApi.login({ username: 'alex', password: 'password123' });
      if (res.data.success) {
        onAuthSuccess(res.data);
        onClose();
      }
    } catch (err) {
      // Fallback demo user if backend is not seeded yet
      onAuthSuccess({
        userId: 1,
        username: 'alex',
        fullName: 'Alex Mercer',
        email: 'alex@example.com',
        favoriteGenres: 'Sci-Fi, Action, Drama',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            {isRegister ? 'Create CineAI Account' : 'Welcome to CineAI'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {isRegister
              ? 'Tell us your favorite genres to calibrate your AI recommendations'
              : 'Sign in to access your personalized recommendation feeds'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. alex"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Favorite Genres (Comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sci-Fi, Action, Thriller"
                  value={favoriteGenres}
                  onChange={(e) => setFavoriteGenres(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            disabled={loading}
          >
            {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
            {loading ? 'Processing...' : isRegister ? 'Register & Calibrate' : 'Sign In'}
          </button>
        </form>

        <button type="button" className="demo-login-btn" onClick={handleDemoLogin}>
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
          1-Click Demo Login (Alex · Sci-Fi &amp; Nolan fan)
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}
          >
            {isRegister ? 'Sign In here' : 'Create an Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
