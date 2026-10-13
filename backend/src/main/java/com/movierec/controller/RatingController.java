package com.movierec.controller;

import com.movierec.dto.RatingRequest;
import com.movierec.entity.Rating;
import com.movierec.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> rateMovie(@Valid @RequestBody RatingRequest request) {
        Rating rating = ratingService.rateMovie(request);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsByUser(userId));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Rating>> getRatingsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(ratingService.getRatingsByMovie(movieId));
    }

    @GetMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<Rating> getUserMovieRating(@PathVariable Long userId, @PathVariable Long movieId) {
        return ratingService.getUserMovieRating(userId, movieId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
