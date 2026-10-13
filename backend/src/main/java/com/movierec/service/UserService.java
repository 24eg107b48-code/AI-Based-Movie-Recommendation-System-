package com.movierec.service;

import com.movierec.dto.AuthResponse;
import com.movierec.dto.LoginRequest;
import com.movierec.dto.RegisterRequest;
import com.movierec.dto.UserProfileDto;
import com.movierec.entity.Rating;
import com.movierec.entity.User;
import com.movierec.entity.WatchlistItem;
import com.movierec.repository.RatingRepository;
import com.movierec.repository.UserRepository;
import com.movierec.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final WatchlistRepository watchlistRepository;

    public UserService(UserRepository userRepository,
                       RatingRepository ratingRepository,
                       WatchlistRepository watchlistRepository) {
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
        this.watchlistRepository = watchlistRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.error("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.error("Email already in use: " + request.getEmail());
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(), // In production use BCryptPasswordEncoder
                request.getFullName() != null ? request.getFullName() : request.getUsername(),
                request.getFavoriteGenres() != null ? request.getFavoriteGenres() : "Action, Sci-Fi"
        );

        User saved = userRepository.save(user);
        return new AuthResponse(
                true,
                "User registered successfully",
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getFavoriteGenres()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsername());
        }

        if (userOpt.isEmpty()) {
            return AuthResponse.error("User not found with identifier: " + request.getUsername());
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return AuthResponse.error("Invalid password");
        }

        return new AuthResponse(
                true,
                "Login successful",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getFavoriteGenres()
        );
    }

    public User updateFavoriteGenres(Long userId, String favoriteGenres) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setFavoriteGenres(favoriteGenres);
        return userRepository.save(user);
    }

    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Rating> ratings = ratingRepository.findByUserId(userId);
        List<WatchlistItem> watchlist = watchlistRepository.findByUserId(userId);

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setFavoriteGenres(user.getFavoriteGenres());
        dto.setRatingsCount(ratings.size());

        double avgRating = ratings.isEmpty() ? 0.0 :
                ratings.stream().mapToDouble(Rating::getRatingValue).average().orElse(0.0);
        dto.setAverageRatingGiven(Math.round(avgRating * 100.0) / 100.0);
        dto.setWatchlistCount(watchlist.size());
        dto.setRecentRatings(ratings);
        dto.setWatchlist(watchlist);

        // Compute genre distribution from user's rated movies
        Map<String, Long> genreDistribution = new HashMap<>();
        for (Rating r : ratings) {
            if (r.getMovie() != null && r.getMovie().getGenres() != null) {
                String[] genres = r.getMovie().getGenres().split(",");
                for (String g : genres) {
                    String clean = g.trim();
                    if (!clean.isEmpty()) {
                        genreDistribution.put(clean, genreDistribution.getOrDefault(clean, 0L) + 1);
                    }
                }
            }
        }
        dto.setGenreDistribution(genreDistribution);

        return dto;
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }
}
