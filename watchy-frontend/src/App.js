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
    <div className="App" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      {/* Sinematik HeroBanner */}
      <HeroBanner
        title="Tüm platformlarda sinemanın en iyileri!"
        onSearch={handleHeroSearch}
      />

      <ThematicJourneys onContentChange={resetResults} />

      {/* Yükleniyor durumu */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#888'
        }}>
          <p>Yükleniyor...</p>
        </div>
      )}

      {/* Sonuçlar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <ResultList
          searchResults={searchResults}
          platforms={platforms}
          hasCompletedSearch={hasCompletedSearch}
        />
      </div>
    </div>
  );
}

export default App;
