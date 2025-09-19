import React, { useState, useEffect } from 'react';
import './thematicjourneys.css';
import { getTopMoviesByDecade } from '../services/api';

const DECADE_CARDS = [
  {
    id: '1950s',
    start: 1950,
    title: 'Golden Age Spectacle',
    subtitle: 'Technicolor musicals & biblical epics',
    description: 'Hollywood dazzled post-war audiences with lavish productions and mega-stars.',
    color: '#b91c1c'
  },
  {
    id: '1960s',
    start: 1960,
    title: 'New Hollywood Sparks',
    subtitle: 'Counterculture, cool, and bold ideas',
    description: 'Studios embraced riskier storytelling as young auteurs challenged the system.',
    color: '#c2410c'
  },
  {
    id: '1970s',
    start: 1970,
    title: 'Auteur Revolution',
    subtitle: 'Grit, paranoia, and personal visions',
    description: 'Filmmakers redefined the blockbuster with character-driven, uncompromising cinema.',
    color: '#ca8a04'
  },
  {
    id: '1980s',
    start: 1980,
    title: 'Blockbuster Boom',
    subtitle: 'High-concept thrills and pop icons',
    description: 'Spectacle ruled multiplexes as franchises and synth-fueled adventure films exploded.',
    color: '#0f766e'
  },
  {
    id: '1990s',
    start: 1990,
    title: 'Indie Renaissance',
    subtitle: 'Festival darlings meet studio hits',
    description: 'Independent voices and prestige dramas thrived alongside game-changing effects.',
    color: '#2563eb'
  },
  {
    id: '2000s',
    start: 2000,
    title: 'Franchise Frontier',
    subtitle: 'IP sagas & prestige spectacle',
    description: 'Hollywood balanced mega-franchises with visionary auteurs and awards contenders.',
    color: '#7c3aed'
  },
  {
    id: '2010s',
    start: 2010,
    title: 'Streaming Disruption',
    subtitle: 'Cinematic universes & bold voices',
    description: 'Shared universes rose as diverse storytellers reshaped mainstream cinema.',
    color: '#db2777'
  },
  {
    id: '2020s',
    start: 2020,
    title: 'Hybrid Storytelling',
    subtitle: 'Theaters, platforms, and new horizons',
    description: 'Studios blend theatrical spectacle with streaming experimentation in a rebounding era.',
    color: '#f97316'
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
