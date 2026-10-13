import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import GenreFilter from './components/GenreFilter';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Toast from './components/Toast';
import movieApi from './api/movieApi';
import { Sparkles, TrendingUp, Trophy, Heart, Film } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cineai_user');
    return saved
      ? JSON.parse(saved)
      : {
          userId: 1,
          username: 'alex',
          fullName: 'Alex Mercer',
          email: 'alex@example.com',
          favoriteGenres: 'Sci-Fi, Action, Thriller',
        };
  });

  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [userRatingsMap, setUserRatingsMap] = useState({});

  const [activeTab, setActiveTab] = useState('discover');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieModal, setSelectedMovieModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all movies
      const moviesRes = await movieApi.getAllMovies();
      setMovies(moviesRes.data);

      // 2. Fetch top rated and trending
      const [topRes, trendRes] = await Promise.all([
        movieApi.getTopRatedMovies(),
        movieApi.getTrendingMovies(),
      ]);
      setTopRated(topRes.data);
      setTrending(trendRes.data);

      // 3. If user is logged in, fetch recommendations, watchlist, and ratings
      const uid = currentUser?.userId || currentUser?.id;
      if (uid) {
        try {
          const [recRes, watchRes, ratRes] = await Promise.all([
            movieApi.getPersonalizedRecommendations(uid, 12),
            movieApi.getUserWatchlist(uid),
            movieApi.getUserRatings(uid),
          ]);
          setRecommendations(recRes.data);

          const wIds = new Set(watchRes.data.map((item) => item.movie.id));
          setWatchlistIds(wIds);

          const rMap = {};
          ratRes.data.forEach((r) => {
            rMap[r.movie.id] = r.ratingValue;
          });
          setUserRatingsMap(rMap);
        } catch (e) {
          console.warn('Could not load personalized user data:', e);
        }
      } else {
        const popRes = await movieApi.getPopularRecommendations(10);
        setRecommendations(popRes.data);
      }
    } catch (err) {
      console.error('Error fetching initial movie catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recalculate AI Recommendations
  const refreshRecommendations = async () => {
    const uid = currentUser?.userId || currentUser?.id;
    if (uid) {
      try {
        const res = await movieApi.getPersonalizedRecommendations(uid, 12);
        setRecommendations(res.data);
      } catch (e) {
        console.error('Error refreshing recommendations:', e);
      }
    }
  };

  // Rate Movie Handler
  const handleRateMovie = async (movieId, ratingValue, review = '') => {
    const uid = currentUser?.userId || currentUser?.id;
    if (!uid) {
      setShowAuthModal(true);
      return;
    }

    try {
      await movieApi.rateMovie({
        userId: uid,
        movieId,
        rating: ratingValue,
        review,
      });

      setUserRatingsMap((prev) => ({ ...prev, [movieId]: ratingValue }));
      showToast(`Rated ${ratingValue}★! Recalibrating AI recommendations...`);
      // Instant recommendation recalculation based on new rating
      refreshRecommendations();
    } catch (err) {
      console.error('Error rating movie:', err);
      showToast('Error saving rating.');
    }
  };

  // Toggle Watchlist Handler
  const handleToggleWatchlist = async (movieId) => {
    const uid = currentUser?.userId || currentUser?.id;
    if (!uid) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await movieApi.toggleWatchlist(uid, movieId);
      setWatchlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(movieId)) {
          next.delete(movieId);
          showToast('Removed from Watchlist');
        } else {
          next.add(movieId);
          showToast('Added to Watchlist');
        }
        return next;
      });
      refreshRecommendations();
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  // Filtered Movies based on Genre & Search
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.genres && m.genres.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.cast && m.cast.toLowerCase().includes(q))
      );
    }

    if (selectedGenre !== 'All') {
      result = result.filter(
        (m) => m.genres && m.genres.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    return result;
  }, [movies, searchQuery, selectedGenre]);

  // Featured hero movie
  const featuredMovie = useMemo(() => {
    if (recommendations.length > 0 && recommendations[0].movie) {
      return recommendations[0].movie;
    }
    return movies.length > 0 ? movies[0] : null;
  }, [recommendations, movies]);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('cineai_user', JSON.stringify(userData));
    setCurrentUser(userData);
    showToast(`Welcome back, ${userData.fullName || userData.username}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('cineai_user');
    setCurrentUser(null);
    setWatchlistIds(new Set());
    setUserRatingsMap({});
    setShowProfileModal(false);
    showToast('Signed out successfully');
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        watchlistCount={watchlistIds.size}
      />

      {/* Hero Banner (Shown on Discover & AI tabs when not searching) */}
      {!searchQuery && (activeTab === 'discover' || activeTab === 'ai') && featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onOpenDetails={(m) => setSelectedMovieModal(m)}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={watchlistIds.has(featuredMovie.id)}
        />
      )}

      <main className="main-content">
        {/* Genre Filter Bar */}
        <GenreFilter
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />

        {/* 1. DISCOVER TAB */}
        {activeTab === 'discover' && (
          <>
            {/* AI Personalized Recommendations Shelf */}
            {recommendations.length > 0 && !searchQuery && (
              <section>
                <div className="section-header">
                  <div className="section-title-wrap">
                    <Sparkles size={22} color="#38bdf8" />
                    <h2 className="section-title">Recommended For You</h2>
                    <span className="ai-pill">Hybrid AI Engine</span>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Personalized based on your genres &amp; ratings
                  </span>
                </div>

                <div className="movie-grid">
                  {recommendations.slice(0, 6).map((rec) => (
                    <MovieCard
                      key={rec.movie.id}
                      movie={rec.movie}
                      matchScore={rec.matchScore}
                      explanation={rec.explanation}
                      onOpenDetails={(m) => setSelectedMovieModal(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={watchlistIds.has(rec.movie.id)}
                      onRateMovie={handleRateMovie}
                      userRating={userRatingsMap[rec.movie.id]}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Catalog / Filtered Movies */}
            <section>
              <div className="section-header">
                <div className="section-title-wrap">
                  <Film size={22} color="#6366f1" />
                  <h2 className="section-title">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : selectedGenre === 'All'
                      ? 'Explore All Movies'
                      : `${selectedGenre} Movies`}
                  </h2>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {filteredMovies.length} movies available
                </span>
              </div>

              {filteredMovies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <p>No movies found matching your filters.</p>
                </div>
              ) : (
                <div className="movie-grid">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onOpenDetails={(m) => setSelectedMovieModal(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={watchlistIds.has(movie.id)}
                      onRateMovie={handleRateMovie}
                      userRating={userRatingsMap[movie.id]}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* 2. AI PICKS TAB */}
        {activeTab === 'ai' && (
          <section>
            <div className="section-header">
              <div className="section-title-wrap">
                <Sparkles size={24} color="#38bdf8" />
                <h2 className="section-title">AI Personalized Recommendations</h2>
                <span className="ai-pill">Content &amp; Collaborative Filtering</span>
              </div>
              <button
                className="btn-secondary"
                onClick={refreshRecommendations}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
              >
                Recalculate AI Vectors
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '750px' }}>
              Our AI engine extracts multi-attribute vectors (genres, directors, plot traits) and combines them with your explicit favorites and rating history using cosine similarity to rank movies you'll love most.
            </p>

            <div className="movie-grid">
              {recommendations.map((rec) => (
                <MovieCard
                  key={rec.movie.id}
                  movie={rec.movie}
                  matchScore={rec.matchScore}
                  explanation={rec.explanation}
                  onOpenDetails={(m) => setSelectedMovieModal(m)}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={watchlistIds.has(rec.movie.id)}
                  onRateMovie={handleRateMovie}
                  userRating={userRatingsMap[rec.movie.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. TOP RATED TAB */}
        {activeTab === 'top-rated' && (
          <section>
            <div className="section-header">
              <div className="section-title-wrap">
                <Trophy size={24} color="#fbbf24" />
                <h2 className="section-title">Top Rated Masterpieces</h2>
              </div>
            </div>

            <div className="movie-grid">
              {topRated.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenDetails={(m) => setSelectedMovieModal(m)}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={watchlistIds.has(movie.id)}
                  onRateMovie={handleRateMovie}
                  userRating={userRatingsMap[movie.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. TRENDING TAB */}
        {activeTab === 'trending' && (
          <section>
            <div className="section-header">
              <div className="section-title-wrap">
                <TrendingUp size={24} color="#10b981" />
                <h2 className="section-title">Trending &amp; Recent Releases</h2>
              </div>
            </div>

            <div className="movie-grid">
              {trending.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenDetails={(m) => setSelectedMovieModal(m)}
                  onToggleWatchlist={handleToggleWatchlist}
                  isInWatchlist={watchlistIds.has(movie.id)}
                  onRateMovie={handleRateMovie}
                  userRating={userRatingsMap[movie.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. WATCHLIST TAB */}
        {activeTab === 'watchlist' && (
          <section>
            <div className="section-header">
              <div className="section-title-wrap">
                <Heart size={24} color="#f43f5e" />
                <h2 className="section-title">Your Watchlist &amp; Favorites</h2>
                <span className="ai-pill">{watchlistIds.size} Saved</span>
              </div>
            </div>

            {watchlistIds.size === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your watchlist is empty.</p>
                <p style={{ fontSize: '0.85rem' }}>Click the heart icon on any movie to save it here for later.</p>
              </div>
            ) : (
              <div className="movie-grid">
                {movies
                  .filter((m) => watchlistIds.has(m.id))
                  .map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onOpenDetails={(m) => setSelectedMovieModal(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={true}
                      onRateMovie={handleRateMovie}
                      userRating={userRatingsMap[movie.id]}
                    />
                  ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovieModal && (
        <MovieModal
          movie={selectedMovieModal}
          onClose={() => setSelectedMovieModal(null)}
          currentUser={currentUser}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={watchlistIds.has(selectedMovieModal.id)}
          onRateMovie={handleRateMovie}
          userRating={userRatingsMap[selectedMovieModal.id]}
          onSelectMovie={(m) => setSelectedMovieModal(m)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
          onProfileUpdated={(updated) => {
            setCurrentUser(updated);
            localStorage.setItem('cineai_user', JSON.stringify(updated));
            refreshRecommendations();
            showToast('AI Taste Profile recalibrated!');
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />

      {/* Footer */}
      <footer className="footer">
        <p>CineAI · AI-Based Movie Recommendation System</p>
        <p style={{ marginTop: '0.25rem', color: '#64748b' }}>
          Full-Stack Web Application: React + Spring Boot + MySQL + AI Recommendation Engine
        </p>
      </footer>
    </div>
  );
}
