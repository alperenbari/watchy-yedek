
import React from 'react';

function SearchBar({ query, setQuery, onSearch }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Film adı girin..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '10px 16px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '1px solid #555',
          backgroundColor: '#222',
          color: '#fff',
          minWidth: '260px'
        }}
      />
      <button
        onClick={onSearch}
        style={{
          padding: '10px 18px',
          fontSize: '16px',
          borderRadius: '6px',
          backgroundColor: '#00BFFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Ara
      </button>
    </div>
  );
}

export default SearchBar;
