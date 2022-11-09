/* eslint-env mocha, node */
/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict'

const licenseFind = require('../..').licenseFind

const { assert } = require('chai')

describe('license-find', function () {
  it('should be a function', function () {
    assert.isFunction(licenseFind)
  })

  describe('with GPL text', function () {
    it('should return GPL', function () {
      const output = licenseFind('blah GPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'GPL')
    })

    it('at the start should still return GPL', function () {
      const output = licenseFind('GPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'GPL')
    })
  })

  describe('with LGPL text', function () {
    it('should return LGPL', function () {
      const output = licenseFind('blah LGPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'LGPL')
    })

    it('at the start should still return LGPL', function () {
      const output = licenseFind('LGPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'LGPL')
    })
  })

  describe('with GPLvx text', function () {
    it('should return GPL', function () {
      let output = licenseFind('blah GPLv2 blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'GPL')

      output = licenseFind('blah GPLv9 blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'GPL')
    })

    it('at the start should still return GPL', function () {
      const output = licenseFind('GPLv2 blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'GPL')
    })
  })

  describe('with MIT text', function () {
    it('should return MIT', function () {
      const output = licenseFind('blah MIT blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MIT')
    })

    it('at the start should still return MIT', function () {
      const output = licenseFind('MIT blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MIT')
    })
  })

  describe('with (MIT) text', function () {
    it('should return MIT', function () {
      const output = licenseFind('blah (MIT) blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MIT')
    })

    it('at the start should still return MIT', function () {
      const output = licenseFind('(MIT) blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MIT')
    })
  })

  describe('with MPL text', function () {
    it('should return MPL', function () {
      const output = licenseFind('blah MPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MPL')
    })

    it('at the start should still return MPL', function () {
      const output = licenseFind('MPL blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'MPL')
    })
  })

  describe('with Apache License text', function () {
    it('should return Apache', function () {
      const output = licenseFind('blah Apache\nLicense blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'Apache')
    })

    it('at the start should still return Apache', function () {
      const output = licenseFind('Apache\nLicense blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'Apache')
    })
  })

  describe('with DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE text', function () {
    it('should return WTFPL', function () {
      const output =
    licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'WTFPL')
    })

    it('at the start should still return WTFPL', function () {
      const output = licenseFind('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'WTFPL')
    })

    it('in any case should still return WTFPL', function () {
      const output = licenseFind('dO WHAT the fUck you want tO PUBLIC licensE blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'WTFPL')
    })

    it('with British spelling should still return WTFPL', function () {
      const output =
    licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'WTFPL')
    })
  })

  describe('with ISC text', function () {
    it('should return ISC', function () {
      const output =
    licenseFind('blah ISC blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'ISC')
    })

    it('at the start should still return ISC', function () {
      const output = licenseFind('ISC blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'ISC')
    })
  })

  describe('with Eclipse Public License text', function () {
    describe('in full', function () {
      it('should return Eclipse Public License', function () {
        const output =
     licenseFind('blah EPL blah')
        assert.strictEqual(output.length, 1)
        assert.strictEqual(output[0], 'Eclipse Public License')
      })
    })

    describe('in abbreviation', function () {
      it('should return Eclipse Public License', function () {
        let output = licenseFind('blah EPL blah')
        assert.strictEqual(output.length, 1)
        assert.strictEqual(output[0], 'Eclipse Public License')

        output = licenseFind('blah EPL-1.0 blah')
        assert.strictEqual(output.length, 1)
        assert.strictEqual(output[0], 'Eclipse Public License')
      })

      it('at the start should still return Eclipse Public License', function () {
        let output = licenseFind('EPL blah')
        assert.strictEqual(output.length, 1)
        assert.strictEqual(output[0], 'Eclipse Public License')

        output = licenseFind('EPL-1.0 blah')
        assert.strictEqual(output.length, 1)
        assert.strictEqual(output[0], 'Eclipse Public License')
      })
    })
  })

  describe('with BSD text', function () {
    it('should return BSD', function () {
      const output = licenseFind('blah BSD blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'BSD')
    })

    it('at the start should still return BSD', function () {
      const output = licenseFind('BSD blah')
      assert.strictEqual(output.length, 1)
      assert.strictEqual(output[0], 'BSD')
    })
  })

  describe('with dual license, e.g. GPL & MIT text', function () {
    it('should return GPL & MIT', function () {
      const output = licenseFind('blah MIT blah\n\ncats GPL cats')
      assert.strictEqual(output.length, 2)
      assert.strictEqual(output[0], 'GPL')
      assert.strictEqual(output[1], 'MIT')
    })
  })
})
