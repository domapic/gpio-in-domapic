const test = require('narval')

const mockery = require('../mockery')

const MODULE = 'onoff'

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const gpio = {
    readSync: sandbox.stub(),
    unwatchAll: sandbox.stub(),
    watch: sandbox.stub(),
    unexport: sandbox.stub()
  }

  const Gpio = sandbox.stub().callsFake(function () {
    return gpio
  })

  Gpio.accessible = true

  const stubs = {
    Gpio,
    gpio
  }

  const restore = () => {
    sandbox.restore()
    mockery.deregister(MODULE)
  }

  mockery.register(MODULE, stubs)

  return {
    restore,
    stubs
  }
}

module.exports = Mock
