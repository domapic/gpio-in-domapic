const test = require('narval')

const index = require('../index')

test.describe('index', () => {
  test.it('should export an object', () => {
    test.expect(index).to.deep.equal({})
  })
})
