
import { useEffect, useMemo, useState } from 'react';
import './thematicjourneys.css';
import { searchMoviesByPeriod } from '../services/api';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w185';

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
  const [expandedDecade, setExpandedDecade] = useState(null);
  const [detailMovies, setDetailMovies] = useState({});
  const [detailLoadingDecade, setDetailLoadingDecade] = useState(null);
  const [detailError, setDetailError] = useState(null);

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

  const handleJourneySelect = async (journey) => {
    if (!journey) return;

    if (expandedDecade === journey.id) {
      setExpandedDecade(null);
      setDetailError(null);
      return;
    }

    setExpandedDecade(journey.id);
    setDetailError(null);

    if (detailMovies[journey.id]) {
      return;
    }

    try {
      setDetailLoadingDecade(journey.id);
      const movies = await searchMoviesByPeriod(journey.period[0], journey.period[1]);

      const formattedMovies = (Array.isArray(movies) ? movies : [])
        .slice(0, 12)
        .map((movie) => ({
          id: movie.movie_id || movie.id,
          title: movie.title,
          posterUrl: movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null,
          director: movie.director || null,
          cast: Array.isArray(movie.cast) ? movie.cast.slice(0, 3) : [],
          releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : null
        }));

      setDetailMovies((prev) => ({
        ...prev,
        [journey.id]: formattedMovies
      }));
    } catch (error) {
      console.error('Error fetching decade highlights:', error);
      setDetailError('Bu dönemin popüler filmleri alınırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDetailLoadingDecade(null);
    }
  };

  const handleKeyPress = (event, journey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleJourneySelect(journey);
    }
  };

  const activeJourney = useMemo(
    () => journeys.find((journey) => journey.id === expandedDecade) || null,
    [expandedDecade, journeys]
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
            className={`journey-card${expandedDecade === journey.id ? ' journey-card--active' : ''}`}
            style={{ backgroundColor: journey.color }}
            onClick={() => handleJourneySelect(journey)}
            onKeyDown={(event) => handleKeyPress(event, journey)}
            role="button"
            tabIndex={0}
            aria-expanded={expandedDecade === journey.id}
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

      {activeJourney && (
        <div className="journey-detail-panel">
          <div className="journey-detail-header">
            <div className="journey-detail-headline">
              <span className="journey-detail-years">
                {activeJourney.period[0]} – {activeJourney.period[1]}
              </span>
              <h3 className="journey-detail-title">{activeJourney.title}</h3>
              <p className="journey-detail-subtitle">{activeJourney.subtitle}</p>
            </div>

            <button
              type="button"
              className="journey-detail-close"
              onClick={() => {
                setExpandedDecade(null);
                setDetailError(null);
              }}
            >
              Kapat
            </button>
          </div>

          <p className="journey-detail-description">{activeJourney.description}</p>

          {detailLoadingDecade === activeJourney.id ? (
            <div className="journey-detail-loading">Hollywood spotları açılıyor...</div>
          ) : detailError ? (
            <div className="journey-detail-error">{detailError}</div>
          ) : (detailMovies[activeJourney.id] || []).length === 0 ? (
            <div className="journey-detail-empty">Bu dönem için film bulunamadı.</div>
          ) : (
            <div className="detail-movie-list">
              {(detailMovies[activeJourney.id] || []).map((movie) => (
                <article key={movie.id} className="detail-movie-card">
                  <div className="detail-movie-poster">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} />
                    ) : (
                      <div className="detail-movie-placeholder" aria-hidden="true">
                        🎞️
                      </div>
                    )}
                  </div>

                  <div className="detail-movie-meta">
                    <h4 className="detail-movie-title">
                      {movie.title}
                      {movie.releaseYear ? <span className="detail-movie-year"> ({movie.releaseYear})</span> : null}
                    </h4>
                    <p className="detail-movie-director">
                      {movie.director ? `Yönetmen: ${movie.director}` : 'Yönetmen bilgisi bulunamadı'}
                    </p>
                    {movie.cast.length > 0 && (
                      <p className="detail-movie-cast">
                        Başroller: {movie.cast.join(', ')}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ThematicJourneys;
