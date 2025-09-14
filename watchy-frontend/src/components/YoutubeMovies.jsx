import React from 'react';

const MOVIES = [
  { title: 'Selvi Boylum', link: '#' },
  { title: 'Masumiyet', link: '#' },
  { title: 'Yol', link: '#' }
];

const YoutubeMovies = () => {
  return (
    <section style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'left' }}>YouTube'da Ücretsiz</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {MOVIES.map((m, idx) => (
          <div key={idx} style={{
            backgroundColor: '#1a1a1a',
            padding: '12px',
            borderRadius: '8px',
            color: 'white'
          }}>
            <p style={{ marginBottom: '10px' }}>{m.title}</p>
            <a href={m.link} target="_blank" rel="noreferrer" style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#e50914',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none'
            }}>İzle</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default YoutubeMovies;