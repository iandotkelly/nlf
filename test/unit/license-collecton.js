/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict';

const LicenseCollection = require('../..').LicenseCollection;
const PackageSource = require('../..').PackageSource;

require('should');

describe('license-collection', () => {
  it('should be a function', () => {
    LicenseCollection.should.be.a.Function();
  });

  describe('the constructor', () => {
    it('should return an object with an empty sources array', () => {
      const col = new LicenseCollection();
      col.sources.should.be.an.array;
      col.sources.length.should.be.equal(0);
    });
  });

  describe('the add method', () => {
    it('should throw if the type is not an object', () => {
      (() => {
        const col = new LicenseCollection();
        col.add();
      }).should.throw();

      (() => {
        const col = new LicenseCollection();
        col.add('cats');
      }).should.throw();
    });

    it('should add an object', () => {
      const col = new LicenseCollection();

      col.sources.length.should.be.equal(0);
      col.add({ hello: 'cats' });
      col.sources.length.should.be.equal(1);
      col.sources[0].hello.should.be.equal('cats');
    });
  });

  describe('the summary function', () => {
    describe('of an initialized object', () => {
      it('should return an empty array', () => {
        const col = new LicenseCollection();
        const summary = col.summary();

        summary.should.be.an.array;
        summary.length.should.be.equal(0);
      });
    });

    describe('when a source has been added', () => {
      it('should return license names', () => {
        const col = new LicenseCollection();
        const licenseSource = new PackageSource('MIT');

        col.add(licenseSource);

        const summary = col.summary();

        summary.length.should.be.equal(1);
        summary[0].should.be.equal('MIT');
      });
    });
  });
});
