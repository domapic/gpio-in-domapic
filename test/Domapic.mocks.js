const test = require('narval')

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stubs = {
    config: {
      get: sandbox.stub().resolves()
    },
    tracer: {
      info: sandbox.stub().resolves(),
      debug: sandbox.stub().resolves(),
      error: sandbox.stub().resolves()
    }
  }

  const restore = () => {
    sandbox.restore()
  }

  return {
    stubs,
    restore
  }
}

module.exports = Mock
