
import React from 'react';

function MovieCard({ movie, platforms }) {
  return (
    <div
      className="movie-tile"
      style={{
        width: '200px',
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '10px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '12px',
        gap: '8px'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}
      >
        <div style={{ width: '70px', flexShrink: 0 }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
              alt={movie.title}
              style={{ borderRadius: '4px', width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '105px',
                background: '#333',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}
            >
              🎬
            </div>
          )}
        </div>
        {platforms && platforms.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              flex: 1
            }}
          >
            {platforms.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1c1c1c',
                  borderRadius: '4px',
                  padding: '4px 6px'
                }}
              >
                <img
                  src={
                    p.logo_path === '/yt'
                      ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                      : `https://image.tmdb.org/t/p/w92${p.logo_path}`
                  }
                  alt={p.provider_name}
                  title={p.provider_name}
                  style={{ height: '16px' }}
                />
                <span style={{ fontSize: '11px', color: '#f1f1f1' }}>{p.provider_name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              fontSize: '11px',
              color: '#999',
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
              padding: '6px'
            }}
          >
            Platform bilgisi bulunamadı
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <strong style={{ display: 'block', marginBottom: '2px' }}>{movie.title}</strong>
        <div style={{ fontSize: '11px' }}>{movie.release_date?.slice(0, 4)}</div>
        <div style={{ fontSize: '10px', color: '#aaa' }}>{movie.director}</div>
      </div>
    </div>
  );
}

export default MovieCard;
