const test = require('narval')

const OnoffMocks = require('./Onoff.mocks')
const DeathMocks = require('./Death.mocks')

test.describe('Gpio', () => {
  let lodash
  let sandbox
  let Gpio
  let gpio
  let onoffMocks
  let deathMocks

  test.beforeEach(() => {
    sandbox = test.sinon.createSandbox()
    onoffMocks = new OnoffMocks()
    deathMocks = new DeathMocks()
    lodash = require('lodash')
    sandbox.spy(lodash, 'debounce')
    Gpio = require('../../lib/Gpio')
  })

  test.afterEach(() => {
    deathMocks.restore()
    onoffMocks.restore()
    sandbox.restore()
  })

  test.it('should throw an error if gpio is not accesible', () => {
    let error
    onoffMocks.stubs.Gpio.accessible = false
    try {
      gpio = new Gpio()
    } catch (err) {
      error = err
    }
    test.expect(gpio).to.be.undefined()
    test.expect(error.message).to.contain('not accesible')
  })

  test.it('should create a Gpio passing gpioNumber', () => {
    const gpioNumber = 3
    gpio = new Gpio(gpioNumber)
    const args = onoffMocks.stubs.Gpio.getCall(0).args
    test.expect(args[0]).to.equal(gpioNumber)
    test.expect(args[1]).to.equal('in')
    test.expect(args[2]).to.equal('both')
  })

  test.it('should debounce the change callback if debounceTimeout is received', () => {
    const timeout = 3000
    gpio = new Gpio(2, timeout, 3000)
    const debounceCall = lodash.debounce.getCall(0)
    test.expect(debounceCall.args[1]).to.equal(3000)
    test.expect(debounceCall.args[2]).to.deep.equal({
      maxWait: 3000
    })
  })

  test.it('should have added an onDeath callback', () => {
    gpio = new Gpio(2)
    test.expect(deathMocks.stub).to.have.been.called()
  })

  test.describe('when process is death', () => {
    let sandbox
    test.beforeEach(() => {
      sandbox = test.sinon.createSandbox()
      sandbox.stub(process, 'exit')
    })

    test.afterEach(() => {
      sandbox.restore()
    })

    test.it('should call to unwatch gpio', () => {
      gpio = new Gpio(2)
      deathMocks.stub.callBack()
      test.expect(onoffMocks.stubs.gpio.unwatchAll).to.have.been.called()
    })

    test.it('should call to unexport gpio', () => {
      gpio = new Gpio(2)
      deathMocks.stub.callBack()
      test.expect(onoffMocks.stubs.gpio.unexport).to.have.been.called()
    })

    test.it('should not call to unexport gpio if method is not available', () => {
      const originalStub = onoffMocks.stubs.gpio.unexport
      gpio = new Gpio(2)
      onoffMocks.stubs.gpio.unexport = false
      deathMocks.stub.callBack()
      test.expect(originalStub).to.not.have.been.called()
    })

    test.it('should call to process exit', () => {
      gpio = new Gpio(2)
      deathMocks.stub.callBack()
      test.expect(process.exit).to.have.been.called()
    })
  })

  test.describe('status getter', () => {
    test.it('should call to onoff readSync method, and return true if value is 1', () => {
      onoffMocks.stubs.gpio.readSync.returns(1)
      gpio = new Gpio(2)
      const value = gpio.status
      test.expect(value).to.equal(true)
    })

    test.it('should call to onoff readSync method, and return false if value is 0', () => {
      onoffMocks.stubs.gpio.readSync.returns(0)
      gpio = new Gpio(2)
      const value = gpio.status
      test.expect(value).to.equal(false)
    })
  })

  test.describe('events', () => {
    test.it('should emit an error event when Gpio watcher returns an error', done => {
      const error = new Error('foo error')
      gpio = new Gpio(2)
      gpio.events.on('error', err => {
        test.expect(err).to.equal(error)
        done()
      })
      gpio._gpioChangeCallback(error)
    })

    test.it('should emit an rising event when Gpio watcher returns 1', done => {
      gpio = new Gpio(2)
      gpio.events.on('rising', val => {
        test.expect(val).to.equal(true)
        done()
      })
      gpio._gpioChangeCallback(null, 1)
    })

    test.it('should emit a falling event when Gpio watcher returns 1', done => {
      gpio = new Gpio(2)
      gpio.events.on('falling', val => {
        test.expect(val).to.equal(false)
        done()
      })
      gpio._gpioChangeCallback(null, 0)
    })

    test.it('should emit a both event with true when Gpio watcher returns 1', done => {
      gpio = new Gpio(2)
      gpio.events.on('both', val => {
        test.expect(val).to.equal(true)
        done()
      })
      gpio._gpioChangeCallback(null, 1)
    })

    test.it('should emit a both event with false when Gpio watcher returns 0', done => {
      gpio = new Gpio(2)
      gpio.events.on('both', val => {
        test.expect(val).to.equal(false)
        done()
      })
      gpio._gpioChangeCallback(null, 0)
    })

    test.it('should not emit an event when value has not changed', () => {
      gpio = new Gpio(2)
      sandbox.spy(gpio._eventEmitter, 'emit')
      gpio._currentValue = 1
      gpio._gpioChangeCallback(null, 1)
      test.expect(gpio._eventEmitter.emit).to.not.have.been.called()
    })
  })
})
