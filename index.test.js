/* global test, expect */

const BigRender = require('./index')
const Canvas = require('canvas')

test('exposes drawing functions', () => {
  const big = new BigRender()
  expect(typeof big.lineTo).toBe('function')
})

test('draw a square', () => {
  // known good
  const canvas1 = new Canvas(200, 200)
  const ctx1 = canvas1.getContext('2d')
  ctx1.fillRect(0, 0, 150, 75)

  // hopefuly good
  const big = new BigRender()
  big.fillRect(0, 0, 150, 75)
  const canvas2 = new Canvas(200, 200)
  const ctx2 = canvas2.getContext('2d')
  big.render(ctx2)

  // compare
  expect(true).toBe(false)
})
