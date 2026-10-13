import React, { useState, useEffect } from 'react';
import { X, User, Star, Heart, Sliders, LogOut, Check } from 'lucide-react';
import movieApi from '../api/movieApi';

export default function ProfileModal({
  currentUser,
  onClose,
  onLogout,
  onProfileUpdated,
}) {
  const [profileData, setProfileData] = useState(null);
  const [favoriteGenres, setFavoriteGenres] = useState(currentUser?.favoriteGenres || '');
  const [updatingGenres, setUpdatingGenres] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.userId || currentUser?.id) {
      loadProfile(currentUser.userId || currentUser.id);
    }
  }, [currentUser]);

  const loadProfile = async (uid) => {
    try {
      const res = await movieApi.getUserProfile(uid);
      setProfileData(res.data);
      if (res.data.favoriteGenres) {
        setFavoriteGenres(res.data.favoriteGenres);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSaveGenres = async (e) => {
    e.preventDefault();
    setUpdatingGenres(true);
    setSavedSuccess(false);
    try {
      const uid = currentUser.userId || currentUser.id;
      await movieApi.updateFavoriteGenres(uid, favoriteGenres);
      setSavedSuccess(true);
      if (onProfileUpdated) {
        onProfileUpdated({ ...currentUser, favoriteGenres });
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating genres:', err);
    } finally {
      setUpdatingGenres(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentUser.fullName || currentUser.username}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>@{currentUser.username} · {currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem 2rem' }}>
          {/* Profile Stats */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-num">{profileData?.ratingsCount || 0}</div>
              <div className="stat-label">Movies Rated</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{profileData?.averageRatingGiven || '0.0'}★</div>
              <div className="stat-label">Avg Rating Given</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{profileData?.watchlistCount || 0}</div>
              <div className="stat-label">Watchlist Saved</div>
            </div>
          </div>

          {/* AI Taste Calibration Form */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sliders size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Taste Preferences Calibration</h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              Update your favorite genres to tune the AI recommendation algorithm vectors:
            </p>

            <form onSubmit={handleSaveGenres} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                style={{ flex: 1 }}
                value={favoriteGenres}
                onChange={(e) => setFavoriteGenres(e.target.value)}
                placeholder="e.g. Sci-Fi, Action, Animation, Drama"
              />
              <button type="submit" className="btn-primary" disabled={updatingGenres}>
                {savedSuccess ? <Check size={16} /> : null}
                {updatingGenres ? 'Updating...' : savedSuccess ? 'Updated!' : 'Recalibrate AI'}
              </button>
            </form>
          </div>

          {/* Genre Distribution Breakdown */}
          {profileData?.genreDistribution && Object.keys(profileData.genreDistribution).length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                Your Taste Profile by Genre Activity
              </h4>
              <div>
                {Object.entries(profileData.genreDistribution).map(([genre, count]) => {
                  const maxCount = Math.max(...Object.values(profileData.genreDistribution));
                  const percentage = Math.round((count / maxCount) * 100);
                  return (
                    <div key={genre} className="genre-bar-item">
                      <span className="genre-bar-label">{genre}</span>
                      <div className="genre-bar-outer">
                        <div className="genre-bar-inner" style={{ width: `${percentage}%` }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', width: '30px', textAlign: 'right' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rated Movies List */}
          {profileData?.recentRatings && profileData.recentRatings.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                Your Recent Ratings
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {profileData.recentRatings.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.6rem 0.9rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fff' }}>{r.movie?.title}</strong>
                      {r.review && <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>— "{r.review}"</span>}
                    </div>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                      ★ {r.ratingValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
