
import React from 'react';
import MovieCard from './MovieCard';

function ResultList({ searchResults, platforms, hasCompletedSearch }) {
  const visibleMovies = Array.isArray(searchResults)
    ? searchResults.filter((movie) => {
        const platformInfo = platforms[movie.movie_id]?.platforms;
        return Array.isArray(platformInfo) && platformInfo.length > 0;
      })
    : [];

  if (!visibleMovies.length) {
    if (!hasCompletedSearch) {
      return null;
    }

    return (
      <div
        style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}
      >
        Aradığınız kriterlerde platformlarda erişilebilir film bulunamadı.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '18px',
        marginTop: '20px'
      }}
    >
      {visibleMovies.map((movie) => (
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
