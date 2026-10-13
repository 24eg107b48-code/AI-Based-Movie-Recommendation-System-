package com.movierec.dto;

import com.movierec.entity.Rating;
import com.movierec.entity.WatchlistItem;

import java.util.List;
import java.util.Map;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String favoriteGenres;
    private int ratingsCount;
    private double averageRatingGiven;
    private int watchlistCount;
    private Map<String, Long> genreDistribution;
    private List<Rating> recentRatings;
    private List<WatchlistItem> watchlist;

    public UserProfileDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFavoriteGenres() {
        return favoriteGenres;
    }

    public void setFavoriteGenres(String favoriteGenres) {
        this.favoriteGenres = favoriteGenres;
    }

    public int getRatingsCount() {
        return ratingsCount;
    }

    public void setRatingsCount(int ratingsCount) {
        this.ratingsCount = ratingsCount;
    }

    public double getAverageRatingGiven() {
        return averageRatingGiven;
    }

    public void setAverageRatingGiven(double averageRatingGiven) {
        this.averageRatingGiven = averageRatingGiven;
    }

    public int getWatchlistCount() {
        return watchlistCount;
    }

    public void setWatchlistCount(int watchlistCount) {
        this.watchlistCount = watchlistCount;
    }

    public Map<String, Long> getGenreDistribution() {
        return genreDistribution;
    }

    public void setGenreDistribution(Map<String, Long> genreDistribution) {
        this.genreDistribution = genreDistribution;
    }

    public List<Rating> getRecentRatings() {
        return recentRatings;
    }

    public void setRecentRatings(List<Rating> recentRatings) {
        this.recentRatings = recentRatings;
    }

    public List<WatchlistItem> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(List<WatchlistItem> watchlist) {
        this.watchlist = watchlist;
    }
}
