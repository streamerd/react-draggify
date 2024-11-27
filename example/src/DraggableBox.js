import React from 'react';

const styles = {
  box: {
    padding: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
  }
};

function DraggableBox() {
  return (
    <div style={styles.box}>
      <h3>Drag Me!</h3>
      <p>I'm a draggable box</p>
    </div>
  );
}

export default DraggableBox;