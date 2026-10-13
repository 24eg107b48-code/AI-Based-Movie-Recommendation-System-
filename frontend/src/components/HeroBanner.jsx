import React from 'react';
import { Play, Info, Heart, Star, Sparkles } from 'lucide-react';

export default function HeroBanner({
  movie,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist,
}) {
  if (!movie) return null;

  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(${movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'})`,
      }}
    >
      <div className="hero-backdrop" />
      <div className="hero-content">
        <div className="hero-ai-badge">
          <Sparkles size={14} />
          <span>Top AI Recommendation · 98% Match</span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <span className="rating-badge">
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            {movie.averageRating || movie.imdbRating || '8.8'} / 10
          </span>
          <span>{movie.releaseYear}</span>
          <span>{movie.durationMinutes} mins</span>
          <span style={{ color: '#38bdf8' }}>{movie.genres}</span>
        </div>

        <p className="hero-description">{movie.description}</p>

        <div className="hero-buttons">
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
          <button className="btn-secondary" onClick={() => onOpenDetails(movie)}>
            <Info size={16} /> Movie Details
          </button>
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
            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
