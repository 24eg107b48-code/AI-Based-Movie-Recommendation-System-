package com.movierec.dto;

import com.movierec.entity.Movie;

public class RecommendationResponse {
    private Movie movie;
    private double matchScore; // e.g. 94.5 (%)
    private String algorithm;
    private String explanation;

    public RecommendationResponse() {}

    public RecommendationResponse(Movie movie, double matchScore, String algorithm, String explanation) {
        this.movie = movie;
        this.matchScore = matchScore;
        this.algorithm = algorithm;
        this.explanation = explanation;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
