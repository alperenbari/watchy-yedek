// components/ThematicJourneys.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DECADES = [
];

const ThematicJourneys = () => {
  const [filmsByDecade, setFilmsByDecade] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const newData = {};
      for (let d of DECADES) {
        try {
          const yearStart = parseInt(d.decade.slice(0, 4));
          const yearEnd = yearStart + 9;
          const res = await axios.get(`/api/movies/decade?start=${yearStart}&end=${yearEnd}`);
          newData[d.decade] = res.data;
        } catch (e) {
          newData[d.decade] = [];
        }
      }
      setFilmsByDecade(newData);
    };
    fetchData();
  }, []);

  return (
    <section style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'left' }}>Dönem Filmleri</h2>
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
        {DECADES.map((theme, idx) => (
          <div
            key={idx}
            style={{
              minWidth: '240px',
              backgroundColor: theme.color,
              color: 'white',
              borderRadius: '16px',
              padding: '16px'
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{theme.decade}</h3>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: theme.subtitle ? '6px' : '12px' }}>{theme.title}</h4>
            {theme.subtitle && (
              <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>{theme.subtitle}</p>
            )}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {(filmsByDecade[theme.decade] || []).slice(0, 5).map((film, fidx) => (
                <img
                  key={fidx}
                  src={film.posterUrl}
                  alt={film.title}
                  title={film.title}
                  style={{ width: '60px', height: '90px', borderRadius: '4px', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThematicJourneys;
