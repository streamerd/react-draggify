import React from 'react';
import { WindowManagerProvider, withWindow } from 'react-draggify';
import './App.css';

// Example windows
const Window1 = () => (
  <div className="window-content">
    <h2>Window 1</h2>
    <p>This is an auto-positioned window</p>
  </div>
);

const Window2 = () => (
  <div className="window-content">
    <h2>Window 2</h2>
    <p>This window has a fixed position</p>
  </div>
);

const Window3 = () => (
  <div className="window-content">
    <h2>Window 3</h2>
    <p>Another auto-positioned window</p>
  </div>
);

// Create draggable versions of our windows
const DraggableWindow1 = withWindow(Window1);
const DraggableWindow2 = withWindow(Window2);
const DraggableWindow3 = withWindow(Window3);

function App() {
  return (
    <WindowManagerProvider>
      <div className="app">
        <h1>React Draggify Demo</h1>
        <div className="windows-container">
          <DraggableWindow1 pos="auto" />
          <DraggableWindow2 pos={4} />
          <DraggableWindow3 pos="auto" />
        </div>
      </div>
    </WindowManagerProvider>
  );
}

export default App;