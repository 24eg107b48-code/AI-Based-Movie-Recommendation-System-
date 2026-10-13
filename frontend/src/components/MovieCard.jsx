import React, { useState } from 'react';
import { Star, Heart, Sparkles, Play } from 'lucide-react';

export default function MovieCard({
  movie,
  matchScore,
  explanation,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
  onRateMovie,
  userRating,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  if (!movie) return null;

  const handleStarClick = (e, star) => {
    e.stopPropagation();
    onRateMovie(movie.id, star);
  };

  const currentScore = userRating || 0;

  return (
    <div className="movie-card">
      <div className="card-poster-wrap" onClick={() => onOpenDetails(movie)}>
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'}
          alt={movie.title}
          className="card-poster"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
        />

        <div className="card-overlay">
          <div className="card-top-badges">
            {matchScore ? (
              <span className={`ai-match-badge ${matchScore >= 85 ? 'high' : ''}`}>
                <Sparkles size={12} /> {Math.round(matchScore)}% Match
              </span>
            ) : (
              <span />
            )}

            <button
              className={`btn-watchlist-icon ${isInWatchlist ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie.id);
              }}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Heart
                size={16}
                fill={isInWatchlist ? '#f43f5e' : 'none'}
                color={isInWatchlist ? '#f43f5e' : 'white'}
              />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Play size={10} fill="white" /> Details
            </span>
          </div>
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title" onClick={() => onOpenDetails(movie)} title={movie.title}>
          {movie.title}
        </h3>

        <div className="card-sub">
          <span>{movie.releaseYear || '2024'}</span>
          <span>{movie.durationMinutes ? `${movie.durationMinutes}m` : '120m'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24' }}>
            <Star size={12} fill="#fbbf24" />
            {movie.averageRating || movie.imdbRating || '8.0'}
          </span>
        </div>

        <p className="card-genres" title={movie.genres}>
          {movie.genres}
        </p>

        {explanation && (
          <div className="card-reason" title={explanation}>
            {explanation}
          </div>
        )}

        {/* Interactive Quick Star Rating */}
        <div className="card-rating-bar">
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            {userRating ? `Your: ${userRating}★` : 'Rate:'}
          </span>
          <div
            className="stars-interactive"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hoverRating || currentScore) >= star ? 'active' : ''}`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={(e) => handleStarClick(e, star)}
                title={`Rate ${star} stars`}
              >
                <Star
                  size={14}
                  fill={(hoverRating || currentScore) >= star ? '#fbbf24' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
