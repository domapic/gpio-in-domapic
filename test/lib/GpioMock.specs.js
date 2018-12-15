const EventEmitter = require('events')

const test = require('narval')

const GpioMock = require('../../lib/GpioMock')

test.describe('Gpio Mock', () => {
  test.describe('status getter', () => {
    test.it('should return false', () => {
      const gpioMock = new GpioMock()
      test.expect(gpioMock.status).to.equal(false)
    })
  })

  test.describe('events getter', () => {
    test.it('should return an eventEmitter object', () => {
      const gpioMock = new GpioMock()
      test.expect(gpioMock.events).to.be.an.instanceOf(EventEmitter)
    })
  })
})
