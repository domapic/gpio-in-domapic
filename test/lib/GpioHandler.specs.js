const test = require('narval')

const DomapicMocks = require('../Domapic.mocks')
const GpioMocks = require('./Gpio.mocks')
const GpioMockMocks = require('./GpioMock.mocks')

test.describe('Gpio Handler', () => {
  let GpioHandler
  let gpioHandler
  let domapicMocks
  let gpioMocks
  let gpioMockMocks
  let statics

  test.beforeEach(() => {
    gpioMocks = new GpioMocks()
    gpioMockMocks = new GpioMockMocks()
    domapicMocks = new DomapicMocks()
    GpioHandler = require('../../lib/GpioHandler')
    statics = require('../../lib/statics')
  })

  test.afterEach(() => {
    domapicMocks.restore()
    gpioMocks.restore()
    gpioMockMocks.restore()
  })

  test.it('should set gpio key as "gpio" if configKey is not received', () => {
    gpioHandler = new GpioHandler(domapicMocks.stubs)
    test.expect(gpioHandler._gpioKey).to.equal('gpio')
  })

  test.it('should set gpio key if configKey is received', () => {
    gpioHandler = new GpioHandler(domapicMocks.stubs, {}, {
      gpio: 'foo-gpio'
    })
    test.expect(gpioHandler._gpioKey).to.equal('foo-gpio')
  })

  test.it('should set debounceTimeout key if debounceTimeoutKey is received', () => {
    gpioHandler = new GpioHandler(domapicMocks.stubs, {}, {
      debounceTimeout: 'foo-debounce'
    })
    test.expect(gpioHandler._debounceTimeoutKey).to.equal('foo-debounce')
  })

  test.it('should set default debounceTimeout as 10 if option is not received', () => {
    gpioHandler = new GpioHandler(domapicMocks.stubs)
    test.expect(gpioHandler._defaultDebounceTimeout).to.equal(10)
  })

  test.it('should set default initial status if option is received', () => {
    gpioHandler = new GpioHandler(domapicMocks.stubs, {
      debounceTimeout: 20
    }, {})
    test.expect(gpioHandler._defaultDebounceTimeout).to.equal(20)
  })

  test.describe('init method', () => {
    test.beforeEach(() => {
      domapicMocks.stubs.config.get.resolves(true)
    })

    test.describe('when creating new gpio handler', async () => {
      test.it('should set the gpio number from config, getting it from defined gpioKey', async () => {
        const fooGpio = 15
        const gpioKey = 'fooGpioKey'
        domapicMocks.stubs.config.get.resolves(fooGpio)
        gpioHandler = new GpioHandler(domapicMocks.stubs, {
        }, {
          gpio: gpioKey
        })
        await gpioHandler.init()
        test.expect(domapicMocks.stubs.config.get).to.have.been.calledWith(gpioKey)
        test.expect(gpioMocks.stubs.Constructor.getCall(0).args[0]).to.equal(fooGpio)
      })

      test.describe('when has a debounceTimeout configuration key defined', () => {
        test.it('should set the debounceTimeout option from config, getting it from defined debounceTimeout key', async () => {
          const fooValue = 20
          const key = 'fooDebounceTimeoutKey'
          domapicMocks.stubs.config.get.resolves(fooValue)
          gpioHandler = new GpioHandler(domapicMocks.stubs, {
          }, {
            debounceTimeout: key
          })
          await gpioHandler.init()
          test.expect(domapicMocks.stubs.config.get).to.have.been.calledWith(key)
          test.expect(gpioMocks.stubs.Constructor.getCall(0).args[1]).to.equal(fooValue)
        })
      })

      test.it('should init a virtual gpio if real gpio initialization throws an error', async () => {
        gpioMocks.stubs.Constructor.throws(new Error())
        gpioHandler = new GpioHandler(domapicMocks.stubs)
        await gpioHandler.init()
        test.expect(gpioMockMocks.stubs.Constructor).to.have.been.called()
      })
    })
  })

  test.describe('status getter', () => {
    test.it('should return current gpio status', async () => {
      const fooStatus = 'foo-status'
      gpioMocks.stubs.instance.status = fooStatus
      gpioHandler = new GpioHandler(domapicMocks.stubs)
      await gpioHandler.init()
      test.expect(gpioHandler.status).to.equal(fooStatus)
    })
  })

  test.describe('events getter', () => {
    test.it('should return gpio events', async () => {
      gpioHandler = new GpioHandler(domapicMocks.stubs)
      await gpioHandler.init()
      test.expect(gpioHandler.events).to.equal(gpioMocks.stubs.instance.events)
    })
  })

  test.describe('eventNames static getter', () => {
    test.it('should return gpio events', () => {
      test.expect(GpioHandler.eventNames).to.equal(statics.eventNames)
    })
  })
})
