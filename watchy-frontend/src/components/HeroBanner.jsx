import React, { useState } from 'react';
import './HeroBanner.css';
import logo from '../assets/logo.png';

const HeroBanner = ({ title, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogin = () => {
    // Login işlemi için handler
    console.log('Login clicked');
    // TODO: Login modal veya sayfasına yönlendirme
  };

  // Başlıktaki "en iyileri" kısmını vurgula
  const highlightTitle = (text) => {
    const parts = text.split('en iyileri');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="hero-highlight">en iyileri</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <section className="hero-banner">
      {/* Projeksiyon ışığı */}
      <div className="projector-light"></div>
      
      {/* Sinema koltukları silüeti */}
      <div className="cinema-seats"></div>
      
      {/* Film şeritleri */}
      <div className="film-strip-left"></div>
      <div className="film-strip-right"></div>

      {/* Ana içerik - glassmorphism container */}
      <div className="hero-content-container">
        {/* Üst kısım: Logo ve Login */}
        <div className="hero-header">
          {/* Logo */}
          <div className="hero-logo-container">
            <img src={logo} alt="Watchy" className="hero-logo" />
          </div>

          {/* Login butonu */}
          <button className="hero-login-button" onClick={handleLogin}>
            Giriş Yap
          </button>
        </div>

        {/* Orta kısım: Başlık ve Arama (ortalanmış) */}
        <div className="hero-center-content">
          {/* Başlık */}
          <div className="hero-title">
            <h1>{highlightTitle(title)}</h1>
          </div>
          
          {/* Arama kutusu */}
          <div className="hero-search-container">
            <div className="hero-search-box">
              <input
                type="text"
                className="hero-search-input"
                placeholder="Film adı girin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="hero-search-button" onClick={handleSearch}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;