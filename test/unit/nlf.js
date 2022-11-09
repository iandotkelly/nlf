/* eslint-env mocha, node */
/**
 * @description Unit tests for the nlf.js module
 */

'use strict'

const nlf = require('../..')
const path = require('path')
const { assert } = require('chai')

const fixturedir = path.join(__dirname, '../fixtures/test-project')
const fixtureSubdirs = path.join(__dirname, '../fixtures/test-project-subdirs')
const licensesArrayDir = path.join(__dirname, '../fixtures/licenses-array')
const licenseObjectDir = path.join(__dirname, '../fixtures/license-object')
const licensesObjectDir = path.join(__dirname, '../fixtures/licenses-object')
const licensesStringDir = path.join(__dirname, '../fixtures/licenses-string')
const missingName = path.join(__dirname, '../fixtures/missing-name')

describe('nlf', function () {
  describe('.find()', function () {
    // simple 'does it return in a timely manner'
    it('should work', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir
      }, function (err) {
        if (err) {
          return done(err)
        }

        done()
      })
    })

    // simple 'does it return in a timely manner'
    it('should work with production only', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: true
      }, function (err) {
        if (err) {
          return done(err)
        }

        done()
      })
    })

    // simple 'does it return in a timely manner'
    it('should not work in a non node directory', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: '/'
      }, function (err) {
        assert.isDefined(err)
        assert.strictEqual(err.message, 'No package.json file found.')
        done()
      })
    })

    // simple 'does it return in a timely manner'
    it('should work even with no options', function (done) {
      this.timeout(50000)

      nlf.find(// eslint-disable-next-line array-callback-return
        function (err) {
          if (err) {
            return done(err)
          }

          done()
        })
    })

    it('requires options.production to be a boolean', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: 'TRUE'
      }, function (err) {
        assert.isDefined(err)
        done()
      })
    })

    it('requires options.directory to be a string', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: 1
      }, function (err) {
        assert.isDefined(err)
        done()
      })
    })

    // parse only current package.json deps., don't traverse inward
    it('should parse with a depth of 0', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: true, depth: 0
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 1)
        done()
      })
    })

    // parse only current package.json deps., don't traverse inward
    it('should parse with a depth of 1', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: true, depth: 1
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 2)
        done()
      })
    })

    // parse only current package.json deps., don't traverse downwards
    it('should parse with a depth of 0 including dev deps.', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, depth: 0, production: false
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 1)
        done()
      })
    })

    // parse only current package.json deps., don't traverse downwards
    it('should parse with a depth of 1 including dev deps.', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, depth: 1, production: false
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 3)
        done()
      })
    })

    it('should parse with a depth of Infinity', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: true
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 4)
        done()
      })
    })

    it('should parse with a depth of Infinity with dev deps', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixturedir, production: false
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 7)
        done()
      })
    })

    it('should include subdirs but ignore node_modules and bower_modules', function (done) {
      this.timeout(50000)

      nlf.find({
        directory: fixtureSubdirs, production: false
      }, function (err, results) {
        if (err) {
          throw err
        }
        assert.strictEqual(results.length, 4)
        let thisProject
        for (let i = 0; i < results.length; i++) {
          if (results[i].id === 'nlf-test@1.0.0') {
            thisProject = results[i].licenseSources
          }
        }
        assert.strictEqual(thisProject.package.sources.length, 0)
        assert.strictEqual(thisProject.readme.sources.length, 0)
        assert.strictEqual(thisProject.license.sources.length, 1)
        assert.strictEqual(thisProject.license.sources[0].filePath, path.join(fixtureSubdirs, 'subdir/docs/license.md'))
        done()
      })
    })

    describe('with a license object', function () {
      it('should correctly get the license', function (done) {
        nlf.find({
          directory: licenseObjectDir
        }, function (err, results) {
          if (err) {
            throw err
          }
          assert.strictEqual(results.length, 1)
          const sources = results[0].licenseSources.package.sources
          assert.strictEqual(sources.length, 1)
          assert.strictEqual(sources[0].license, 'MIT')
          done()
        })
      })
    })

    describe('with a licenses object', function () {
      it('should correctly get the license', function (done) {
        nlf.find({
          directory: licensesObjectDir
        }, function (err, results) {
          if (err) {
            throw err
          }
          assert.strictEqual(results.length, 1)
          const sources = results[0].licenseSources.package.sources
          assert.strictEqual(sources.length, 1)
          assert.strictEqual(sources[0].license, 'MIT')
          done()
        })
      })
    })

    describe('with an array of licenses', function () {
      it('should correctly get all licenses', function (done) {
        nlf.find({
          directory: licensesArrayDir
        }, function (err, results) {
          if (err) {
            throw err
          }
          assert.strictEqual(results.length, 1)
          const sources = results[0].licenseSources.package.sources
          assert.strictEqual(sources.length, 2)
          assert.strictEqual(sources[0].license, 'MIT')
          assert.strictEqual(sources[1].license, 'GPLv2')
          done()
        })
      })
    })

    describe('with an (incorrect) single licenses string', function () {
      it('should correctly get the license', function (done) {
        nlf.find({
          directory: licensesStringDir
        }, function (err, results) {
          if (err) {
            throw err
          }
          assert.strictEqual(results.length, 1)
          const sources = results[0].licenseSources.package.sources
          assert.strictEqual(sources.length, 1)
          assert.strictEqual(sources[0].license, 'MIT')
          done()
        })
      })
    })

    describe('with a project without name or version', function () {
      it('should correctly get the license', function (done) {
        nlf.find({
          directory: missingName
        }, function (err, results) {
          if (err) {
            throw err
          }
          assert.strictEqual(results.length, 1)
          const result = results[0]
          assert.strictEqual(result.name, 'missing-name')
          assert.strictEqual(result.id, 'missing-name@0.0.0')
          assert.strictEqual(result.version, '0.0.0')
          const sources = result.licenseSources.package.sources
          assert.strictEqual(sources.length, 1)
          assert.strictEqual(sources[0].license, 'MIT')
          done()
        })
      })
    })
  })
})
