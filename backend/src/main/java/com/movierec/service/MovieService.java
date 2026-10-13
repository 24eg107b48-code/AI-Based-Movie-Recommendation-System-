package com.movierec.service;

import com.movierec.entity.Movie;
import com.movierec.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public List<Movie> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllMovies();
        }
        return movieRepository.searchMovies(query.trim());
    }

    public List<Movie> getMoviesByGenre(String genre) {
        if (genre == null || genre.equalsIgnoreCase("All")) {
            return getAllMovies();
        }
        return movieRepository.findByGenresContainingIgnoreCase(genre.trim());
    }

    public List<Movie> getTopRatedMovies() {
        return movieRepository.findTop10ByOrderByAverageRatingDesc();
    }

    public List<Movie> getTrendingMovies() {
        return movieRepository.findTop10ByOrderByReleaseYearDesc();
    }

    public Set<String> getAllUniqueGenres() {
        Set<String> uniqueGenres = new TreeSet<>();
        List<Movie> all = movieRepository.findAll();
        for (Movie m : all) {
            if (m.getGenres() != null) {
                String[] parts = m.getGenres().split(",");
                for (String p : parts) {
                    if (!p.trim().isEmpty()) {
                        uniqueGenres.add(p.trim());
                    }
                }
            }
        }
        return uniqueGenres;
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }
}
