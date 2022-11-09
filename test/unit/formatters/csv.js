/* eslint-env mocha, node */

/**
 * @description Unit tests standard formatter
 */

'use strict'

const csvFormat = require('../../..').csvFormatter
const Module = require('../../..').Module
const PackageSource = require('../../..').PackageSource
const FileSource = require('../../..').FileSource
const input = []
const path = require('path')

const { assert } = require('chai')

// input module
const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test')
mod.licenseSources.package.add(new PackageSource('Apache'))
mod.licenseSources.license.add(
  new FileSource(path.join(__dirname, '../../fixtures/MIT'))
)
input.push(mod)

// expected reponse
const expected = `name,version,directory,repository,summary,from package.json,from license,from readme
test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,`

describe('csv formatter', function () {
  describe('render method', function () {
    describe('with no callback', function () {
      it('should throw', function () {
        mod.licenseSources.license.sources[0].read(function (err) {
          if (err) {
            throw err
          }
          assert.throws(() => csvFormat.render(input))
        })
      })
    })

    describe('with no data', function () {
      it('should return an error', function () {
        csvFormat.render(undefined, {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    describe('with badly typed data', function () {
      it('should return an error', function () {
        csvFormat.render(1, {}, function (err) {
          assert.isDefined(err)
        })

        csvFormat.render(true, {}, function (err) {
          assert.isDefined(err)
        })

        csvFormat.render('cats', {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    describe('with an empty array', function () {
      it('should return an error', function () {
        csvFormat.render([], {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    describe('with good data', function () {
      it('should return a record in the expected format', function (done) {
        mod.licenseSources.license.sources[0].read(function (err) {
          if (err) {
            throw err
          }

          csvFormat.render(input, {}, function (err, output) {
            if (err) {
              throw err
            }
            assert.strictEqual(output, expected)
            done()
          })
        })
      })
    })
  })
})
