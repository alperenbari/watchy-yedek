import React from 'react';
import './FreeYouTubeMovies.css';

const FreeYouTubeMovies = () => {
  // Şimdilik statik veri, sonra API'dan çekeceğiz
  const youtubeMovies = [
    {
      id: 1,
      title: 'Neşeli Günler',
      filmCount: '6 films',
      thumbnail: 'https://via.placeholder.com/200x300/dc2626/fff?text=NG'
    },
    {
      id: 2,
      title: 'Zeki Demkubuz',
      filmCount: '11 films',
      thumbnail: 'https://via.placeholder.com/200x300/16a34a/fff?text=ZD'
    },
    {
      id: 3,
      title: 'Şerif Göran',
      filmCount: '8 films',
      thumbnail: 'https://via.placeholder.com/200x300/2563eb/fff?text=SG'
    },
    {
      id: 4,
      title: 'Masumiyet',
      filmCount: '3 films',
      thumbnail: 'https://via.placeholder.com/200x300/7c3aed/fff?text=M'
    },
    {
      id: 5,
      title: 'Bizim Aile',
      filmCount: '8 films',
      thumbnail: 'https://via.placeholder.com/200x300/ea580c/fff?text=BA'
    }
  ];

  return (
    <section className="free-youtube-movies">
      <h2 className="section-title">Free Movies on YouTube</h2>
      
      <div className="youtube-movies-container">
        {youtubeMovies.map((movie) => (
          <div key={movie.id} className="youtube-movie-card">
            <div className="movie-thumbnail">
              <img src={movie.thumbnail} alt={movie.title} />
              <div className="play-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-film-count">{movie.filmCount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreeYouTubeMovies;