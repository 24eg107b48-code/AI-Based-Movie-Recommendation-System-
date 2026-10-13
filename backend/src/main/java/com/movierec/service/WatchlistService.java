package com.movierec.service;

import com.movierec.entity.Movie;
import com.movierec.entity.User;
import com.movierec.entity.WatchlistItem;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.UserRepository;
import com.movierec.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public WatchlistService(WatchlistRepository watchlistRepository,
                            UserRepository userRepository,
                            MovieRepository movieRepository) {
        this.watchlistRepository = watchlistRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    @Transactional
    public WatchlistItem toggleWatchlist(Long userId, Long movieId) {
        Optional<WatchlistItem> existing = watchlistRepository.findByUserIdAndMovieId(userId, movieId);
        if (existing.isPresent()) {
            watchlistRepository.delete(existing.get());
            return null; // indicates removed
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            Movie movie = movieRepository.findById(movieId)
                    .orElseThrow(() -> new RuntimeException("Movie not found: " + movieId));
            WatchlistItem item = new WatchlistItem(user, movie, false);
            return watchlistRepository.save(item);
        }
    }

    @Transactional
    public WatchlistItem toggleFavorite(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found: " + movieId));

        Optional<WatchlistItem> existing = watchlistRepository.findByUserIdAndMovieId(userId, movieId);
        WatchlistItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setIsFavorite(!Boolean.TRUE.equals(item.getIsFavorite()));
        } else {
            item = new WatchlistItem(user, movie, true);
        }
        return watchlistRepository.save(item);
    }

    public List<WatchlistItem> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId);
    }

    public List<WatchlistItem> getUserFavorites(Long userId) {
        return watchlistRepository.findByUserIdAndIsFavoriteTrue(userId);
    }

    public boolean isMovieInWatchlist(Long userId, Long movieId) {
        return watchlistRepository.existsByUserIdAndMovieId(userId, movieId);
    }
}
