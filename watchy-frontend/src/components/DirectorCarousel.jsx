import React from 'react';

const DIRECTORS = [
  { name: 'Nuri Bilge Ceylan' },
  { name: 'Zeki Demirkubuz' },
  { name: 'Yılmaz Güney' },
  { name: 'Çağan Irmak' }
];

const DirectorCarousel = () => {
  return (
    <section style={{ padding: '40px 20px' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'left' }}>Yönetmen Sineması</h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {DIRECTORS.map((d, idx) => (
          <div key={idx} style={{
            minWidth: '160px',
            backgroundColor: '#222',
            padding: '16px',
            borderRadius: '10px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#444',
              borderRadius: '50%',
              margin: '0 auto 10px'
            }} />
            <p>{d.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DirectorCarousel;