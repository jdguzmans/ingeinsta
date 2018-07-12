/* global describe it */

const chai = require('chai')
var assert = chai.assert

describe('Points logic module', function () {
  describe('#getPoints', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})

console.log(process.env.TEST)
