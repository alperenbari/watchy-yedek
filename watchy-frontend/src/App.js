import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';
import HeroBanner from './components/HeroBanner';
import ThematicJourneys from './components/thematicjourneys';

function App() {
  const [showThematicJourneys, setShowThematicJourneys] = useState(false);
  const thematicSectionRef = useRef(null);
  const [showPeopleSections, setShowPeopleSections] = useState(false);
  const peopleSectionRef = useRef(null);
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

  const scrollToPeopleSection = () => {
    if (peopleSectionRef.current) {
      peopleSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilmsClick = () => {
    if (showThematicJourneys) {
      scrollToThematicSection();
      return;
    }

    setShowThematicJourneys(true);
  };

  const handlePeopleClick = () => {
    if (!showThematicJourneys) {
      setShowThematicJourneys(true);
    }

    if (!showPeopleSections) {
      setShowPeopleSections(true);
      return;
    }

    scrollToPeopleSection();
  };

  useEffect(() => {
    if (showThematicJourneys) {
      scrollToThematicSection();
    }
  }, [showThematicJourneys]);

  useEffect(() => {
    if (showThematicJourneys && showPeopleSections) {
      scrollToPeopleSection();
    }
  }, [showThematicJourneys, showPeopleSections]);

  return (
    <div className="App">
      {/* Sinematik HeroBanner */}
      <HeroBanner
        title="Sadece İZLENEBİLİR ve EN İYİ içerikler!"
        onSearch={handleHeroSearch}
        onFilmsClick={handleFilmsClick}
        onPeopleClick={handlePeopleClick}
      />

      <div className="app-main">
        {!hasCompletedSearch && showThematicJourneys && (
          <div id="filmler" ref={thematicSectionRef}>
            <ThematicJourneys
              onContentChange={resetResults}
              showPeopleSections={showPeopleSections}
              peopleSectionRef={peopleSectionRef}
            />
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
