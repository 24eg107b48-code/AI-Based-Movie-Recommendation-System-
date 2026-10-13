package com.movierec.service;

import com.movierec.dto.RatingRequest;
import com.movierec.entity.Movie;
import com.movierec.entity.Rating;
import com.movierec.entity.User;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.RatingRepository;
import com.movierec.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository,
                         MovieRepository movieRepository,
                         UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Rating rateMovie(RatingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found: " + request.getMovieId()));

        Optional<Rating> existing = ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId());
        Rating rating;

        if (existing.isPresent()) {
            rating = existing.get();
            rating.setRatingValue(request.getRating());
            rating.setReview(request.getReview());
            rating.setRatedAt(LocalDateTime.now());
        } else {
            rating = new Rating(user, movie, request.getRating(), request.getReview());
        }

        Rating savedRating = ratingRepository.save(rating);

        // Recalculate movie's average rating and count
        List<Rating> allMovieRatings = ratingRepository.findByMovieId(movie.getId());
        double sum = allMovieRatings.stream().mapToDouble(Rating::getRatingValue).sum();
        int count = allMovieRatings.size();
        double avg = Math.round((sum / count) * 10.0) / 10.0;

        movie.setAverageRating(avg);
        movie.setRatingCount(count);
        movieRepository.save(movie);

        return savedRating;
    }

    public List<Rating> getRatingsByUser(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    public List<Rating> getRatingsByMovie(Long movieId) {
        return ratingRepository.findByMovieId(movieId);
    }

    public Optional<Rating> getUserMovieRating(Long userId, Long movieId) {
        return ratingRepository.findByUserIdAndMovieId(userId, movieId);
    }
}
