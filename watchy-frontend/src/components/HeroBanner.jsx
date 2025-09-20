import React, { useEffect, useRef, useState } from 'react';
import './HeroBanner.css';
import logo from '../assets/logo.png';
import { searchMovies } from '../services/api';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

const HeroBanner = ({ title, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const blurTimeoutRef = useRef(null);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery || !onSearch) {
      return;
    }

    onSearch({ query: trimmedQuery });
    setSearchQuery(trimmedQuery);
    setSuggestions([]);
    setIsSuggestionOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim().length >= 2) {
      setIsSuggestionOpen(true);
    } else {
      setIsSuggestionOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2 && (suggestions.length || isLoadingSuggestions)) {
      setIsSuggestionOpen(true);
    }
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsSuggestionOpen(false);
    }, 150);
  };

  const handleSuggestionSelect = (movie) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    setSearchQuery(movie.title);
    setSuggestions([]);
    setIsSuggestionOpen(false);

    if (onSearch) {
      onSearch({ query: movie.title, movie });
    }
  };

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    let isActive = true;
    setIsLoadingSuggestions(true);

    const debounceId = setTimeout(async () => {
      try {
        const results = await searchMovies(trimmed);

        if (!isActive) {
          return;
        }

        setSuggestions(results.slice(0, 6));
      } catch (error) {
        if (isActive) {
          console.error('Öneriler alınamadı:', error);
          setSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(debounceId);
    };
  }, [searchQuery]);

  useEffect(() => () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

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
        <div className="hero-top-row">
          {/* Logo */}
          <div className="hero-logo-container">
            <img src={logo} alt="Watchy" className="hero-logo" />
          </div>

          {/* Başlık ve Arama */}
          <div className="hero-center-stack">
            <div className="hero-title">
              <h1>{highlightTitle(title)}</h1>
            </div>

            <div className="hero-search-container">
              <div className="hero-search-box">
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Film adı girin..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <button className="hero-search-button" onClick={handleSearch}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </svg>
                </button>
                {isSuggestionOpen && (
                  <div className="hero-suggestions">
                    {isLoadingSuggestions && (
                      <div className="hero-suggestions-empty">Filmler aranıyor...</div>
                    )}

                    {!isLoadingSuggestions && suggestions.length === 0 && (
                      <div className="hero-suggestions-empty">Uygun film bulunamadı.</div>
                    )}

                    {!isLoadingSuggestions && suggestions.map((movie) => {
                      const posterUrl = movie.poster_path
                        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                        : null;

                      const releaseYear = movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : null;

                      return (
                        <button
                          key={movie.movie_id}
                          type="button"
                          className="hero-suggestion-item"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSuggestionSelect(movie)}
                        >
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={movie.title}
                              className="hero-suggestion-image"
                            />
                          ) : (
                            <div className="hero-suggestion-placeholder">
                              {movie.title?.[0] ?? '?'}
                            </div>
                          )}
                          <div className="hero-suggestion-info">
                            <span className="hero-suggestion-title">{movie.title}</span>
                            {releaseYear && (
                              <span className="hero-suggestion-meta">{releaseYear}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Login butonu */}
          <button className="hero-login-button" onClick={handleLogin}>
            Giriş Yap
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
