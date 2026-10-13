package com.movierec.controller;

import com.movierec.dto.RecommendationResponse;
import com.movierec.service.RecommendationEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationEngine recommendationEngine;

    public RecommendationController(RecommendationEngine recommendationEngine) {
        this.recommendationEngine = recommendationEngine;
    }

    @GetMapping("/personalized/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getPersonalizedRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<RecommendationResponse> recommendations = recommendationEngine.getPersonalizedRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/similar/{movieId}")
    public ResponseEntity<List<RecommendationResponse>> getSimilarMovies(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "6") int limit) {
        List<RecommendationResponse> similar = recommendationEngine.getSimilarMovies(movieId, limit);
        return ResponseEntity.ok(similar);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<RecommendationResponse>> getPopularRecommendations(
            @RequestParam(defaultValue = "10") int limit) {
        List<RecommendationResponse> popular = recommendationEngine.getPopularRecommendations(limit);
        return ResponseEntity.ok(popular);
    }
}
