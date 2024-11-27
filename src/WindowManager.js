// WindowManager.js
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { findOptimalPosition } from './utils/autoPosition';

const WindowManagerContext = createContext({});
const STORAGE_KEY = 'windowManagerState';

const GRID = {
  COLUMNS: 5,
  ROWS: 4,
  CELL_WIDTH: window.innerWidth / 5,
  CELL_HEIGHT: window.innerHeight / 4
};

const calculateGridPosition = (gridIndex) => {
  const column = gridIndex % GRID.COLUMNS;
  const row = Math.floor(gridIndex / GRID.COLUMNS);
  return {
    x: column * GRID.CELL_WIDTH,
    y: row * GRID.CELL_HEIGHT
  };
};

const WindowManagerProvider = ({ children }) => {
  // Initialize state from localStorage or empty Map
  const [windows, setWindows] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return new Map(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Error loading window state:', error);
      return new Map();
    }
  });
  
  const [occupiedCells, setOccupiedCells] = useState(() => {
    const cells = new Set();
    windows.forEach(window => {
      const gridPos = Math.floor(window.pos.x / GRID.CELL_WIDTH) + 
                     Math.floor(window.pos.y / GRID.CELL_HEIGHT) * GRID.COLUMNS;
      cells.add(gridPos);
    });
    return cells;
  });

  // Save to localStorage on window state changes
  useEffect(() => {
    try {
      const serializedState = JSON.stringify(Array.from(windows.entries()));
      localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (error) {
      console.error('Error saving window state:', error);
    }
  }, [windows]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      GRID.CELL_WIDTH = window.innerWidth / GRID.COLUMNS;
      GRID.CELL_HEIGHT = window.innerHeight / GRID.ROWS;
      
      // Recalculate positions based on new grid size
      setWindows(prev => {
        const next = new Map(prev);
        next.forEach((window, id) => {
          const gridPos = Math.floor(window.pos.x / GRID.CELL_WIDTH) + 
                         Math.floor(window.pos.y / GRID.CELL_HEIGHT) * GRID.COLUMNS;
          const newPos = calculateGridPosition(gridPos);
          next.set(id, { ...window, pos: newPos });
        });
        return next;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const findNextAvailableCell = (requestedCell) => {
    if (!occupiedCells.has(requestedCell)) return requestedCell;
    
    for (let i = 0; i < GRID.COLUMNS * GRID.ROWS; i++) {
      if (!occupiedCells.has(i)) return i;
    }
    return 0;
  };

  const registerWindow = (id, gridPos = 0, initialSize = { w: 200, h: 200 }) => {
    const existingWindow = windows.get(id);
    if (existingWindow) {
      return existingWindow;
    }

    const finalPos = findNextAvailableCell(gridPos);
    const { x, y } = calculateGridPosition(finalPos);
    
    setOccupiedCells(prev => new Set([...prev, finalPos]));
    setWindows(prev => {
      const next = new Map(prev);
      next.set(id, { pos: { x, y }, size: initialSize });
      return next;
    });
    
    return { pos: { x, y }, size: initialSize };
  };

  const updateWindow = (id, updates) => {
    setWindows(prev => {
      const next = new Map(prev);
      const current = next.get(id);
      next.set(id, { ...current, ...updates });
      return next;
    });
  };

  const getAutoPosition = useCallback((windowId, size = 1) => {
    const occupiedPositions = Object.values(windows)
      .filter(w => w.id !== windowId)
      .map(w => w.pos);
      
    return findOptimalPosition(occupiedPositions, size);
  }, [windows]);

  const value = useMemo(() => ({
    windows, registerWindow, updateWindow, getAutoPosition,
  }), [windows, registerWindow, updateWindow, getAutoPosition]);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

WindowManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = {
  draggableWindow: {
    position: 'absolute',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    background: 'white',
    borderRadius: '4px',
    transition: 'box-shadow 0.2s',
  },
  dragging: {
    boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
  },
  resizeHandle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '16px',
    height: '16px',
    cursor: 'se-resize',
    backgroundColor: '#e2e2e2',
    borderRadius: '0 0 4px 0'
  }
};

const useWindowManager = () => useContext(WindowManagerContext);

const withWindow = (WrappedComponent) => {
  function DraggableComponent(props) {
    const { windows, registerWindow, updateWindow } = useWindowManager();
    const id = useRef(`window-${WrappedComponent.name || 'component'}-${props.pos || 0}`).current;
    const elementRef = useRef(null);
    const dragRef = useRef({ isDragging: false, startPos: { x: 0, y: 0 } });
    const resizeRef = useRef({ isResizing: false, startSize: { w: 0, h: 0 } });

    useEffect(() => {
      const initialData = registerWindow(id, props.pos);
      if (props.onRegister) {
        props.onRegister(id, initialData);
      }
    }, []);

    const handleMouseDown = (e) => {
      if (e.target.classList.contains('resize-handle')) {
        startResize(e);
      } else {
        startDrag(e);
      }
      e.stopPropagation();
    };

    const startDrag = (e) => {
      const windowData = windows.get(id);
      dragRef.current = {
        isDragging: true,
        startPos: {
          x: e.clientX - windowData.pos.x,
          y: e.clientY - windowData.pos.y
        }
      };
      if (elementRef.current) {
        elementRef.current.style.zIndex = 1000;
      }
    };

    const startResize = (e) => {
      const windowData = windows.get(id);
      resizeRef.current = {
        isResizing: true,
        startSize: {
          w: windowData.size.w,
          h: windowData.size.h
        },
        startPos: {
          x: e.clientX,
          y: e.clientY
        }
      };
    };

    const handleMouseMove = (e) => {
      if (dragRef.current.isDragging) {
        updateWindow(id, {
          pos: {
            x: Math.max(0, Math.min(window.innerWidth - 100,
              e.clientX - dragRef.current.startPos.x)),
            y: Math.max(0, Math.min(window.innerHeight - 100,
              e.clientY - dragRef.current.startPos.y))
          }
        });
      } else if (resizeRef.current.isResizing) {
        const dx = e.clientX - resizeRef.current.startPos.x;
        const dy = e.clientY - resizeRef.current.startPos.y;
        updateWindow(id, {
          size: {
            w: Math.max(100, Math.min(window.innerWidth - windows.get(id).pos.x,
              resizeRef.current.startSize.w + dx)),
            h: Math.max(100, Math.min(window.innerHeight - windows.get(id).pos.y,
              resizeRef.current.startSize.h + dy))
          }
        });
      }
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      resizeRef.current.isResizing = false;
      if (elementRef.current) {
        elementRef.current.style.zIndex = '';
      }
    };

    useEffect(() => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);

    const windowData = windows.get(id) || { pos: { x: 0, y: 0 }, size: { w: 200, h: 200 } };
    
    const combinedStyles = {
      ...styles.draggableWindow,
      ...(dragRef.current.isDragging ? styles.dragging : {}),
      transform: `translate(${windowData.pos.x}px, ${windowData.pos.y}px)`,
      width: `${windowData.size.w}px`,
      height: `${windowData.size.h}px`,
      cursor: dragRef.current.isDragging ? 'grabbing' : 'grab'
    };

    return (
      <div
        ref={elementRef}
        style={combinedStyles}
        onMouseDown={handleMouseDown}
      >
        <WrappedComponent {...props} />
        <div className="resize-handle" style={styles.resizeHandle} />
      </div>
    );
  }

  DraggableComponent.propTypes = {
    pos: PropTypes.number,
    onRegister: PropTypes.func
  };

  DraggableComponent.displayName = `WithWindow(${getDisplayName(WrappedComponent)})`;
  return DraggableComponent;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export { WindowManagerProvider, withWindow, useWindowManager };