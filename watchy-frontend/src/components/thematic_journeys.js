import React, { useState, useEffect } from 'react';
import './thematicjourneys.css';
import { getTopMoviesByDecade } from '../services/api';

const DECADE_CARDS = [
  {
    id: '1950s',
    start: 1950,
    title: 'Naif Başlangıçlar',
    subtitle: 'İlk melodramlar, halk hikayeleri',
    description: 'Yeşilçam masalsı melodramlarla seyircisini buldu.',
    color: '#1E3A8A'
  },
  {
    id: '1960s',
    start: 1960,
    title: 'Yeşilçam Rüyası',
    subtitle: 'Aile, aşk ve melodramın altın çağı',
    description: 'Türk sineması romantik anlatılarıyla doruğa ulaştı.',
    color: '#0077b6'
  },
  {
    id: '1970s',
    start: 1970,
    title: 'Toplumcu Gerçekçilik',
    subtitle: 'Köyden kente göç, sınıf çatışmaları',
    description: 'Toplumsal meseleler perdeye taşındı.',
    color: '#9b2226'
  },
  {
    id: '1980s',
    start: 1980,
    title: 'Darbe ve Sessizlik',
    subtitle: 'Baskı, suskunluk ve bireysel dram',
    description: 'Politik iklim filmlere içe dönük hikâyeler kattı.',
    color: '#003049'
  },
  {
    id: '1990s',
    start: 1990,
    title: 'Yalnızlık ve İçe Dönüş',
    subtitle: 'Şehirli bireylerin sancıları',
    description: 'Bağımsız sinema bireyin yalnızlığını anlattı.',
    color: '#386641'
  },
  {
    id: '2000s',
    start: 2000,
    title: 'Yeni Dalga',
    subtitle: 'Minimalizm ve estetik yoğunluk',
    description: 'Festival dünyasında öne çıkan minimal hikâyeler.',
    color: '#cc5803'
  },
  {
    id: '2010s',
    start: 2010,
    title: 'Küresel Tanınırlık',
    subtitle: "Cannes'dan Altın Portakal’a yükseliş",
    description: 'Türkiye sineması uluslararası platformlarda ses getirdi.',
    color: '#6a4c93'
  },
  {
    id: '2020s',
    start: 2020,
    title: 'Dijital Geçiş',
    subtitle: 'Festivalden platforma uzanan sinema',
    description: 'Pandemi sonrası dijital anlatılar ve hibrit gösterimler.',
    color: '#ff7f51'
  }
];

const PeriodCinema = () => {
  const [decadeMovies, setDecadeMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          DECADE_CARDS.map(({ start }) => getTopMoviesByDecade(start, start + 9))
        );

        if (!isMounted) return;

        const grouped = {};
        let hadError = false;
        let hasData = false;

        results.forEach((result, index) => {
          const { id } = DECADE_CARDS[index];

          if (result.status === 'fulfilled') {
            const movies = Array.isArray(result.value) ? result.value.slice(0, 3) : [];
            grouped[id] = movies;
            if (movies.length > 0) {
              hasData = true;
            }
          } else {
            console.error('Error fetching thematic movies:', result.reason);
            grouped[id] = [];
            hadError = true;
          }
        });

        setDecadeMovies(grouped);

        if (hadError && !hasData) {
          setError('Tematik filmler yüklenirken bir hata oluştu.');
        } else if (hadError) {
          setError('Bazı dönemler yüklenirken sorun yaşandı.');
        }
      } catch (err) {
        console.error('Error fetching thematic movies:', err);
        if (isMounted) {
          setError('Tematik filmler yüklenirken bir hata oluştu.');
          setDecadeMovies({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="thematic-journeys">
        <h2 className="section-title">Dönem Sineması</h2>
        <div className="loading-placeholder">Yükleniyor...</div>
      </section>
    );
  }

  return (
    <section className="thematic-journeys">
      <h2 className="section-title">Dönem Sineması</h2>
      {error ? (
        <div className="loading-placeholder">{error}</div>
      ) : (
        <div className="journeys-container">
          {DECADE_CARDS.map((journey) => {
            const movies = decadeMovies[journey.id] || [];
            const yearRange = `${journey.start} - ${journey.start + 9}`;
            const posterSlots = Array.from({ length: 3 }, (_, index) => movies[index] ?? null);

            return (
              <div
                key={journey.id}
                className="journey-card"
                style={{ backgroundColor: journey.color }}
              >
                <div className="journey-header">
                  <span className="journey-years">{yearRange}</span>
                  <h3 className="journey-title">{journey.title}</h3>
                  <h4 className="journey-subtitle">{journey.subtitle}</h4>
                  <p className="journey-description">{journey.description}</p>
                </div>

                <div className="journey-movies">
                  {posterSlots.map((movie, index) => (
                    <div
                      key={movie?.movie_id || `${journey.id}-slot-${index}`}
                      className="movie-poster"
                    >
                      {movie?.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="poster-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="poster-placeholder">
                          <span>{movie ? '🎬' : 'Veri yok'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="journey-indicators">
                  {posterSlots.map((_, indicator) => (
                    <span
                      key={`${journey.id}-indicator-${indicator}`}
                      className={`indicator ${indicator === 0 ? 'active' : ''}`}
                    ></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PeriodCinema;
