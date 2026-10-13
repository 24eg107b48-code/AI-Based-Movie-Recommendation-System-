-- =========================================================
-- AI-Based Movie Recommendation System - Initial Dataset Seed
-- =========================================================

USE movie_rec_db;

-- Insert Seed Movies
INSERT INTO movies (title, description, genres, director, movie_cast, release_year, duration_minutes, poster_url, trailer_url, imdb_rating, average_rating, rating_count) VALUES
('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 'Action, Sci-Fi, Thriller', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page', 2010, 148, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 8.8, 8.8, 1),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 'Adventure, Drama, Sci-Fi', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 2014, 169, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 8.7, 8.7, 1),
('The Dark Knight', 'Batman raises the stakes in his war on crime when the sadistic criminal known as the Joker emerges.', 'Action, Crime, Drama', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 2008, 152, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 9.0, 9.0, 1),
('Blade Runner 2049', 'A young blade runner unearths a long-buried secret that leads him to track down Rick Deckard.', 'Action, Drama, Sci-Fi', 'Denis Villeneuve', 'Ryan Gosling, Harrison Ford, Ana de Armas', 2017, 164, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=gCcx85zbxz4', 8.0, 8.0, 1),
('Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.', 'Action, Adventure, Sci-Fi', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya, Rebecca Ferguson', 2024, 166, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=Way9Dexny3w', 8.6, 8.6, 1),
('The Matrix', 'A computer programmer discovers a mysterious rebellion against machines controlling humanity.', 'Action, Sci-Fi', 'Lana Wachowski, Lilly Wachowski', 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss', 1999, 136, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', 8.7, 8.7, 1),
('Parasite', 'Greed and class discrimination threaten the symbiotic relationship between two families.', 'Drama, Thriller', 'Bong Joon Ho', 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong', 2019, 132, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=5xH0hhP3cO0', 8.5, 8.5, 1),
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'Drama', 'Frank Darabont', 'Tim Robbins, Morgan Freeman, Bob Gunton', 1994, 142, 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 9.3, 9.3, 1),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'Crime, Drama', 'Quentin Tarantino', 'John Travolta, Uma Thurman, Samuel L. Jackson', 1994, 154, 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 8.9, 8.9, 1),
('Spider-Man: Into the Spider-Verse', 'Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from parallel dimensions.', 'Animation, Action, Adventure', 'Bob Persichetti, Peter Ramsey', 'Shameik Moore, Jake Johnson, Hailee Steinfeld', 2018, 117, 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=g4Hbz2jLxvQ', 8.4, 8.4, 1),
('Spirited Away', 'A young girl wanders into a magical world ruled by spirits, witches, and monsters.', 'Animation, Adventure, Family', 'Hayao Miyazaki', 'Rumi Hiiragi, Miyu Irino, Mari Natsuki', 2001, 125, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=ByXuk9QqQkk', 8.6, 8.6, 1),
('La La Land', 'A jazz pianist and an aspiring actress fall in love while pursuing their passions in Los Angeles.', 'Comedy, Drama, Music', 'Damien Chazelle', 'Ryan Gosling, Emma Stone, Rosemarie DeWitt', 2016, 128, 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=0pdqf4P9MB8', 8.0, 8.0, 1),
('Whiplash', 'A dedicated drumming student is pushed beyond the brink by a ruthless jazz instructor.', 'Drama, Music', 'Damien Chazelle', 'Miles Teller, J.K. Simmons, Paul Reiser', 2014, 106, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=7d_jQycdQGo', 8.5, 8.5, 1),
('Get Out', 'A young black man visits his white girlfriend parents for the weekend, discovering a sinister secret.', 'Horror, Mystery, Thriller', 'Jordan Peele', 'Daniel Kaluuya, Allison Williams, Bradley Whitford', 2017, 104, 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=DzfpyUB60YY', 7.8, 7.8, 1),
('Shutter Island', 'A U.S. Marshal investigates a psychiatric facility on a remote island where a patient has vanished.', 'Mystery, Thriller', 'Martin Scorsese', 'Leonardo DiCaprio, Emily Mortimer, Mark Ruffalo', 2010, 138, 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=5iaYLCiq5RM', 8.2, 8.2, 1),
('The Grand Budapest Hotel', 'A hotel concierge and his protégé become embroiled in the theft of a priceless Renaissance painting.', 'Adventure, Comedy, Crime', 'Wes Anderson', 'Ralph Fiennes, F. Murray Abraham, Mathieu Amalric', 2014, 99, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=1Fg5iWmQjwk', 8.1, 8.1, 1),
('Mad Max: Fury Road', 'In a post-apocalyptic desert wasteland, a woman and a nomad rebel against a tyrannical warlord.', 'Action, Adventure, Sci-Fi', 'George Miller', 'Tom Hardy, Charlize Theron, Nicholas Hoult', 2015, 120, 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=hEJnMQG9ev8', 8.1, 8.1, 1),
('Fight Club', 'An unfulfilled office worker forms an underground fighting circuit that grows into an anarchic movement.', 'Drama', 'David Fincher', 'Brad Pitt, Edward Norton, Meat Loaf', 1999, 139, 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=qtRKDV93gkQ', 8.8, 8.8, 1);

-- Demo User
INSERT INTO users (username, email, password, full_name, favorite_genres)
VALUES ('alex', 'alex@example.com', 'password123', 'Alex Mercer', 'Sci-Fi, Action, Thriller');

-- Demo Ratings
INSERT INTO ratings (user_id, movie_id, rating_value, review) VALUES
(1, 1, 5.0, 'Mind-bending masterpiece! The dream concept and pacing are legendary.'),
(1, 3, 4.5, 'Heath Ledger performance is unforgettable.');

-- Demo Watchlist
INSERT INTO watchlist_items (user_id, movie_id, is_favorite) VALUES
(1, 2, TRUE),
(1, 4, TRUE);
