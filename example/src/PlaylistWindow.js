// PlaylistWindow.js
import React from 'react';

const styles = {
  container: {
    backgroundColor: '#282828',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    marginBottom: '20px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    color: '#b3b3b3',
    padding: '10px',
    margin: '4px 0',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: '4px',
    fontSize: '14px'
  },
  hoverEffect: {
    backgroundColor: '#404040',
    color: '#ffffff'
  }
};

function PlaylistWindow() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  
  const playlists = [
    "Daily Mix 1",
    "Workout Beats",
    "Chill Vibes",
    "Road Trip",
    "90s Hits",
    "Study Focus",
    "Party Mix",
    "Jazz Classics",
    "Feel Good Pop",
    "Rock Anthems"
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Playlists</h2>
      <ul style={styles.list}>
        {playlists.map((playlist, index) => (
          <li
            key={index}
            style={{
              ...styles.listItem,
              ...(hoveredIndex === index ? styles.hoverEffect : {})
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {playlist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistWindow;

