/* eslint-env mocha, node */

/**
 * @description Unit tests for the compare-module-names module
 */

'use strict'

const compare = require('../../lib/compare-module-names')
const Module = require('../..').Module

const { assert } = require('chai')

describe('compare-module-names', function () {
  describe('where names are different', function () {
    describe('and versions the same', function () {
      it('they should be ordered correctly', function () {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production')
        const module2 = new Module('bbb@1.0.0',
          'bbb', '1.0.0', '/', '', 'production')
        assert.strictEqual(compare(module1, module2), -1)
        assert.strictEqual(compare(module2, module1), 1)
      })
    })

    describe('and versions are different', function () {
      it('they should be ordered correctly', function () {
        const module1 = new Module('aaa@2.0.0',
          'aaa', '2.0.0', '/', '', 'production')
        const module2 = new Module('bbb@1.0.0',
          'bbb', '1.0.0', '/', '', 'production')
        assert.strictEqual(compare(module1, module2), -1)
        assert.strictEqual(compare(module2, module1), 1)
      })
    })
  })

  describe('where names are the same', function () {
    describe('and versions the same', function () {
      it('they should be ordered correctly', function () {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production')
        const module2 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production')
        assert.strictEqual(compare(module1, module2), 0)
        assert.strictEqual(compare(module2, module1), 0)
      })
    })

    describe('and versions are different', function () {
      it('they should be ordered correctly', function () {
        const module1 = new Module('aaa@2.0.0',
          'aaa', '2.0.0', '/', '', 'production')
        const module2 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production')
        assert.strictEqual(compare(module1, module2), 1)
        assert.strictEqual(compare(module2, module1), -1)
      })
    })

    describe('and versions have alpha or beta modifiers', function () {
      it('they should be ordered correctly', function () {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production')
        const module2 = new Module('aaa@1.0.0-alpha1',
          'aaa', '1.0.0-alpha1', '/', '', 'production')
        assert.strictEqual(compare(module1, module2), 1)
        assert.strictEqual(compare(module2, module1), -1)
      })
    })
  })
})
