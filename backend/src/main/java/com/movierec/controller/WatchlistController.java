package com.movierec.controller;

import com.movierec.entity.WatchlistItem;
import com.movierec.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWatchlist(@RequestParam Long userId, @RequestParam Long movieId) {
        WatchlistItem item = watchlistService.toggleWatchlist(userId, movieId);
        boolean saved = item != null;
        return ResponseEntity.ok(Map.of("inWatchlist", saved, "message", saved ? "Added to Watchlist" : "Removed from Watchlist"));
    }

    @PostMapping("/favorite")
    public ResponseEntity<?> toggleFavorite(@RequestParam Long userId, @RequestParam Long movieId) {
        WatchlistItem item = watchlistService.toggleFavorite(userId, movieId);
        return ResponseEntity.ok(Map.of("isFavorite", item.getIsFavorite(), "message", item.getIsFavorite() ? "Added to Favorites" : "Removed from Favorites"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WatchlistItem>> getUserWatchlist(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getUserWatchlist(userId));
    }

    @GetMapping("/favorites/{userId}")
    public ResponseEntity<List<WatchlistItem>> getUserFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getUserFavorites(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkWatchlist(@RequestParam Long userId, @RequestParam Long movieId) {
        boolean inWatchlist = watchlistService.isMovieInWatchlist(userId, movieId);
        return ResponseEntity.ok(Collections.singletonMap("inWatchlist", inWatchlist));
    }
}
