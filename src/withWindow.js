import React, { useState, useEffect } from 'react';
import { useWindowManager } from './WindowManager';

const WithWindow = ({ pos, ...props }) => {
  const { getAutoPosition } = useWindowManager();
  const [position, setPosition] = useState(null);
  
  useEffect(() => {
    if (pos === 'auto') {
      const autoPos = getAutoPosition(props.id);
      setPosition(autoPos);
    } else {
      setPosition(pos);
    }
  }, [pos, props.id, getAutoPosition]);

  // ... rest of the component
};

export default WithWindow; 