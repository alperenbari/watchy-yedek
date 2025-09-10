import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import DiscoverMenu from './components/DiscoverMenu';
import DecadeSelector from './components/DecadeSelector';
import YearSelector from './components/YearSelector';
import ResultList from './components/ResultList';
import { useSearch } from './hooks/useSearch';

function App() {
  const {
    query, setQuery,
    searchResults,
    platforms,
    scores,
    loading,
    selectedDecade, setSelectedDecade,
    selectedYear,
    showMenu, setShowMenu,
    showDecades, setShowDecades,
    decades,
    handleSearch,
    handleYearSelect
  } = useSearch();

  const handleDiscoverSelect = (section) => {
    if (section === 'decade') {
      setShowDecades(true);
    } else {
      setShowDecades(false);
    }
    setShowMenu(false);
  };

  return (
    <div className="App" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #333',
        paddingBottom: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: '10px 14px',
                fontSize: '15px',
                backgroundColor: '#222',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Keşfet ▾
            </button>
            {showMenu && <DiscoverMenu onSelect={handleDiscoverSelect} />}
          </div>
        </div>
      </div>

      {showDecades && (
        <>
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
        </>
      )}

      {loading && <p>Yükleniyor...</p>}

      <ResultList
        searchResults={searchResults}
        platforms={platforms}
        scores={scores}
      />
    </div>
  );
}

export default App;

