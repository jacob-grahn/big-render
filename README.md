# Big Render
Draw to a virtual canvas that uses a minimal amount of memory, and has no size constraints.
Portions of the virtual canvas can then be rendered to a real canvas as needed.

## Installation
```bash
npm install big-render
```

## Quickstart
```javascript
  // draw some big things
  const big = new BigRender()
  big.fillRect(0, 0, 5000, 100)
  big.fillRect(2000, 200, 5000, 100)

  // render a portion to a canvas
  const offsetX = 2000
  const offsetY = 0
  big.render(someCanvas.getContext('2d'), offsetX, offsetY)
```
