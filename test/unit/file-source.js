/* eslint-env mocha, node */

/**
 * @description Unit tests for the file-source.js module
 */

'use strict'

const FileSource = require('../..').FileSource
const path = require('path')
const fs = require('fs')
const mitFile = fs.readFileSync(path.join(__dirname, '../fixtures/MIT'), 'utf-8')
const { assert } = require('chai')

describe('FileSource', function () {
  describe('constructor', function () {
    it('should be a method', function () {
      assert.isFunction(FileSource)
    })

    it('which throws exception with no path', function () {
      assert.throws(() => new FileSource())
    })

    it('which should create an initialized object with a path parameter',
      function () {
        const source = new FileSource('/dir/filename')
        assert.strictEqual(source.filePath, '/dir/filename')
        assert.strictEqual(source.text, '')
        assert.strictEqual(source.names().length, 0)
      })
  })

  describe('read an MIT license', function () {
    let source

    beforeEach(function (done) {
      source = new FileSource(path.join(__dirname, '../fixtures/MIT'))
      source.read(done)
    })

    it('should contain the MIT text', function () {
      assert.notStrictEqual(source, '')
      assert.strictEqual(source.text, mitFile)
    })

    it('should detect an MIT license only', function () {
      const licenses = source.names()
      assert.strictEqual(licenses.length, 1)
      assert.strictEqual(licenses[0], 'MIT')
    })
  })

  describe('read() with a bad filename', function () {
    it('will return an error', function (done) {
      const source = new FileSource(path.join(__dirname, '../fixtures/CATS'))
      source.read(function (err) {
        assert.isDefined(err)
        done()
      })
    })
  })
})
