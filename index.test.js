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
  const canvas2 = new Canvas(200, 200)
  const ctx2 = canvas2.getContext('2d')
  const big = new BigRender()
  big.fillRect(0, 0, 150, 75)
  big.render(ctx2)

  // compare
  expect(canvas2.toDataURL()).toBe(canvas1.toDataURL())
})

test('draw an offset square', () => {
  // known good
  const canvas1 = new Canvas(200, 200)
  const ctx1 = canvas1.getContext('2d')
  ctx1.fillRect(50, 50, 100, 100)

  // hopefuly good
  const canvas2 = new Canvas(200, 200)
  const ctx2 = canvas2.getContext('2d')
  const big = new BigRender()
  big.fillRect(5050, 5050, 100, 100)
  big.render(ctx2, 5000, 5000)

  // compare
  expect(canvas2.toDataURL()).toBe(canvas1.toDataURL())
})
