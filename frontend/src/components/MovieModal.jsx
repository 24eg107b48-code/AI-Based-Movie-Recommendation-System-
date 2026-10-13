import React, { useState, useEffect } from 'react';
import { X, Star, Heart, Play, Sparkles, Send } from 'lucide-react';
import movieApi from '../api/movieApi';

export default function MovieModal({
  movie,
  onClose,
  currentUser,
  onToggleWatchlist,
  isInWatchlist,
  onRateMovie,
  userRating,
  onSelectMovie,
}) {
  const [selectedRating, setSelectedRating] = useState(userRating || 5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [movieReviews, setMovieReviews] = useState([]);

  useEffect(() => {
    if (movie) {
      setSelectedRating(userRating || 5);
      fetchSimilarMovies(movie.id);
      fetchReviews(movie.id);
    }
  }, [movie, userRating]);

  const fetchSimilarMovies = async (movieId) => {
    setLoadingSimilar(true);
    try {
      const res = await movieApi.getSimilarMovies(movieId, 4);
      setSimilarMovies(res.data);
    } catch (err) {
      console.error('Error fetching similar movies:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const fetchReviews = async (movieId) => {
    try {
      const res = await movieApi.getMovieRatings(movieId);
      setMovieReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to rate and review movies.');
      return;
    }
    setSubmittingRating(true);
    try {
      await onRateMovie(movie.id, selectedRating, reviewText);
      setReviewText('');
      fetchReviews(movie.id);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div
          className="modal-hero"
          style={{
            backgroundImage: `url(${movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1000&q=80'})`,
          }}
        >
          <div className="modal-hero-details">
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              {movie.title}
            </h2>
            <div style={{ display: 'flex', gap: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <span>{movie.releaseYear}</span>
              <span>{movie.durationMinutes} mins</span>
              <span style={{ color: '#38bdf8' }}>{movie.genres}</span>
              <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={14} fill="#fbbf24" /> {movie.averageRating || movie.imdbRating || '8.0'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Actions Bar */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Play size={16} fill="white" /> Watch Trailer
              </a>
            )}
            <button
              className={`btn-secondary ${isInWatchlist ? 'btn-watchlist-active' : ''}`}
              onClick={() => onToggleWatchlist(movie.id)}
              style={{
                color: isInWatchlist ? '#f43f5e' : 'inherit',
                borderColor: isInWatchlist ? '#f43f5e' : undefined,
              }}
            >
              <Heart
                size={16}
                fill={isInWatchlist ? '#f43f5e' : 'none'}
                color={isInWatchlist ? '#f43f5e' : 'currentColor'}
              />
              {isInWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}
            </button>
          </div>

          {/* Storyline & Info */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Storyline
            </h4>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {movie.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Director:</span>
              <p style={{ fontWeight: 600, color: '#f8fafc' }}>{movie.director || 'N/A'}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Key Cast:</span>
              <p style={{ fontWeight: 600, color: '#f8fafc' }}>{movie.cast || 'N/A'}</p>
            </div>
          </div>

          {/* Rate & Review Form */}
          <div className="rating-section-box">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" /> Your Rating &amp; Review
            </h4>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Select Stars:</span>
                <div className="stars-interactive">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${selectedRating >= star ? 'active' : ''}`}
                      onClick={() => setSelectedRating(star)}
                    >
                      <Star size={20} fill={selectedRating >= star ? '#fbbf24' : 'none'} />
                    </button>
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: '#fbbf24', marginLeft: '0.5rem' }}>
                  {selectedRating} / 5
                </span>
              </div>

              <textarea
                className="review-input"
                placeholder="Write your feedback or reaction to this movie (optional)..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submittingRating}
                  style={{ padding: '0.45rem 1rem' }}
                >
                  <Send size={14} /> {submittingRating ? 'Saving...' : 'Submit Rating'}
                </button>
              </div>
            </form>

            {/* Existing User Reviews */}
            {movieReviews.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  Community Reviews ({movieReviews.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {movieReviews.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                        <span style={{ fontWeight: 600 }}>{r.user ? r.user.fullName || r.user.username : 'User'}</span>
                        <span style={{ color: '#fbbf24' }}>★ {r.ratingValue}</span>
                      </div>
                      {r.review && <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>{r.review}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI "More Like This" Shelf */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} color="#38bdf8" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI Recommendations: More Like This</h4>
            </div>

            {loadingSimilar ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Analyzing similarity attributes...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {similarMovies.map((item) => (
                  <div
                    key={item.movie.id}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onClick={() => onSelectMovie(item.movie)}
                  >
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '0.5rem' }}>
                      <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                        {Math.round(item.matchScore)}% Similar
                      </span>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.movie.title}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
