
import React from 'react';

function MovieCard({ movie, platforms }) {
  return (
    <div
      className="movie-tile"
      style={{
        width: '120px',
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '8px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '12px'
      }}
    >
      <div style={{ width: '100%', marginBottom: '6px' }}>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
            alt={movie.title}
            style={{ borderRadius: '4px', width: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '180px', background: '#333', borderRadius: '4px' }}>🎬</div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <strong style={{ display: 'block', marginBottom: '2px' }}>{movie.title}</strong>
        <div style={{ fontSize: '11px' }}>{movie.release_date?.slice(0, 4)}</div>
        <div style={{ fontSize: '10px', color: '#aaa' }}>{movie.director}</div>
      </div>
      {platforms && platforms.length > 0 && (
        <div style={{
          marginTop: '6px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px'
        }}>
          {platforms.map((p, i) => (
            <img
              key={i}
              src={
                p.logo_path === '/yt'
                  ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                  : `https://image.tmdb.org/t/p/w92${p.logo_path}`
              }
              alt={p.provider_name}
              title={p.provider_name}
              style={{ height: '18px' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieCard;
