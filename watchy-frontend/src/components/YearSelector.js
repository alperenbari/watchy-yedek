
import React from 'react';

function YearSelector({ selectedDecade, selectedYear, onSelectYear }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ color: '#aaa' }}>{selectedDecade}'ler içinden yıl seçin:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {Array.from({ length: 10 }, (_, i) => selectedDecade + i).map((year) => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              backgroundColor: selectedYear === year ? '#00BFFF' : '#333',
              color: 'white',
              border: '1px solid #666',
              cursor: 'pointer',
              minWidth: '50px'
            }}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}

export default YearSelector;
