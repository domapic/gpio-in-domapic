const test = require('narval')

const OnoffMocks = require('./Onoff.mocks')

test.describe('server', () => {
  let onoff
  let onoffMock

  test.before(() => {
    onoffMock = new OnoffMocks()
    onoff = require('../../lib/onoff')
  })

  test.after(() => {
    onoffMock.restore()
  })

  test.describe('init method', () => {
    test.it('should return onoff library', () => {
      test.expect(onoff.init()).to.equal(onoffMock.stubs)
    })
  })
})
