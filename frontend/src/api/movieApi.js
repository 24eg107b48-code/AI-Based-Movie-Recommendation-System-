import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  // Movie endpoints
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  searchMovies: (query) => api.get(`/movies/search`, { params: { query } }),
  getMoviesByGenre: (genre) => api.get(`/movies/genre/${encodeURIComponent(genre)}`),
  getAllGenres: () => api.get('/movies/genres'),
  getTopRatedMovies: () => api.get('/movies/top-rated'),
  getTrendingMovies: () => api.get('/movies/trending'),

  // AI Recommendation endpoints
  getPersonalizedRecommendations: (userId, limit = 12) =>
    api.get(`/recommendations/personalized/${userId}`, { params: { limit } }),
  getSimilarMovies: (movieId, limit = 6) =>
    api.get(`/recommendations/similar/${movieId}`, { params: { limit } }),
  getPopularRecommendations: (limit = 10) =>
    api.get('/recommendations/popular', { params: { limit } }),

  // Auth & Profile
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUserProfile: (userId) => api.get(`/auth/profile/${userId}`),
  updateFavoriteGenres: (userId, favoriteGenres) =>
    api.put(`/auth/profile/${userId}/genres`, { favoriteGenres }),

  // Ratings
  rateMovie: (ratingData) => api.post('/ratings', ratingData),
  getUserRatings: (userId) => api.get(`/ratings/user/${userId}`),
  getMovieRatings: (movieId) => api.get(`/ratings/movie/${movieId}`),
  getUserMovieRating: (userId, movieId) =>
    api.get(`/ratings/user/${userId}/movie/${movieId}`),

  // Watchlist & Favorites
  toggleWatchlist: (userId, movieId) =>
    api.post('/watchlist/toggle', null, { params: { userId, movieId } }),
  toggleFavorite: (userId, movieId) =>
    api.post('/watchlist/favorite', null, { params: { userId, movieId } }),
  getUserWatchlist: (userId) => api.get(`/watchlist/user/${userId}`),
  getUserFavorites: (userId) => api.get(`/watchlist/favorites/${userId}`),
  checkWatchlist: (userId, movieId) =>
    api.get('/watchlist/check', { params: { userId, movieId } }),
};

export default movieApi;
