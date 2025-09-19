// components/ThematicJourneys.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DECADES = [
  {
    decade: '1950s',
    title: 'Golden Age Glamour',
    subtitle: 'Studio musicals, Technicolor epics, star-driven romance',
    color: '#1E3A8A'
  },
  {
    decade: '1960s',
    title: 'New Hollywood Sparks',
    subtitle: 'Counterculture antiheroes challenge the old studio order',
    color: '#0077b6'
  },
  {
    decade: '1970s',
    title: 'Auteur Revolution',
    subtitle: 'Gritty dramas and daring directors redefine storytelling',
    color: '#9b2226'
  },
  {
    decade: '1980s',
    title: 'Blockbuster Boom',
    subtitle: 'High-concept adventure and special-effects spectacle',
    color: '#003049'
  },
  {
    decade: '1990s',
    title: 'Indie Renaissance',
    subtitle: 'Festival hits and character-driven studio dramas collide',
    color: '#386641'
  },
  {
    decade: '2000s',
    title: 'Franchise Foundations',
    subtitle: 'Superheroes, fantasy sagas, and global box-office juggernauts',
    color: '#cc5803'
  },
  {
    decade: '2010s',
    title: 'Prestige & Platforms',
    subtitle: 'Awards-season favorites meet bold streaming originals',
    color: '#6a4c93'
  },
  {
    decade: '2020s',
    title: 'Hybrid Horizons',
    subtitle: 'Streaming-first releases and theatrical event cinema converge',
    color: '#ff7f51'
  }
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
      <h2 style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'left' }}>Tematik Yolculuklar</h2>
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
