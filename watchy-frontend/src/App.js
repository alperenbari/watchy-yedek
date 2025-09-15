import React from 'react';
import './App.css';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';
import HeroBanner from './components/HeroBanner';
import PeriodCinema from './components/thematic_journeys';

function App() {
  const {
    query, setQuery,
    searchResults,
    platforms,
    scores,
    loading,
    handleSearch
  } = useSearch();

  // HeroBanner'dan gelen arama işlemi
  const handleHeroSearch = (searchQuery) => {
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  return (
    <div className="App" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      {/* Sinematik HeroBanner */}
      <HeroBanner
        title="Tüm platformlarda sinemanın en iyileri!"
        onSearch={handleHeroSearch}
      />

      <PeriodCinema />

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
          scores={scores}
        />
      </div>
    </div>
  );
}

export default App;
