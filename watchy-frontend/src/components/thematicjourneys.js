import React, { useState, useEffect } from 'react';
import './ThematicJourneys.css';
import { searchMoviesByPeriod } from '../services/api';

const ThematicJourneys = () => {
  const [movies1980s, setMovies1980s] = useState([]);
  const [movies1990s, setMovies1990s] = useState([]);
  const [movies2000s, setMovies2000s] = useState([]);
  const [loading, setLoading] = useState(true);

  const journeys = [
    {
      id: '1980s',
      title: "1980'ler: Geleceğe Dönüş Seansı",
      subtitle: "Marty McFly 'zamanda ayarları' yaparken Venkman proton paketini kuşandı",
      description:
        "Ecto-1 sokağa park edip Delorean'ın kapısını açıyoruz; Ghostbusters'tan Top Gun'ın 'Need for Speed' repliğine, Breakfast Club'ın kütüphanesinde kahkahalar eşliğinde Michael J. Fox'la dans ediyoruz!",
      period: [1980, 1989],
      color: '#2563eb',
      movies: movies1980s
    },
    {
      id: '1990s',
      title: "1990'lar: Dinozorlar, Gemiler ve Kırmızı Haplar",
      subtitle: "Dr. Grant 'Koş!' derken Jack 'Bırakmam' diye tutunuyor",
      description:
        "Jurassic Park'ın velociraptor kovalamacasını Titanic'in pruva sahnesine taşıyor, Neo'ya kırmızı hapı uzatıp Will Smith'in 'Men in Black' göz kırpmasıyla geceyi tamamlıyoruz; 90'lar Hollywood'u ekranınıza akıyor!",
      period: [1990, 1999],
      color: '#16a34a',
      movies: movies1990s
    },
    {
      id: '2000s',
      title: "2000'ler: Yüzük, Asalar ve Karayip Meltemi",
      subtitle: "Gandalf 'Bu geçit yasak!' derken Jack Sparrow pusulasını şaşırttı",
      description:
        "Yüzüklerin Efendisi'nde Shire'dan çıkıp Hogwarts Ekspresi'ne atlıyor, Karayip Korsanları'nın güvertesinde 'Hepimiz biraz rum isteriz' diye şakalaşırken Peter Parker'ın 'Büyük güç...' öğüdüyle macerayı tamamlıyoruz!",
      period: [2000, 2009],
      color: '#dc2626',
      movies: movies2000s
    }
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        const [data1980s, data1990s, data2000s] = await Promise.all([
          searchMoviesByPeriod(1980, 1989),
          searchMoviesByPeriod(1990, 1999),
          searchMoviesByPeriod(2000, 2009)
        ]);

        setMovies1980s(data1980s.slice(0, 3));
        setMovies1990s(data1990s.slice(0, 3));
        setMovies2000s(data2000s.slice(0, 3));
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
