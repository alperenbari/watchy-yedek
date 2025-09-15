import React, { useState, useEffect } from 'react';
import './thematicjourneys.css';
import { searchMoviesByPeriod } from '../services/api';

const PeriodCinema = () => {
  const [movies1980s, setMovies1980s] = useState([]);
  const [movies1990s, setMovies1990s] = useState([]);
  const [movies2000s, setMovies2000s] = useState([]);
  const [movies2010s, setMovies2010s] = useState([]);
  const [movies2020s, setMovies2020s] = useState([]);
  const [loading, setLoading] = useState(true);

  const journeys = [
    {
      id: '1980s',
      title: '1980s',
      subtitle: 'Darbland silence',
      description: 'Offity dramas repressed stories',
      period: [1980, 1989],
      color: '#2563eb',
      movies: movies1980s
    },
    {
      id: '1990s',
      title: '1990s',
      subtitle: 'Loneliness',
      description: 'Introspective tales of solitude',
      period: [1990, 1999],
      color: '#16a34a',
      movies: movies1990s
    },
    {
      id: '2000s',
      title: '2000s',
      subtitle: 'New wave',
      description: 'Aesthetic and existential films',
      period: [2000, 2009],
      color: '#dc2626',
      movies: movies2000s
    },
    {
      id: '2010s',
      title: '2010s',
      subtitle: 'Franchise era',
      description: 'Superheroes and shared universes',
      period: [2010, 2019],
      color: '#9333ea',
      movies: movies2010s
    },
    {
      id: '2020s',
      title: '2020s',
      subtitle: 'Streaming shift',
      description: 'Digital releases and diverse stories',
      period: [2020, 2029],
      color: '#f59e0b',
      movies: movies2020s
    }
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        const [data1980s, data1990s, data2000s, data2010s, data2020s] = await Promise.all([
          searchMoviesByPeriod(1980, 1989),
          searchMoviesByPeriod(1990, 1999),
          searchMoviesByPeriod(2000, 2009),
          searchMoviesByPeriod(2010, 2019),
          searchMoviesByPeriod(2020, 2029)
        ]);

        setMovies1980s(data1980s.slice(0, 3));
        setMovies1990s(data1990s.slice(0, 3));
        setMovies2000s(data2000s.slice(0, 3));
        setMovies2010s(data2010s.slice(0, 3));
        setMovies2020s(data2020s.slice(0, 3));
      } catch (error) {
        console.error('Error fetching thematic movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="thematic-journeys">
        <h2 className="section-title">Dönem Sineması</h2>
        <div className="loading-placeholder">Loading...</div>
      </section>
    );
  }

  return (
    <section className="thematic-journeys">
      <h2 className="section-title">Dönem Sineması</h2>
      <div className="journeys-container">
        {journeys.map((journey) => (
          <div 
            key={journey.id} 
            className="journey-card"
            style={{ backgroundColor: journey.color }}
          >
            <div className="journey-header">
              <h3 className="journey-title">{journey.title}</h3>
              <h4 className="journey-subtitle">{journey.subtitle}</h4>
              <p className="journey-description">{journey.description}</p>
            </div>
            
            <div className="journey-movies">
              {journey.movies.map((movie, index) => (
                <div key={movie.movie_id || index} className="movie-poster">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                      alt={movie.title}
                      className="poster-image"
                    />
                  ) : (
                    <div className="poster-placeholder">
                      <span>🎬</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="journey-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PeriodCinema;

