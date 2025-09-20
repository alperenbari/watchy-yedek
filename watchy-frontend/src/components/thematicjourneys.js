
import { useEffect, useMemo, useState } from 'react';
import './thematicjourneys.css';
import { searchMoviesByPeriod } from '../services/api';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w185';

const DECADE_CONFIGS = [
  {
    id: '1960s',
    title: "1960'lar: Tiffany'de Kahvaltı ve Hitchcock'un Gerilimi",
    subtitle:
      "Holly 'Ayda bir Tiffany'se gitmek ruhu sakinleştirir' derken Norman Bates 'Anne?' diye kulaklara fısıldıyor",
    description:
      "Audrey Hepburn küçük siyah elbisesiyle vitrine yaslanıp ay ışığında şanson söylerken Anthony Perkins duş perdesini aralayıp Bernard Herrmann'ın çığlık gibi yaylılarını başlatıyor; Julie Andrews Alpler'de 'Do-Re-Mi' ile yankı yaparken Sean Connery martinisini 'çalkalanmış, karıştırılmamış' diye sipariş ediyor.",
    period: [1960, 1969],
    color: '#7c3aed'
  },
  {
    id: '1970s',
    title: "1970'ler: Baba'nın Teklifi ve Galaksinin Yeni Umudu",
    subtitle:
      "Vito Corleone 'Sana reddedemeyeceğin bir teklif yapacağım' diye mırıldanırken Obi-Wan 'Kuvvet seninle olsun' diye el sallıyor",
    description:
      "Marlon Brando kedisini okşayıp aile masasını toplarken Al Pacino'nun bakışları Sicilya güneşi kadar keskin, Carrie Fisher saçlarını tarçın rulosu gibi toplarken Harrison Ford 'Han Solo, ödül avcısı değilim' diyerek Millennium Falcon'un rampasını indiriyor; Rocky merdivenleri çıkarken 'Adrian!' çığlığı Philadelphia semalarında dolaşıyor.",
    period: [1970, 1979],
    color: '#db2777'
  },
  {
    id: '1980s',
    title: "1980'ler: Flux Kapasitörlü Neon Rüyası",
    subtitle:
      "Marty 'Bu çocuklar rock'n roll'u sevecek!' diye tellendirirken Venkman 'Kimi arayacaksın?' muhabbetini patlatıyor",
    description:
      "Michael J. Fox Delorean'ı 88'e kilitlerken Doc Brown 'Great Scott!' diye saçlarını savuruyor, Bill Murray ve Sigourney Weaver proton paketlerini kuşanıp Ecto-1'in sirenini çalıyor; Maverick 'Hız ihtiyacı hissediyorum!' diye bağırırken Breakfast Club'ın kütüphanesinde Ally Sheedy ile Molly Ringwald'a detansiyon kaçamakları planlıyoruz.",
    period: [1980, 1989],
    color: '#2563eb'
  },
  {
    id: '1990s',
    title: "1990'lar: Dinozorlar, Buzda Güller ve Dijital Rüyalar",
    subtitle:
      "Dr. Grant 'Kemerlerinizi bağlayın!' diye fısıldarken Rose 'Asla bırakmam Jack' sözünü yeniden hatırlatıyor",
    description:
      "Sam Neill raptorlardan kaçarken Jeff Goldblum'un 'Hayat bir yolunu bulur' sözü kulaklarımızda yankılanıyor, Kate Winslet ile Leonardo DiCaprio pruvada 'Kendimi dünyanın kralı gibi hissediyorum!' diye bağırıyor; Morpheus kırmızı hapı uzatıp Neo'ya 'Gerçeğin çölüne hoş geldin' derken Will Smith 'Aramızdaki fark şu: ben bu takımı havalı gösteriyorum' diyerek Men in Black rozetini yakasına iliştiriyor.",
    period: [1990, 1999],
    color: '#16a34a'
  },
  {
    id: '2000s',
    title: "2000'ler: Orta Dünya, Hogwarts ve Karayip Dalgalanmaları",
    subtitle:
      "Gandalf 'Bu geçitten kimse geçemez!' diye asasıyla gürlerken Jack Sparrow 'Ben dürüst bir sahtekârım sevgilim' diye yalpalıyor",
    description:
      "Elijah Wood yüzüğü avuçlayıp Ian McKellen'a 'Yük benim' derken Legolas 'Bu da bir sayılır!' diye ok yağdırıyor, Emma Watson Hermione olarak Ron'a 'Leviyoosa, Leviyosaaa değil!' diye göz kırpıyor; Karayip Korsanları güvertesinde Johnny Depp 'Rom neden hep biter ki?' diye sızlanırken Tobey Maguire 'Büyük güçle büyük sorumluluk gelir' nasihatiyle New York ufkunu ağlarla örüyor.",
    period: [2000, 2009],
    color: '#dc2626'
  },
  {
    id: '2010s',
    title: "2010'lar: Sonsuzluk Eldiveni ve Rüya Katmanları",
    subtitle:
      "Tony 'Ve ben... Iron Man' derken Cobb dönen topacına göz ucuyla bakıyor",
    description:
      "Robert Downey Jr. evreni kurtarırken Scarlett Johansson 'Toplayın ekibi' diyor, Chris Evans 'Avengers, toplanın!' çağrısını yapıyor; Leonardo DiCaprio Paris'i origami gibi katlarken Joseph Gordon-Levitt sıfır yerçekimli koridorlarda dövüş koreografisi sergiliyor, Emma Stone ise La La Land'de 'Aşk ile sanat aynı ritimde olmalı' diye notalara basıyor.",
    period: [2010, 2019],
    color: '#f97316'
  },
  {
    id: '2020s',
    title: "2020'ler: Kum Fırtınaları, Multiverseler ve Pembeli Devrim",
    subtitle:
      "Paul Atreides 'Kum solucanına bineceğim' derken Barbie 'Kız gücüyle dünyayı renklendiriyoruz' diyor",
    description:
      "Timothée Chalamet çöl rüzgârına karşı gözlerini kısarken Zendaya 'Bu daha başlangıç' diye ufku işaret ediyor; Michelle Yeoh çoklu evrenlerde kung-fu ile vergi beyannamesi toplarken Tom Cruise F/A-18'i 'Bu sefer daha yükseğe çıkıyoruz!' diye tırmandırıyor, Margot Robbie pembe stilettosuyla Ken'e 'Bu Barbie'nin hikâyesi' diyerek sahneyi aydınlatıyor.",
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
        <h2 className="section-title">Tematik Yolculuklar</h2>
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
