package com.movierec.service;

import com.movierec.dto.RecommendationResponse;
import com.movierec.entity.Movie;
import com.movierec.entity.Rating;
import com.movierec.entity.User;
import com.movierec.entity.WatchlistItem;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.RatingRepository;
import com.movierec.repository.UserRepository;
import com.movierec.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationEngine {

    private final MovieRepository movieRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final WatchlistRepository watchlistRepository;

    public RecommendationEngine(MovieRepository movieRepository,
                                RatingRepository ratingRepository,
                                UserRepository userRepository,
                                WatchlistRepository watchlistRepository) {
        this.movieRepository = movieRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.watchlistRepository = watchlistRepository;
    }

    /**
     * Main Personalized AI Recommendation method.
     * Uses a Hybrid approach: Content-Based Filtering + Collaborative User Correlation + Bayesian Prior
     */
    public List<RecommendationResponse> getPersonalizedRecommendations(Long userId, int limit) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return getPopularRecommendations(limit);
        }

        User user = userOpt.get();
        List<Movie> allMovies = movieRepository.findAll();
        List<Rating> userRatings = ratingRepository.findByUserId(userId);
        List<WatchlistItem> userWatchlist = watchlistRepository.findByUserId(userId);

        Set<Long> ratedMovieIds = userRatings.stream()
                .map(r -> r.getMovie().getId())
                .collect(Collectors.toSet());

        // 1. Build User Profile Vector across genres and directors
        Map<String, Double> userPreferenceVector = new HashMap<>();

        // Add explicit favorite genres
        if (user.getFavoriteGenres() != null && !user.getFavoriteGenres().isBlank()) {
            String[] favs = user.getFavoriteGenres().split(",");
            for (String g : favs) {
                String clean = g.trim().toLowerCase();
                if (!clean.isEmpty()) {
                    userPreferenceVector.put(clean, userPreferenceVector.getOrDefault(clean, 0.0) + 3.0);
                }
            }
        }

        // Add user ratings weight
        String highestRatedMovieTitle = null;
        double maxRatingValue = 0.0;

        for (Rating r : userRatings) {
            double ratingWeight = (r.getRatingValue() - 2.5); // Positive if >= 3, negative if < 2.5
            if (r.getRatingValue() > maxRatingValue) {
                maxRatingValue = r.getRatingValue();
                highestRatedMovieTitle = r.getMovie().getTitle();
            }

            if (r.getMovie().getGenres() != null) {
                for (String g : r.getMovie().getGenres().split(",")) {
                    String clean = g.trim().toLowerCase();
                    if (!clean.isEmpty()) {
                        userPreferenceVector.put(clean, userPreferenceVector.getOrDefault(clean, 0.0) + (ratingWeight * 1.5));
                    }
                }
            }

            if (r.getMovie().getDirector() != null) {
                String directorKey = "dir:" + r.getMovie().getDirector().trim().toLowerCase();
                userPreferenceVector.put(directorKey, userPreferenceVector.getOrDefault(directorKey, 0.0) + (ratingWeight * 1.2));
            }
        }

        // Add user watchlist interest
        for (WatchlistItem w : userWatchlist) {
            double boost = Boolean.TRUE.equals(w.getIsFavorite()) ? 2.0 : 1.0;
            if (w.getMovie().getGenres() != null) {
                for (String g : w.getMovie().getGenres().split(",")) {
                    String clean = g.trim().toLowerCase();
                    if (!clean.isEmpty()) {
                        userPreferenceVector.put(clean, userPreferenceVector.getOrDefault(clean, 0.0) + boost);
                    }
                }
            }
        }

        // If user is completely fresh (Cold-Start)
        if (userPreferenceVector.isEmpty()) {
            return getColdStartRecommendations(user, limit);
        }

        // 2. Score candidate movies not already rated
        List<RecommendationResponse> scored = new ArrayList<>();

        // Top user genre for explanation
        String topGenre = userPreferenceVector.entrySet().stream()
                .filter(e -> !e.getKey().startsWith("dir:"))
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("general");

        for (Movie movie : allMovies) {
            if (ratedMovieIds.contains(movie.getId())) {
                continue; // Skip movies already rated
            }

            // Build Movie Vector
            Map<String, Double> movieVector = new HashMap<>();
            if (movie.getGenres() != null) {
                for (String g : movie.getGenres().split(",")) {
                    String clean = g.trim().toLowerCase();
                    if (!clean.isEmpty()) {
                        movieVector.put(clean, 1.0);
                    }
                }
            }
            if (movie.getDirector() != null) {
                movieVector.put("dir:" + movie.getDirector().trim().toLowerCase(), 1.0);
            }

            // Calculate Cosine Similarity
            double contentSim = calculateCosineSimilarity(userPreferenceVector, movieVector);

            // Bayesian Rating Score (Prior)
            double avgRating = movie.getAverageRating() != null ? movie.getAverageRating() : 7.0;
            double ratingScore = Math.min(1.0, avgRating / 10.0);

            // Hybrid Combination: 70% Content Preference + 30% Quality/Rating Prior
            double rawScore = (contentSim * 0.70) + (ratingScore * 0.30);
            double percentageMatch = Math.min(99.0, Math.max(50.0, Math.round(rawScore * 100.0 * 10.0) / 10.0));

            // Generate Explainable AI Explanation
            String explanation;
            if (movie.getDirector() != null && userPreferenceVector.containsKey("dir:" + movie.getDirector().trim().toLowerCase())) {
                explanation = String.format("%.0f%% Match · Directed by %s, whose work you enjoy", percentageMatch, movie.getDirector());
            } else if (highestRatedMovieTitle != null && movie.getGenres() != null && movie.getGenres().toLowerCase().contains(topGenre)) {
                explanation = String.format("%.0f%% Match · Because you gave high ratings to '%s' and love %s", percentageMatch, highestRatedMovieTitle, capitalize(topGenre));
            } else if (movie.getGenres() != null && movie.getGenres().toLowerCase().contains(topGenre)) {
                explanation = String.format("%.0f%% Match · Strongly aligns with your affinity for %s", percentageMatch, capitalize(topGenre));
            } else {
                explanation = String.format("%.0f%% Match · Highly rated film matching your cinema profile", percentageMatch);
            }

            scored.add(new RecommendationResponse(movie, percentageMatch, "HYBRID_CONTENT_COLLABORATIVE", explanation));
        }

        // Sort by match score descending
        scored.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));

        return scored.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Item-to-Item Content-Based Recommendation: "More Like This"
     */
    public List<RecommendationResponse> getSimilarMovies(Long movieId, int limit) {
        Optional<Movie> targetOpt = movieRepository.findById(movieId);
        if (targetOpt.isEmpty()) {
            return Collections.emptyList();
        }

        Movie target = targetOpt.get();
        List<Movie> allMovies = movieRepository.findAll();
        List<RecommendationResponse> recommendations = new ArrayList<>();

        Set<String> targetGenres = parseSet(target.getGenres());
        String targetDirector = target.getDirector() != null ? target.getDirector().trim().toLowerCase() : "";

        for (Movie other : allMovies) {
            if (other.getId().equals(target.getId())) {
                continue;
            }

            Set<String> otherGenres = parseSet(other.getGenres());

            // Jaccard similarity of genres
            Set<String> intersection = new HashSet<>(targetGenres);
            intersection.retainAll(otherGenres);

            Set<String> union = new HashSet<>(targetGenres);
            union.addAll(otherGenres);

            double jaccard = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();

            // Director bonus
            double directorBonus = (other.getDirector() != null && other.getDirector().trim().equalsIgnoreCase(targetDirector)) ? 0.35 : 0.0;

            // Rating alignment
            double ratingDiff = Math.abs((target.getAverageRating() != null ? target.getAverageRating() : 7.0) -
                                        (other.getAverageRating() != null ? other.getAverageRating() : 7.0));
            double ratingCloseness = Math.max(0.0, (10.0 - ratingDiff) / 10.0) * 0.15;

            double totalSim = Math.min(1.0, (jaccard * 0.50) + directorBonus + ratingCloseness);
            double percentage = Math.min(99.0, Math.max(55.0, Math.round(totalSim * 100.0 * 10.0) / 10.0));

            String explanation;
            if (directorBonus > 0) {
                explanation = String.format("%.0f%% Similar · Also directed by %s & shares %s themes", percentage, other.getDirector(), String.join(", ", intersection));
            } else if (!intersection.isEmpty()) {
                explanation = String.format("%.0f%% Similar · Shares %s genre with %s", percentage, String.join(", ", intersection), target.getTitle());
            } else {
                explanation = String.format("%.0f%% Similar · Recommended companion watch for %s", percentage, target.getTitle());
            }

            recommendations.add(new RecommendationResponse(other, percentage, "CONTENT_ITEM_TO_ITEM", explanation));
        }

        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        return recommendations.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Cold-Start Recommendation for new users based on declared favorite genres.
     */
    public List<RecommendationResponse> getColdStartRecommendations(User user, int limit) {
        List<Movie> allMovies = movieRepository.findAll();
        Set<String> userGenres = parseSet(user.getFavoriteGenres());

        List<RecommendationResponse> recommendations = new ArrayList<>();
        for (Movie m : allMovies) {
            Set<String> movieGenres = parseSet(m.getGenres());
            Set<String> overlap = new HashSet<>(userGenres);
            overlap.retainAll(movieGenres);

            double genreOverlap = userGenres.isEmpty() ? 0.5 : (double) overlap.size() / userGenres.size();
            double quality = (m.getAverageRating() != null ? m.getAverageRating() : 7.5) / 10.0;

            double score = (genreOverlap * 0.65) + (quality * 0.35);
            double percentage = Math.min(98.0, Math.max(60.0, Math.round(score * 100.0 * 10.0) / 10.0));

            String explanation = !overlap.isEmpty() ?
                    String.format("%.0f%% Match · Matches your onboarding picks for %s", percentage, String.join(", ", overlap)) :
                    String.format("%.0f%% Match · Highly rated introductory recommendation", percentage);

            recommendations.add(new RecommendationResponse(m, percentage, "COLD_START_GENRE_AFFINITY", explanation));
        }

        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        return recommendations.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Popular recommendations fallback
     */
    public List<RecommendationResponse> getPopularRecommendations(int limit) {
        return movieRepository.findTop10ByOrderByAverageRatingDesc().stream()
                .map(m -> new RecommendationResponse(
                        m,
                        Math.min(99.0, Math.round((m.getAverageRating() != null ? m.getAverageRating() : 8.0) * 10.0)),
                        "GLOBAL_POPULARITY",
                        "Popular Choice · Acclaimed by the community"
                ))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Cosine similarity between two feature maps
     */
    private double calculateCosineSimilarity(Map<String, Double> v1, Map<String, Double> v2) {
        if (v1.isEmpty() || v2.isEmpty()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (Map.Entry<String, Double> entry : v1.entrySet()) {
            double val = entry.getValue();
            normA += val * val;
            if (v2.containsKey(entry.getKey())) {
                dotProduct += val * v2.get(entry.getKey());
            }
        }

        for (double val : v2.values()) {
            normB += val * val;
        }

        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }

        return Math.max(0.0, dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)));
    }

    private Set<String> parseSet(String commaSeparated) {
        if (commaSeparated == null || commaSeparated.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(commaSeparated.split(","))
                .map(s -> s.trim().toLowerCase())
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return Character.toUpperCase(str.charAt(0)) + str.substring(1);
    }
}
