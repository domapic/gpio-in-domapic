const mockery = require('mockery')

let enabled = false

const enable = () => {
  if (!enabled) {
    enabled = true
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })
  }
}

const register = (moduleName, mock) => {
  enable()
  mockery.registerMock(moduleName, mock)
}

const deregister = moduleName => {
  mockery.resetCache()
  mockery.deregisterMock(moduleName)
}

module.exports = {
  register,
  deregister
}
