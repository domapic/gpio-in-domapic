const test = require('narval')

const mockery = require('../mockery')

const GpiosMocks = function (moduleName) {
  return function () {
    let sandbox = test.sinon.createSandbox()

    const instance = {
      status: false,
      events: {
        on: sandbox.stub()
      }
    }

    const stub = sandbox.stub().callsFake(function () {
      return instance
    })

    const restore = () => {
      sandbox.restore()
      mockery.deregister(moduleName)
    }

    mockery.register(moduleName, stub)

    return {
      restore,
      stubs: {
        Constructor: stub,
        instance
      }
    }
  }
}

module.exports = GpiosMocks
