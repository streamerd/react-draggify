# react-draggify

A React window management system that makes any component draggable and resizable within a 5x4 grid layout, with position persistence.

## Features

- 🎯 Grid-based positioning (5x4)
- 🔄 Drag and resize capabilities
- 💾 Position persistence via localStorage
- 📱 Responsive design
- 🎨 Customizable styling
- 🎮 Collision detection

## Installation

```bash
npm install react-draggify
```

## Usage

1. Wrap your app with `WindowManagerProvider`:

```jsx
import { WindowManagerProvider } from 'react-draggify';

function App() {
  return (
    <WindowManagerProvider>
      <YourComponents />
    </WindowManagerProvider>
  );
}
```

2. Make components draggable using `withWindow` HOC:

```jsx
import { withWindow } from 'react-draggify';

const YourComponent = () => (
  <div>
    <h1>Draggable Content</h1>
  </div>
);

// Make it draggable, starting at grid position 0 (top-left)
const DraggableComponent = withWindow(YourComponent);

// Use it with a specific grid position (0-19)
<DraggableComponent pos={5} />
```

## Grid System

The layout uses a 5x4 grid (20 total positions):

```
 0  1  2  3  4
 5  6  7  8  9
10 11 12 13 14
15 16 17 18 19
```

## Examples

### Basic Window

```jsx
const Window = () => (
  <div style={{ padding: '20px', background: 'white' }}>
    <h2>Draggable Window</h2>
    <p>Drag me around!</p>
  </div>
);

const DraggableWindow = withWindow(Window);

// Place at position 0 (top-left)
<DraggableWindow pos={0} />
```

### Multiple Windows

```jsx
function MultiWindowExample() {
  return (
    <div>
      <DraggableWindow pos={0} /> {/* Top left */}
      <DraggableWindow pos={4} /> {/* Top right */}
      <DraggableWindow pos={15} /> {/* Bottom left */}
    </div>
  );
}
```

### Custom Styling

```jsx
const StyledWindow = () => (
  <div style={{
    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    padding: '20px',
    borderRadius: '8px',
    color: 'white'
  }}>
    <h2>Styled Window</h2>
  </div>
);

const DraggableStyledWindow = withWindow(StyledWindow);
```

### Auto-positioning

Components can be automatically positioned using the `auto` value for the `pos` prop:

```jsx
// The component will be placed in the optimal available position
<DraggableWindow pos="auto" />

// You can still use specific positions if needed
<DraggableWindow pos={5} />
```

The auto-positioning system:
- Avoids window collisions
- Optimizes space usage
- Maintains aesthetic window arrangement
- Considers window clustering and edge positions

## API Reference

### WindowManagerProvider
The root provider that enables window management functionality.

### withWindow(Component, options)
HOC that makes a component draggable and resizable.

Props:
- `pos` (number): Initial grid position (0-19)

### useWindowManager()
Hook to access window management context.

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
