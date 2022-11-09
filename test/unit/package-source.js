/* eslint-env mocha, node */
/**
 * @description Unit tests for the package-source.js module
 */

'use strict'

const PackageSource = require('../..').PackageSource

require('should')
const { assert } = require('chai')

describe('PackageSource', function () {
  describe('constructor', function () {
    it('should be a method', function () {
      assert.isFunction(PackageSource)
    })

    it('which throws exception with no argument', function () {
      assert.throws(() =>
        new PackageSource()
      )
    })

    it('which should create an initialized object with a string parameter',
      function () {
        const source = new PackageSource('MIT')
        assert.strictEqual(source.license, 'MIT')
        assert.strictEqual(source.url, '(none)')
      })

    it('and should create an initialized object with an object parameter',
      function () {
        const licenseObject = {
          type: 'MIT',
          url: 'http://opensource.org/licenses/MIT'
        }
        const source = new PackageSource(licenseObject)
        assert.strictEqual(source.license, 'MIT')
        assert.strictEqual(source.url, 'http://opensource.org/licenses/MIT')
      })
  })

  describe('licenses method', function () {
    it('should return the license name wrapped in an Array', function () {
      const source = new PackageSource('MIT')
      const licenses = source.names()
      assert.isArray(licenses)
      assert.strictEqual(licenses.length, 1)
      assert.strictEqual(licenses[0], 'MIT')
    })
  })
})
