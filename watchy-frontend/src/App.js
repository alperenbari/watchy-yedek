import React from 'react';
import './App.css';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';
import HeroBanner from './components/HeroBanner';
import ThematicJourneys from './components/thematicjourneys';

function App() {
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

  return (
    <div className="App">
      {/* Sinematik HeroBanner */}
      <HeroBanner
        title="Sadece İZLENEBİLİR ve EN İYİ içerikler!"
        onSearch={handleHeroSearch}
      />

      <div className="app-main">
        {!hasCompletedSearch && <ThematicJourneys onContentChange={resetResults} />}

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
