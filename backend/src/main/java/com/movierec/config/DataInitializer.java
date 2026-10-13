package com.movierec.config;

import com.movierec.entity.Movie;
import com.movierec.entity.Rating;
import com.movierec.entity.User;
import com.movierec.entity.WatchlistItem;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.RatingRepository;
import com.movierec.repository.UserRepository;
import com.movierec.repository.WatchlistRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final WatchlistRepository watchlistRepository;

    public DataInitializer(MovieRepository movieRepository,
                           UserRepository userRepository,
                           RatingRepository ratingRepository,
                           WatchlistRepository watchlistRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
        this.watchlistRepository = watchlistRepository;
    }

    @Override
    public void run(String... args) {
        if (movieRepository.count() == 0) {
            seedMovies();
        }

        if (userRepository.count() == 0) {
            seedUsersAndActivity();
        }
    }

    private void seedMovies() {
        List<Movie> movies = Arrays.asList(
            new Movie(
                "Inception",
                "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "Action, Sci-Fi, Thriller",
                "Christopher Nolan",
                "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
                2010,
                148,
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=YoHD9XEInc0",
                8.8
            ),
            new Movie(
                "Interstellar",
                "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
                "Adventure, Drama, Sci-Fi",
                "Christopher Nolan",
                "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
                2014,
                169,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                8.7
            ),
            new Movie(
                "The Dark Knight",
                "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                "Action, Crime, Drama",
                "Christopher Nolan",
                "Christian Bale, Heath Ledger, Aaron Eckhart",
                2008,
                152,
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                9.0
            ),
            new Movie(
                "Blade Runner 2049",
                "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
                "Action, Drama, Sci-Fi",
                "Denis Villeneuve",
                "Ryan Gosling, Harrison Ford, Ana de Armas",
                2017,
                164,
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=gCcx85zbxz4",
                8.0
            ),
            new Movie(
                "Dune: Part Two",
                "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                "Action, Adventure, Sci-Fi",
                "Denis Villeneuve",
                "Timothée Chalamet, Zendaya, Rebecca Ferguson",
                2024,
                166,
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=Way9Dexny3w",
                8.6
            ),
            new Movie(
                "The Matrix",
                "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth: the life he knows is an elaborate deception.",
                "Action, Sci-Fi",
                "Lana Wachowski, Lilly Wachowski",
                "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
                1999,
                136,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=vKQi3bBA1y8",
                8.7
            ),
            new Movie(
                "Parasite",
                "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
                "Drama, Thriller",
                "Bong Joon Ho",
                "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
                2019,
                132,
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=5xH0hhP3cO0",
                8.5
            ),
            new Movie(
                "The Shawshank Redemption",
                "A banker convicted of uxoricide forms a friendship over a quarter of a century with a hardened convict, while maintaining his innocence and trying to remain hopeful.",
                "Drama",
                "Frank Darabont",
                "Tim Robbins, Morgan Freeman, Bob Gunton",
                1994,
                142,
                "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=6hB3S9bIaco",
                9.3
            ),
            new Movie(
                "Pulp Fiction",
                "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
                "Crime, Drama",
                "Quentin Tarantino",
                "John Travolta, Uma Thurman, Samuel L. Jackson",
                1994,
                154,
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
                8.9
            ),
            new Movie(
                "Spider-Man: Into the Spider-Verse",
                "Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from parallel dimensions to stop a threat to all reality.",
                "Animation, Action, Adventure",
                "Bob Persichetti, Peter Ramsey",
                "Shameik Moore, Jake Johnson, Hailee Steinfeld",
                2018,
                117,
                "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=g4Hbz2jLxvQ",
                8.4
            ),
            new Movie(
                "Spirited Away",
                "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
                "Animation, Adventure, Family",
                "Hayao Miyazaki",
                "Rumi Hiiragi, Miyu Irino, Mari Natsuki",
                2001,
                125,
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=ByXuk9QqQkk",
                8.6
            ),
            new Movie(
                "La La Land",
                "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
                "Comedy, Drama, Music",
                "Damien Chazelle",
                "Ryan Gosling, Emma Stone, Rosemarie DeWitt",
                2016,
                128,
                "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=0pdqf4P9MB8",
                8.0
            ),
            new Movie(
                "Whiplash",
                "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
                "Drama, Music",
                "Damien Chazelle",
                "Miles Teller, J.K. Simmons, Paul Reiser",
                2014,
                106,
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=7d_jQycdQGo",
                8.5
            ),
            new Movie(
                "Get Out",
                "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him reaches a boiling point.",
                "Horror, Mystery, Thriller",
                "Jordan Peele",
                "Daniel Kaluuya, Allison Williams, Bradley Whitford",
                2017,
                104,
                "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=DzfpyUB60YY",
                7.8
            ),
            new Movie(
                "Shutter Island",
                "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.",
                "Mystery, Thriller",
                "Martin Scorsese",
                "Leonardo DiCaprio, Emily Mortimer, Mark Ruffalo",
                2010,
                138,
                "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=5iaYLCiq5RM",
                8.2
            ),
            new Movie(
                "The Grand Budapest Hotel",
                "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
                "Adventure, Comedy, Crime",
                "Wes Anderson",
                "Ralph Fiennes, F. Murray Abraham, Mathieu Amalric",
                2014,
                99,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=1Fg5iWmQjwk",
                8.1
            ),
            new Movie(
                "Mad Max: Fury Road",
                "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper and a drifter named Max.",
                "Action, Adventure, Sci-Fi",
                "George Miller",
                "Tom Hardy, Charlize Theron, Nicholas Hoult",
                2015,
                120,
                "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=hEJnMQG9ev8",
                8.1
            ),
            new Movie(
                "Fight Club",
                "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
                "Drama",
                "David Fincher",
                "Brad Pitt, Edward Norton, Meat Loaf",
                1999,
                139,
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=qtRKDV93gkQ",
                8.8
            )
        );

        movieRepository.saveAll(movies);
    }

    private void seedUsersAndActivity() {
        User demoUser = new User("alex", "alex@example.com", "password123", "Alex Mercer", "Sci-Fi, Action, Thriller");
        User savedUser = userRepository.save(demoUser);

        // Seed some initial ratings for Alex to calibrate recommendations
        List<Movie> movies = movieRepository.findAll();
        if (!movies.isEmpty()) {
            Movie inception = movies.stream().filter(m -> m.getTitle().equals("Inception")).findFirst().orElse(movies.get(0));
            Movie darkKnight = movies.stream().filter(m -> m.getTitle().equals("The Dark Knight")).findFirst().orElse(movies.get(1));
            
            Rating r1 = new Rating(savedUser, inception, 5.0, "Mind-bending masterpiece! The dream concept and pacing are legendary.");
            Rating r2 = new Rating(savedUser, darkKnight, 4.5, "Heath Ledger's performance is unforgettable.");
            ratingRepository.saveAll(Arrays.asList(r1, r2));

            // Seed a watchlist item
            if (movies.size() > 3) {
                watchlistRepository.save(new WatchlistItem(savedUser, movies.get(3), true));
            }
        }
    }
}
