/**
 * @description Unit tests for the package-source.js module
 */

'use strict';

const PackageSource = require('../..').PackageSource;

require('should');

describe('PackageSource', () => {
  describe('constructor', () => {
    it('should be a method', () => {
      PackageSource.should.be.a.Function();
    });

    it('which throws exception with no argument', () => {
      /* eslint no-new: "off" */
      (() => {
        new PackageSource();
      }).should.throw();
    });

    it('which should create an initialized object with a string parameter', () => {
      const source = new PackageSource('MIT');
      source.license.should.be.equal('MIT');
      source.url.should.be.equal('(none)');
    });

    it('and should create an initialized object with an object parameter', () => {
      const licenseObject = {
        type: 'MIT',
        url: 'http://opensource.org/licenses/MIT',
      };
      const source = new PackageSource(licenseObject);
      source.license.should.be.equal('MIT');
      source.url.should.be.equal('http://opensource.org/licenses/MIT');
    });
  });

  describe('licenses method', () => {
    it('should return the license name wrapped in an Array', () => {
      const source = new PackageSource('MIT');
      const licenses = source.names();
      licenses.should.be.an.array;
      licenses.length.should.be.equal(1);
      licenses[0].should.be.equal('MIT');
    });
  });
});
