
import React from 'react';

function MovieCard({ movie, platforms }) {
  const uniquePlatforms = Array.isArray(platforms)
    ? platforms.filter((platform, index, list) => {
        if (platform?.provider_id) {
          return (
            list.findIndex((item) => item?.provider_id === platform.provider_id) === index
          );
        }

        return (
          index ===
          list.findIndex((item) => item?.provider_name === platform?.provider_name)
        );
      })
    : [];

  return (
    <div
      className="movie-tile"
      style={{
        width: '220px',
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '10px',
        padding: '12px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <div style={{ width: '80px', flexShrink: 0 }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
              alt={movie.title}
              style={{
                borderRadius: '6px',
                width: '100%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '115px',
                background: '#333',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px'
              }}
            >
              🎬
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            rowGap: '6px',
            alignItems: 'center'
          }}
        >
          {uniquePlatforms.map((platform) => (
            <div
              key={platform?.provider_id || platform?.provider_name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#1c1c1c',
                borderRadius: '20px',
                padding: '4px 8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
              }}
            >
              <img
                src={
                  platform?.logo_path === '/yt'
                    ? 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_(2017).svg'
                    : `https://image.tmdb.org/t/p/w92${platform?.logo_path}`
                }
                alt={platform?.provider_name}
                title={platform?.provider_name}
                style={{ height: '18px', width: 'auto' }}
              />
              <span style={{ fontSize: '11px', color: '#f1f1f1' }}>
                {platform?.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <strong style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>
          {movie.title}
        </strong>
        <div style={{ fontSize: '11px', color: '#ddd' }}>{movie.release_date?.slice(0, 4)}</div>
        <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>{movie.director}</div>
      </div>
    </div>
  );
}

export default MovieCard;
