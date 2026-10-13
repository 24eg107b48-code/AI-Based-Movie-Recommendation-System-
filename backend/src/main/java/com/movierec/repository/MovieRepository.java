package com.movierec.repository;

import com.movierec.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByGenresContainingIgnoreCase(String genre);

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.genres) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.director) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.cast) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Movie> searchMovies(@Param("query") String query);

    List<Movie> findTop10ByOrderByAverageRatingDesc();

    List<Movie> findTop10ByOrderByReleaseYearDesc();
}
