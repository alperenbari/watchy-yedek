
import React from 'react';
import MovieCard from './MovieCard';

function ResultList({ searchResults, platforms }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '14px',
      marginTop: '20px'
    }}>
      {searchResults.map((movie) => (
        <MovieCard
          key={movie.movie_id}
          movie={movie}
          platforms={platforms[movie.movie_id]?.platforms || []}
        />
      ))}
    </div>
  );
}

export default ResultList;
