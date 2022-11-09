/* eslint-env mocha, node */

/**
 * @description Unit tests standard formatter
 */

'use strict'

const standardFormat = require('../../..').standardFormatter
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
  new FileSource(path.join(__dirname, '../../fixtures/MIT')))
mod.licenseSources.readme.add(
  new FileSource(path.join(__dirname, '../../fixtures/MIT')))
input.push(mod)

// expected reponse
const expected = `test@1.0.0 [license(s): Apache, MIT]
├── package.json:  Apache
├── license files: MIT
└── readme files: MIT

LICENSES: Apache, MIT
`
const expectedWithDetailSummary = `test@1.0.0 [license(s): Apache, MIT]
├── package.json:  Apache
├── license files: MIT
└── readme files: MIT

LICENSES:
├─┬ Apache
│ └── test@1.0.0
└─┬ MIT
  └── test@1.0.0
`
describe('standard formatter', function () {
  describe('render method', function () {
    describe('with no callback', function () {
      it('should throw', function () {
        mod.licenseSources.license.sources[0].read(function (err) {
          if (err) {
            throw err
          }

          mod.licenseSources.readme.sources[0].read(function (err) {
            if (err) {
              throw err
            }

            assert.throws(() => standardFormat.render(input))
          })
        })
      })
    })

    describe('with no data', function () {
      it('should return an error', function () {
        standardFormat.render(undefined, {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    describe('with badly typed data', function () {
      it('should return an error', function () {
        standardFormat.render(1, {}, function (err) {
          assert.isDefined(err)
        })

        standardFormat.render(true, {}, function (err) {
          assert.isDefined(err)
        })

        standardFormat.render('cats', {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    describe('with an empty array', function () {
      it('should return an error', function () {
        standardFormat.render([], {}, function (err) {
          assert.isDefined(err)
        })
      })
    })

    it('should return a record in the expected format', function (done) {
      mod.licenseSources.license.sources[0].read(function (err) {
        if (err) {
          throw err
        }

        mod.licenseSources.readme.sources[0].read(function (err) {
          if (err) {
            throw err
          }
          standardFormat.render(input, { summaryMode: 'simple' },
            function (err, output) {
              if (err) {
                throw err
              }

              assert.strictEqual(output, expected)
              done()
            })
        })
      })
    })

    it('should return detail summary', function (done) {
      mod.licenseSources.license.sources[0].read(function (err) {
        if (err) {
          throw err
        }

        mod.licenseSources.readme.sources[0].read(function (err) {
          if (err) {
            throw err
          }
          standardFormat.render(input, { summaryMode: 'detail' },
            function (err, output) {
              if (err) {
                throw err
              }

              assert.strictEqual(output, expectedWithDetailSummary)
              done()
            })
        })
      })
    })
  })
})
