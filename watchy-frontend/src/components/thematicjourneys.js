
import { useEffect, useMemo, useState } from 'react';
import './thematicjourneys.css';
import { searchMoviesByPeriod } from '../services/api';

const DECADE_CONFIGS = [
  {
    id: '1960s',
    title: "1960'lar: Tiffany'de Kahvaltı ve Hitchcock'un Gerilimi",
    subtitle:"",

    description: "",   period: [1960, 1969],
    color: '#7c3aed'
  },
  {
    id: '1970s',
    title: "1970'ler: Baba'nın Teklifi ve Galaksinin Yeni Umudu",
    subtitle:
    "",
    description: "",    period: [1970, 1979],
    color: '#db2777'
  },
  {
    id: '1980s',
    title: "1980'ler: Flux Kapasitörlü Neon Rüyası",
    subtitle:
      "",
    description:
      "",
    period: [1980, 1989],
    color: '#2563eb'
  },
  {
    id: '1990s',
    title: "1990'lar: Dinozorlar, Buzda Güller ve Dijital Rüyalar",
    subtitle:
      "",
    description:
      "",
    period: [1990, 1999],
    color: '#16a34a'
  },
  {
    id: '2000s',
    title: "2000'ler: Orta Dünya, Hogwarts ve Karayip Dalgalanmaları",
    subtitle:
      "",
    description:
      "",
    period: [2000, 2009],
    color: '#dc2626'
  },
  {
    id: '2010s',
    title: "2010'lar: Sonsuzluk Eldiveni ve Rüya Katmanları",
    subtitle:
      "",
    description:
      "",
    period: [2010, 2019],
    color: '#f97316'
  },
  {
    id: '2020s',
    title: "2020'ler: Kum Fırtınaları, Multiverseler ve Pembeli Devrim",
    subtitle:
      "",
    description: "",
    period: [2020, 2029],
    color: '#0ea5e9'
  }
];

const ThematicJourneys = () => {
  const [moviesByDecade, setMoviesByDecade] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const responses = await Promise.all(
          DECADE_CONFIGS.map(({ period }) =>
            searchMoviesByPeriod(period[0], period[1])
          )
        );

        const normalized = responses.reduce((acc, movies, index) => {
          const decadeId = DECADE_CONFIGS[index].id;
          acc[decadeId] = Array.isArray(movies) ? movies.slice(0, 3) : [];
          return acc;
        }, {});

        setMoviesByDecade(normalized);
      } catch (error) {
        console.error('Error fetching thematic movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const journeys = useMemo(
    () =>
      DECADE_CONFIGS.map((config) => ({
        ...config,
        movies: moviesByDecade[config.id] || []
      })),
    [moviesByDecade]
  );

  if (loading) {
    return (
      <section className="thematic-journeys">
        <h2 className="section-title">Dönem Sineması</h2>
        <div className="loading-placeholder">Filmler makaraya sarılıyor...</div>
      </section>
    );
  }

  return (
    <section className="thematic-journeys">
      <h2 className="section-title">Tematik Yolculuklar</h2>
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

export default ThematicJourneys;
