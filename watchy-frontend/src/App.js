import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import DecadeSelector from './components/DecadeSelector';
import YearSelector from './components/YearSelector';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';
import HeroBanner from './components/HeroBanner';

function App() {
  const {
    query, setQuery,
    searchResults,
    platforms,
    scores,
    loading,
    selectedDecade, setSelectedDecade,
    selectedYear,
    showDecades, setShowDecades,
    decades,
    handleSearch,
    handleYearSelect
  } = useSearch();

  // HeroBanner'dan gelen arama işlemi
  const handleHeroSearch = (searchQuery) => {
    setQuery(searchQuery);
    handleSearch(searchQuery);
  };

  // Dönem seçimi
  const handleShowDecades = () => {
    setShowDecades(!showDecades);
  };

  return (
    <div className="App" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      {/* Sinematik HeroBanner */}
      <HeroBanner 
        title="Tüm platformlarda sinemanın en iyileri!" 
        onSearch={handleHeroSearch}
      />
      
      {/* Alt kısımdaki ikincil arama ve dönem seçici */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        marginTop: '30px',
        maxWidth: '1200px',
        margin: '30px auto 24px',
        padding: '0 20px'
      }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar 
            query={query} 
            setQuery={setQuery} 
            onSearch={() => handleSearch(query)} 
          />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleShowDecades}
            style={{
              padding: '10px 20px',
              fontSize: '15px',
              backgroundColor: showDecades ? '#00ff88' : '#222',
              color: showDecades ? '#0a0a0a' : 'white',
              border: '1px solid #555',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Dönem Filmleri {showDecades ? '✕' : '▾'}
          </button>
        </div>
      </div>

      {/* Dönem seçiciler */}
      {showDecades && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <DecadeSelector
            decades={decades}
            selectedDecade={selectedDecade}
            onSelectDecade={setSelectedDecade}
          />
          {selectedDecade && (
            <YearSelector
              selectedDecade={selectedDecade}
              selectedYear={selectedYear}
              onSelectYear={handleYearSelect}
            />
          )}
        </div>
      )}

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