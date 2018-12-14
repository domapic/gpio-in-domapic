const test = require('narval')

const GpioHandlerMocks = require('./lib/GpioHandler.mocks')

test.describe('index', () => {
  let gpioHandler
  let index

  test.before(() => {
    gpioHandler = new GpioHandlerMocks()
    index = require('../index')
  })

  test.after(() => {
    gpioHandler.restore()
  })

  test.it('should return GpioHandler', () => {
    test.expect(index.Gpio).to.equal(gpioHandler.stubs.Constructor)
  })
})
