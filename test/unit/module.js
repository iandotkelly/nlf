/* jshint -W031, -W068, maxstatements: 20 */

/**
 * @description Unit tests for the module.js module
 */

'use strict';

const Module = require('../..').Module;
const PackageSource = require('../..').PackageSource;
const FileSource = require('../..').FileSource;

const fakeMitFile = new FileSource('/dir/myMitFile');
const fakeApacheFile = new FileSource('/dir/myApacheFile');
const fakeGplFile = new FileSource('/dir/myGplFile');

require('should');

fakeMitFile.text = 'blah MIT blah';
fakeApacheFile.text = 'blah The Apache License blah';
fakeGplFile.text = 'blah GPL blah';

describe('Module', () => {
  describe('constructor', () => {
    it('should be a method', () => {
      Module.should.be.a.Function();
    });

    it('with sensible parameters should return an object', () => {
      const myObject = new Module(
        'my-module@1.0.0',
        undefined,
        undefined,
        '/my/dir',
        undefined);
      myObject.should.be.an.object;
    });

    it('should set the name, version, directory, repository and type', () => {
      const myModule = new Module('my-module@1.0.0',
        'my-module',
        '1.0.0',
        '/my/dir',
        'https://myhost/myrepo',
        'development');
      myModule.id.should.be.equal('my-module@1.0.0');
      myModule.name.should.be.equal('my-module');
      myModule.version.should.be.equal('1.0.0');
      myModule.directory.should.be.equal('/my/dir');
      myModule.repository.should.be.equal('https://myhost/myrepo');
      myModule.type.should.be.equal('development');
    });

    it('should remove git prefix from repository URL', () => {
      const myModule = new Module(
        'my-module@1.0.0',
        undefined,
        undefined,
        '/my/dir',
        'git+https://myhost/myrepo.git');
      myModule.repository.should.be.equal('https://myhost/myrepo');
    });

    it('should replace git protocol with http', () => {
      const myModule = new Module(
        'my-module@1.0.0',
        undefined,
        undefined,
        '/my/dir',
        'git://myhost/myrepo.git');
      myModule.repository.should.be.equal('http://myhost/myrepo');
    });

    it('with no name should throw an exception', () => {
      /* eslint no-new: "off" */
      (() => {
        new Module(undefined, undefined, undefined, '/my/dir');
      }).should.throw();
    });

    it('with no directory should throw an exception', () => {
      /* eslint no-new: "off" */
      (() => {
        new Module('my-module');
      }).should.throw();
    });

    it('should have a licenseSources object with empty collections in it', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.should.be.an.object;
      myModule.licenseSources.package.should.be.an.object;
      myModule.licenseSources.package.sources.should.be.an.array;
      myModule.licenseSources.package.sources.length.should.be.equal(0);
      myModule.licenseSources.readme.should.be.an.object;
      myModule.licenseSources.readme.sources.should.be.an.array;
      myModule.licenseSources.readme.sources.length.should.be.equal(0);
      myModule.licenseSources.license.should.be.an.object;
      myModule.licenseSources.license.sources.should.be.an.array;
      myModule.licenseSources.license.sources.length.should.be.equal(0);
    });
  });

  describe('summary method', () => {
    it('when initialized should only have Unknown in it', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(1);
      summary[0].should.be.equal('Unknown');
    });

    it('when a single package license is added, should appear in the summary', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.package.sources.push(new PackageSource('MIT'));
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(1);
      summary[0].should.be.equal('MIT');
    });

    it('when a two different package licenses are added, they appear in the summary alphabetically', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.package.sources.push(new PackageSource('MIT'));
      myModule.licenseSources.package.sources.push(new PackageSource('Apache'));
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(2);
      summary[0].should.be.equal('Apache');
      summary[1].should.be.equal('MIT');
    });


    it('when a single license file source is added, should appear in the summary', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.license.sources.push(fakeMitFile);
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(1);
      summary[0].should.be.equal('MIT');
    });


    it('when a two different license file licenses are added, they appear in the summary alphabetically', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.license.sources.push(fakeMitFile);
      myModule.licenseSources.license.sources.push(fakeApacheFile);
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(2);
      summary[0].should.be.equal('Apache');
      summary[1].should.be.equal('MIT');
    });

    it('when a single readme license is added, should appear in the summary', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.readme.sources.push(fakeMitFile);
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(1);
      summary[0].should.be.equal('MIT');
    });


    it('when a two different readme licenses are added, they appear in the summary alphabetically', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.readme.sources.push(fakeMitFile);
      myModule.licenseSources.readme.sources.push(fakeApacheFile);
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(2);
      summary[0].should.be.equal('Apache');
      summary[1].should.be.equal('MIT');
    });

    it('duplicate licenses from different sources are removed from the summary', () => {
      const myModule = new Module('my-module', 'my-module', '1.0.0', '/my/dir');
      myModule.licenseSources.package.sources.push(new PackageSource('MIT'));
      myModule.licenseSources.package.sources.push(new PackageSource('Apache'));
      myModule.licenseSources.package.sources.push(new PackageSource('GPL'));
      myModule.licenseSources.license.sources.push(fakeMitFile);
      myModule.licenseSources.license.sources.push(fakeApacheFile);
      myModule.licenseSources.readme.sources.push(fakeMitFile);
      myModule.licenseSources.readme.sources.push(fakeApacheFile);
      const summary = myModule.summary();
      summary.should.be.an.array;
      summary.length.should.be.equal(3);
      summary[0].should.be.equal('Apache');
      summary[1].should.be.equal('GPL');
      summary[2].should.be.equal('MIT');
    });
  });
});
