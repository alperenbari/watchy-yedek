import React from 'react';
import './DirectorsCinema.css';

const DirectorsCinema = () => {
  // Şimdilik statik veri, sonra API'dan çekeceğiz
  const directors = [
    {
      id: 1,
      name: 'Metin Erksan',
      filmCount: '5 films',
      avatar: 'https://via.placeholder.com/60x60/333/fff?text=ME'
    },
    {
      id: 2,
      name: 'Zeki Demkubuz',
      filmCount: '11 films',
      avatar: 'https://via.placeholder.com/60x60/333/fff?text=ZD'
    },
    {
      id: 3,
      name: 'Şerif Göran',
      filmCount: '3 films',
      avatar: 'https://via.placeholder.com/60x60/333/fff?text=SG'
    }
  ];

  return (
    <section className="directors-cinema">
      <div className="directors-header">
        <h2 className="section-title">Director's Cinema</h2>
        <button className="explore-button">
          Explore →
        </button>
      </div>
      
      <div className="directors-container">
        {directors.map((director) => (
          <div key={director.id} className="director-card">
            <div className="director-avatar">
              <img src={director.avatar} alt={director.name} />
            </div>
            <div className="director-info">
              <h3 className="director-name">{director.name}</h3>
              <p className="director-film-count">{director.filmCount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DirectorsCinema;