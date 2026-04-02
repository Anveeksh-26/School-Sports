import React from 'react';

const LOGO_COLORS = {
  cricket: 'var(--accent-green)',
  badminton: 'var(--accent-blue)',
  kabaddi: 'var(--accent-purple)',
  'kho-kho': 'var(--accent-yellow)'
};

const IMAGE_FILES = {
  cricket: 'cricket.png',
  badminton: 'badminton.jpg',
  kabaddi: 'kabaddi.jpg',
  'kho-kho': 'kho-kho.png'
};

export default function SportIcon({ sport, style = {} }) {
  const color = LOGO_COLORS[sport] || 'var(--text-primary)';
  const fileName = IMAGE_FILES[sport] || 'cricket.png';
  
  return (
    <img 
      src={`/icons/${fileName}`} 
      alt={`${sport} logo`}
      style={{
        display: 'inline-block',
        width: '2.2em',
        height: '2.2em',
        borderRadius: '24%',
        objectFit: 'cover',
        boxShadow: `0 6px 16px ${color}33`,
        border: `1px solid ${color}80`,
        verticalAlign: 'middle',
        background: 'rgba(0,0,0,0.5)',
        ...style
      }}
      onError={(e) => {
        // Fallback to minimal square if image somehow fails
        e.target.style.display = 'none';
      }}
    />
  );
}
