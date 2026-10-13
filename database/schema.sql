-- =========================================================
-- AI-Based Movie Recommendation System - MySQL Database Schema
-- Database: movie_rec_db
-- =========================================================

CREATE DATABASE IF NOT EXISTS movie_rec_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE movie_rec_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    favorite_genres VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    genres VARCHAR(200) NOT NULL,
    director VARCHAR(100),
    movie_cast VARCHAR(255),
    release_year INT,
    duration_minutes INT,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    imdb_rating DOUBLE DEFAULT 0.0,
    average_rating DOUBLE DEFAULT 0.0,
    rating_count INT DEFAULT 0
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    rating_value DOUBLE NOT NULL,
    review VARCHAR(500),
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_movie UNIQUE (user_id, movie_id)
);

-- Watchlist & Favorites Table
CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_watchlist_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT uq_watchlist_user_movie UNIQUE (user_id, movie_id)
);
