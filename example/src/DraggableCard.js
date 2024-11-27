import React from 'react';

const styles = {
  card: {
    padding: '20px',
    backgroundColor: '#2196F3',
    color: 'white',
    borderRadius: '4px',
  }
};

function DraggableCard() {
  return (
    <div style={styles.card}>
      <h3>Another Window</h3>
      <p>Try resizing me!</p>
    </div>
  );
}

export default DraggableCard;