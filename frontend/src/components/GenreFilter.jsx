import React from 'react';

const GENRES = [
  'All',
  'Sci-Fi',
  'Action',
  'Drama',
  'Adventure',
  'Crime',
  'Animation',
  'Thriller',
  'Comedy',
  'Music',
  'Horror',
  'Mystery',
];

export default function GenreFilter({ selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-filter-bar">
      {GENRES.map((genre) => (
        <button
          key={genre}
          className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
          onClick={() => onSelectGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
