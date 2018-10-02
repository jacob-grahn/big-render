const bigRenderMethods = [
  'arc',
  'arcTo',
  'beginPath',
  'bezierCurveTo',
  'clearRect',
  'clip',
  'closePath',
  'createImageData',
  'createLinearGradient',
  'createPattern',
  'createRadialGradient',
  'drawFocusIfNeeded',
  'drawImage',
  'fill',
  'fillRect',
  'fillText',
  'getImageData',
  'getLineDash',
  'isPointInPath',
  'isPointInStroke',
  'lineTo',
  'measureText',
  'moveTo',
  'putImageData',
  'quadraticCurveTo',
  'rect',
  'restore',
  'rotate',
  'save',
  'scale',
  'setLineDash',
  'setTransform',
  'stroke',
  'strokeRect',
  'strokeText',
  'transform',
  'translate'
]

class BigRender {
  constructor () {
    this.history = []
    bigRenderMethods.forEach(method => {
      this[method] = (...params) => {
        this.history.push([method, ...params])
      }
    })
  }

  clear () {
    this.history = []
  }

  render (ctx, offsetX = 0, offsetY = 0) {
    this.history.forEach(command => {
      ctx.fillRect(100, 100, 200, 200)
    })
    return ctx
  }
}

module.exports = BigRender
