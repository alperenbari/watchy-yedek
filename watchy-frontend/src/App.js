import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';
import HeroBanner from './components/HeroBanner';
import ThematicJourneys from './components/thematicjourneys';

function App() {
  const [showThematicJourneys, setShowThematicJourneys] = useState(false);
  const thematicSectionRef = useRef(null);
  const {
    searchResults,
    platforms,
    loading,
    hasCompletedSearch,
    handleSearch,
    resetResults
  } = useSearch();

  // HeroBanner'dan gelen arama işlemi
  const handleHeroSearch = (searchPayload) => {
    handleSearch(searchPayload);
  };

  const scrollToThematicSection = () => {
    if (thematicSectionRef.current) {
      thematicSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilmsClick = () => {
    if (showThematicJourneys) {
      scrollToThematicSection();
      return;
    }

    setShowThematicJourneys(true);
  };

  useEffect(() => {
    if (showThematicJourneys) {
      scrollToThematicSection();
    }
  }, [showThematicJourneys]);

  return (
    <div className="App">
      {/* Sinematik HeroBanner */}
      <HeroBanner
        title="Sadece İZLENEBİLİR ve EN İYİ içerikler!"
        onSearch={handleHeroSearch}
        onFilmsClick={handleFilmsClick}
      />

      <div className="app-main">
        {!hasCompletedSearch && showThematicJourneys && (
          <div id="filmler" ref={thematicSectionRef}>
            <ThematicJourneys onContentChange={resetResults} />
          </div>
        )}

        {/* Yükleniyor durumu */}
        {loading && (
          <div className="app-loading">
            <p>Yükleniyor...</p>
          </div>
        )}

        {/* Sonuçlar */}
        <div className="app-results-container">
          <ResultList
            searchResults={searchResults}
            platforms={platforms}
            hasCompletedSearch={hasCompletedSearch}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
