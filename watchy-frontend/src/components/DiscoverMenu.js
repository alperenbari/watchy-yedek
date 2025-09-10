
import React from 'react';

function DiscoverMenu({ onSelect }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: '#111',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '8px 0',
      minWidth: '160px',
      zIndex: 99,
      boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
    }}>
      <div
        onClick={() => onSelect('decade')}
        style={{ padding: '8px 16px', color: '#eee', cursor: 'pointer', textAlign: 'left' }}
      >
        Dönem Filmleri
      </div>
      <div
        onClick={() => onSelect('genre')}
        style={{ padding: '8px 16px', color: '#eee', cursor: 'pointer', textAlign: 'left' }}
      >
        Türe Göre
      </div>
      <div
        onClick={() => onSelect('director')}
        style={{ padding: '8px 16px', color: '#eee', cursor: 'pointer', textAlign: 'left' }}
      >
        Yönetmen Sineması
      </div>
    </div>
  );
}

export default DiscoverMenu;
