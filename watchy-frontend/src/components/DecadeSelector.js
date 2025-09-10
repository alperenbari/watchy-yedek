
import React from 'react';

function DecadeSelector({ decades, selectedDecade, onSelectDecade }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{ color: '#ccc' }}>Dönem Seçin:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {decades.map((decade) => (
          <button
            key={decade}
            onClick={() => onSelectDecade(decade)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: selectedDecade === decade ? '#00BFFF' : '#222',
              color: 'white',
              border: '1px solid #555',
              cursor: 'pointer'
            }}
          >
            {decade}'ler
          </button>
        ))}
      </div>
    </div>
  );
}

export default DecadeSelector;
