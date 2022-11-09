/* eslint-env mocha, node */
/**
 * @description Unit tests for the module.js module
 */

'use strict'

const Module = require('../..').Module
const PackageSource = require('../..').PackageSource
const FileSource = require('../..').FileSource
const fakeMitFile = new FileSource('/dir/myMitFile')
const fakeApacheFile = new FileSource('/dir/myApacheFile')
const fakeGplFile = new FileSource('/dir/myGplFile')

const { assert } = require('chai')

fakeMitFile.text = 'blah MIT blah'
fakeApacheFile.text = 'blah The Apache License blah'
fakeGplFile.text = 'blah GPL blah'

describe('Module', function () {
  describe('constructor', function () {
    it('should be a method', function () {
      assert.isFunction(Module)
    })

    it('with sensible parameters should return an object', function () {
      const myObject = new Module(
        'my-module@1.0.0',
        undefined,
        undefined,
        '/my/dir',
        undefined)
      assert.isObject(myObject)
    })

    it('should set the name, version, directory, repository and type',
      function () {
        const myModule = new Module('my-module@1.0.0',
          'my-module',
          '1.0.0',
          '/my/dir',
          'https://myhost/myrepo',
          'development')
        assert.strictEqual(myModule.id, 'my-module@1.0.0')
        assert.strictEqual(myModule.name, 'my-module')
        assert.strictEqual(myModule.version, '1.0.0')
        assert.strictEqual(myModule.directory, '/my/dir')
        assert.strictEqual(myModule.repository, 'https://myhost/myrepo')
        assert.strictEqual(myModule.type, 'development')
      })

    it('should remove git prefix from repository URL',
      function () {
        const myModule = new Module(
          'my-module@1.0.0',
          undefined,
          undefined,
          '/my/dir',
          'git+https://myhost/myrepo.git')
        assert.strictEqual(myModule.repository, 'https://myhost/myrepo')
      })

    it('should replace git protocol with http',
      function () {
        const myModule = new Module(
          'my-module@1.0.0',
          undefined,
          undefined,
          '/my/dir',
          'git://myhost/myrepo.git')
        assert.strictEqual(myModule.repository, 'http://myhost/myrepo')
      })

    it('should remove .git postfix only from repository URL',
      function () {
        const myModule = new Module(
          'my-module@1.0.0',
          undefined,
          undefined,
          '/my/dir',
          'http://www.github.com/myrepo.git')
        assert.strictEqual(myModule.repository, 'http://www.github.com/myrepo')
      })

    it('with no name should throw an exception', function () {
      assert.throws(() =>
        new Module(undefined, undefined, undefined, '/my/dir')
      )
    })

    it('with no directory should throw an exception', function () {
      assert.throws(() =>
        new Module('my-module')
      )
    })

    it('should have a licenseSources object with empty collections in it',
      function () {
        const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
        assert.isObject(myModule.licenseSources)
        assert.isObject(myModule.licenseSources.package)
        assert.isArray(myModule.licenseSources.package.sources)
        assert.strictEqual(myModule.licenseSources.package.sources.length, 0)
        assert.isObject(myModule.licenseSources.readme)
        assert.isArray(myModule.licenseSources.readme.sources)
        assert.strictEqual(myModule.licenseSources.readme.sources.length, 0)
        assert.isObject(myModule.licenseSources.license)
        assert.isArray(myModule.licenseSources.license.sources)
        assert.strictEqual(myModule.licenseSources.license.sources.length, 0)
      })
  })

  describe('summary method', function () {
    it('when initialized should only have Unknown in it', function () {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
      const summary = myModule.summary()
      assert.isArray(summary)
      assert.strictEqual(summary.length, 1)
      assert.strictEqual(summary[0], 'Unknown')
    })

    it('when a single package license is added, should appear in the summary',
      function () {
        const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
        myModule.licenseSources.package.sources.push(new PackageSource('MIT'))
        const summary = myModule.summary()
        assert.isArray(summary)
        assert.strictEqual(summary.length, 1)
        assert.strictEqual(summary[0], 'MIT')
      })

    it('when a two different package licenses are added, ' +
   'they appear in the summary alphabetically',
    function () {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
      myModule.licenseSources.package.sources.push(new PackageSource('MIT'))
      myModule.licenseSources.package.sources.push(new PackageSource('Apache'))
      const summary = myModule.summary()
      assert.isArray(summary)
      assert.strictEqual(summary.length, 2)
      assert.strictEqual(summary[0], 'Apache')
      assert.strictEqual(summary[1], 'MIT')
    })

    it('when a single license file source is added, should appear in the summary',
      function () {
        const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
        myModule.licenseSources.license.sources.push(fakeMitFile)
        const summary = myModule.summary()
        assert.isArray(summary)
        assert.strictEqual(summary.length, 1)
        assert.strictEqual(summary[0], 'MIT')
      })

    it('when a two different license file licenses are added, ' +
   'they appear in the summary alphabetically', function () {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')

      myModule.licenseSources.license.sources.push(fakeMitFile)
      myModule.licenseSources.license.sources.push(fakeApacheFile)
      const summary = myModule.summary()
      assert.isArray(summary)
      assert.strictEqual(summary.length, 2)
      assert.strictEqual(summary[0], 'Apache')
      assert.strictEqual(summary[1], 'MIT')
    })

    it('when a single readme license is added, should appear in the summary',
      function () {
        const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
        myModule.licenseSources.readme.sources.push(fakeMitFile)
        const summary = myModule.summary()
        assert.isArray(summary)
        assert.strictEqual(summary.length, 1)
        assert.strictEqual(summary[0], 'MIT')
      })

    it('when a two different readme licenses are added, ' +
   'they appear in the summary alphabetically',
    function () {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
      myModule.licenseSources.readme.sources.push(fakeMitFile)
      myModule.licenseSources.readme.sources.push(fakeApacheFile)
      const summary = myModule.summary()
      assert.isArray(summary)
      assert.strictEqual(summary.length, 2)
      assert.strictEqual(summary[0], 'Apache')
      assert.strictEqual(summary[1], 'MIT')
    })

    it('duplicate licenses from different sources are removed from the summary',
      function () {
        const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir')
        myModule.licenseSources.package.sources.push(new PackageSource('MIT'))
        myModule.licenseSources.package.sources.push(new PackageSource('Apache'))
        myModule.licenseSources.package.sources.push(new PackageSource('GPL'))
        myModule.licenseSources.license.sources.push(fakeMitFile)
        myModule.licenseSources.license.sources.push(fakeApacheFile)
        myModule.licenseSources.readme.sources.push(fakeMitFile)
        myModule.licenseSources.readme.sources.push(fakeApacheFile)
        const summary = myModule.summary()
        assert.isArray(summary)
        assert.strictEqual(summary.length, 3)
        assert.strictEqual(summary[0], 'Apache')
        assert.strictEqual(summary[1], 'GPL')
        assert.strictEqual(summary[2], 'MIT')
      })
  })
})
