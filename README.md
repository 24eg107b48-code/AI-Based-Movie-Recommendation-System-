# AI-Based Movie Recommendation System 🎬🤖

A full-stack, AI-powered web application that suggests movies to users based on their interests, favorite genres, ratings, and viewing history.

The system features a **React** frontend, a **Spring Boot** backend designed and structured for **Spring Tool Suite (STS)**, and a **MySQL** database for storing users, movie catalogs, ratings, and watchlists.

Repository: [https://github.com/24eg107b48-code/AI-Based-Movie-Recommendation-System-](https://github.com/24eg107b48-code/AI-Based-Movie-Recommendation-System-)

---

## 🌟 Key Features

- **Personalized AI Recommendations**: Generates tailored suggestions by analyzing user genre affinity, director preferences, and rating history using **Cosine Similarity & Multi-Attribute Content-Based Filtering**.
- **Explainable AI (XAI)**: Every recommendation comes with an intuitive explanation (e.g., *"97% Match · High affinity with your favorite genre Sci-Fi & inspired by your 5.0★ rating of Inception"*).
- **"More Like This" (Item-to-Item Similarity)**: Dynamically computes content similarity across genres, directors, and storyline tags for any selected movie.
- **Cold-Start Handling**: New users pick favorite genres during onboarding, immediately receiving calibrated recommendations via Bayesian-smoothed priors.
- **Interactive 5-Star Rating & Reviews**: Users can rate movies (0.5 to 5.0 stars) and submit written reviews, instantly recalibrating their personalized recommendation vectors.
- **Watchlist & Favorites**: Save movies to watch later or mark them as all-time favorites with real-time UI feedback.
- **Instant Search & Genre Filtering**: Fast real-time multi-field search across titles, directors, cast, and genres.
- **Taste Profile & Analytics**: Visual breakdown of movies rated, average score given, and genre preference distribution bars.
- **Modern Cinema UI**: Glassmorphic dark cinema theme with neon accents, responsive layout, modal trailers, and smooth transitions.

---

## 🏗️ Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       React Frontend                        │
   │      (Vite + React 19 + Lucide Icons + Cinema UI)          │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTP / REST APIs (Port 5173)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  Spring Boot Backend (STS)                  │
   │               (Spring Web + Spring Data JPA)                │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │              AI Recommendation Engine                 │  │
   │  │   • Content-Based Filtering (Cosine Similarity)       │  │
   │  │   • Multi-Attribute Feature Vectors (Genres, Director)│  │
   │  │   • Collaborative Signals & Bayesian Prior            │  │
   │  │   • Explainable AI (XAI) Scoring                      │  │
   │  └───────────────────────────────────────────────────────┘  │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ JDBC / Hibernate (Port 8080)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                       MySQL Database                        │
   │    Tables: users, movies, ratings, watchlist_items          │
   └─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite, JavaScript, CSS3 | Glassmorphic cinema design, responsive cards, modals, Lucide icons |
| **Backend** | Spring Boot 3.3.4, Java 17+ | STS (Spring Tool Suite) compatible, Spring Data JPA, RESTful Controllers |
| **Database** | MySQL 8.0 | `movie_rec_db` with relational integrity and seed data |
| **AI Engine** | Hybrid Content + Collaborative | Cosine Similarity vector space model, Jaccard genre overlap, Bayesian ratings |

---

## 🧠 How the AI Recommendation Engine Works

### 1. Vector Space Representation
Each movie $m$ is represented as a normalized feature vector $\vec{M}$ spanning genre attributes and director tokens:
$$\vec{M} = \begin{bmatrix} w_{\text{Sci-Fi}}, w_{\text{Action}}, w_{\text{Drama}}, \dots, w_{\text{dir:Nolan}} \end{bmatrix}$$

### 2. User Profile Vector Construction
The user's taste vector $\vec{U}$ is dynamically synthesized from three sources:
1. **Explicit Preferences**: Selected favorite genres contribute $+3.0$ base weight.
2. **Implicit Feedback & Ratings**:
   - High ratings ($r \ge 3.0$ stars): $(r - 2.5) \times 1.5$ positive adjustment to associated genres and directors.
   - Low ratings ($r < 2.5$ stars): negative penalty.
3. **Watchlist & Favorites**: Saved items contribute $+1.0$ (watchlist) or $+2.0$ (favorites).

### 3. Cosine Similarity Scoring
The content similarity between the user preference vector $\vec{U}$ and each unrated candidate movie vector $\vec{M}$ is computed as:
$$\text{CosineSim}(\vec{U}, \vec{M}) = \frac{\vec{U} \cdot \vec{M}}{\|\vec{U}\| \|\vec{M}\|} = \frac{\sum_{i=1}^n U_i M_i}{\sqrt{\sum_{i=1}^n U_i^2} \sqrt{\sum_{i=1}^n M_i^2}}$$

### 4. Hybrid Ranking & Explainable AI
The final match score blends content affinity ($70\%$) with a quality/rating Bayesian prior ($30\%$):
$$\text{Score}(u, m) = 0.70 \cdot \text{CosineSim}(\vec{U}, \vec{M}) + 0.30 \cdot \left(\frac{\text{Rating}_m}{10}\right)$$

Matches are converted into a $50\% - 99\%$ confidence match percentage alongside an explainable AI justification referencing the user's specific favorite genres and rated movies.

---

## 📁 Repository Structure

```
AI-Based-Movie-Recommendation-System-/
├── backend/                                # Spring Boot Project (STS Compatible)
│   ├── pom.xml                             # Maven Dependencies
│   ├── mvnw & mvnw.cmd                     # Maven Wrapper
│   └── src/
│       ├── main/
│       │   ├── java/com/movierec/
│       │   │   ├── MovieRecommendationApplication.java
│       │   │   ├── config/                 # CORS & DataInitializer
│       │   │   ├── controller/             # REST API Controllers
│       │   │   ├── dto/                    # Requests, Responses, Profile DTOs
│       │   │   ├── entity/                 # JPA Entities (User, Movie, Rating, Watchlist)
│       │   │   ├── repository/             # Spring Data JPA Repositories
│       │   │   └── service/                # Business Logic & RecommendationEngine
│       │   └── resources/
│       │       ├── application.properties  # MySQL configuration
│       │       └── application-h2.properties # In-memory fallback profile
│       └── test/
├── frontend/                               # React Single Page Application
│   ├── package.json                        # Frontend dependencies (React, Vite, Axios, Lucide)
│   ├── vite.config.js                      # Vite bundler config
│   ├── index.html                          # Entry HTML
│   └── src/
│       ├── App.jsx                         # Main dashboard & shelf routing
│       ├── App.css & index.css             # Cinema glassmorphic styles
│       ├── api/movieApi.js                 # Axios API connector
│       └── components/                     # Navbar, HeroBanner, MovieCard, Modals, Filters
├── database/                               # Database Scripts
│   ├── schema.sql                          # MySQL Table DDL
│   └── seed_data.sql                       # Sample movies and users
└── README.md                               # Complete Documentation
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Java**: JDK 17 or higher (`java -version`)
- **Maven**: 3.8+ (or use the included `./mvnw`)
- **Node.js**: v18+ and npm (`node -v`)
- **MySQL**: 8.0+ running on port 3306 (or H2 profile)
- **IDE**: Spring Tool Suite (STS) / Eclipse / IntelliJ IDEA / VS Code

---

### Step 1: Database Setup (MySQL)

1. Ensure MySQL service is running on `localhost:3306`.
2. Spring Boot will automatically create the database and tables upon first launch via `createDatabaseIfNotExist=true` and Hibernate `ddl-auto=update`.
3. *(Optional manual setup)*: Execute the scripts in MySQL Workbench or terminal:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed_data.sql
   ```
4. Verify `backend/src/main/resources/application.properties` credentials match your local MySQL password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/movie_rec_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```

---

### Step 2: Running Backend in Spring Tool Suite (STS)

1. Open **Spring Tool Suite (STS)**.
2. Click **File** > **Import...** > **Existing Maven Projects**.
3. Browse and select the `backend/` folder and click **Finish**.
4. Allow STS to download Maven dependencies.
5. In **Project Explorer**, navigate to `src/main/java/com/movierec/MovieRecommendationApplication.java`.
6. Right-click > **Run As** > **Spring Boot App**.
7. The backend will boot on port `8080`. Initial movies and the demo user will be seeded automatically.

> **Tip (Command Line Alternative)**:
> ```powershell
> cd backend
> .\mvnw spring-boot:run
> ```

---

### Step 3: Running the React Frontend

1. Open a new terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demo Account & Testing Flow

| Username | Password | Profile |
|---|---|---|
| `alex` | `password123` | Sci-Fi, Action, Thriller enthusiast |

### Quick Test Walkthrough:
1. Click **"Sign In"** > **"1-Click Demo Login (Alex)"**.
2. Notice the **"Recommended For You"** shelf highlighting films like *Blade Runner 2049* and *Dune: Part Two* because Alex rated *Inception* 5.0★.
3. Click on *Parasite* or any Drama movie, click **Rate 5 Stars** with a review.
4. Watch the AI engine automatically recalculate and update recommendation shelves with newly aligned titles!
5. Click **My Profile** to view your genre distribution charts and live taste analytics.

---

## 📡 REST API Reference

### 🎬 Movies
- `GET /api/movies` — Fetch all movies in the catalog.
- `GET /api/movies/{id}` — Fetch movie details by ID.
- `GET /api/movies/search?query={q}` — Search across title, genre, director, cast.
- `GET /api/movies/genre/{genre}` — Filter movies by genre name.
- `GET /api/movies/genres` — List all distinct genres.
- `GET /api/movies/top-rated` — Top 10 highest-rated movies.
- `GET /api/movies/trending` — Top 10 most recent releases.

### 🤖 AI Recommendations
- `GET /api/recommendations/personalized/{userId}?limit=12` — Personalized hybrid recommendations.
- `GET /api/recommendations/similar/{movieId}?limit=6` — "More Like This" item-to-item similarity.
- `GET /api/recommendations/popular?limit=10` — Fallback global popularity ranking.

### ⭐ Ratings & Reviews
- `POST /api/ratings` — Submit or update movie rating (`userId`, `movieId`, `rating`, `review`).
- `GET /api/ratings/user/{userId}` — Fetch all ratings by a user.
- `GET /api/ratings/movie/{movieId}` — Fetch all ratings and reviews for a movie.

### 💖 Watchlist & Favorites
- `POST /api/watchlist/toggle?userId={u}&movieId={m}` — Add or remove movie from watchlist.
- `POST /api/watchlist/favorite?userId={u}&movieId={m}` — Toggle favorite status.
- `GET /api/watchlist/user/{userId}` — Fetch user's saved watchlist.

### 👤 Authentication & Profiles
- `POST /api/auth/register` — Create new account with preferred genres.
- `POST /api/auth/login` — Sign in with username/email and password.
- `GET /api/auth/profile/{userId}` — User analytics, stats, and rating distribution.
- `PUT /api/auth/profile/{userId}/genres` — Update favorite genres to recalibrate AI vectors.

---

## 👥 Contributors & License

Developed for the **AI-Based Movie Recommendation System** project.
Licensed under the [MIT License](LICENSE).
