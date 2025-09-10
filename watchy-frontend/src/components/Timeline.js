
import React from 'react';

function Timeline({ selectedYear, onSelectYear }) {
  const years = Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 1980 + i);

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        padding: '10px 0',
        marginBottom: '20px',
        borderBottom: '1px solid #444'
      }}
    >
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: selectedYear === year ? '#00BFFF' : '#222',
            color: 'white',
            border: '1px solid #555',
            cursor: 'pointer',
            minWidth: '60px'
          }}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default Timeline;
