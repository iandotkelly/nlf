/* eslint-env mocha, node */

/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict'

const LicenseCollection = require('../..').LicenseCollection
const PackageSource = require('../..').PackageSource

const { assert } = require('chai')

describe('license-collection', function () {
  it('should be a function', function () {
    assert.isFunction(LicenseCollection)
  })

  describe('the constructor', function () {
    it('should return an object with an empty sources array', function () {
      const col = new LicenseCollection()
      assert.isArray(col.sources)
      assert.strictEqual(col.sources.length, 0)
    })
  })

  describe('the add method', function () {
    it('should throw if the type is not an object', function () {
      assert.throws(() => {
        const col = new LicenseCollection()
        col.add()
      })
      assert.throws(() => {
        const col = new LicenseCollection()
        col.add('cats')
      })
    })

    it('should add an object', function () {
      const col = new LicenseCollection()

      assert.strictEqual(col.sources.length, 0)
      col.add({ hello: 'cats' })
      assert.strictEqual(col.sources.length, 1)
      assert.strictEqual(col.sources[0].hello, 'cats')
    })
  })

  describe('the summary function', function () {
    describe('of an initialized object', function () {
      it('should return an empty array', function () {
        const col = new LicenseCollection()

        const summary = col.summary()
        assert.isArray(summary)
        assert.strictEqual(summary.length, 0)
      })
    })

    describe('when a source has been added', function () {
      it('should return license names', function () {
        const col = new LicenseCollection()
        const licenseSource = new PackageSource('MIT')

        col.add(licenseSource)

        const summary = col.summary()
        assert.strictEqual(summary.length, 1)
        assert.strictEqual(summary[0], 'MIT')
      })
    })
  })
})
