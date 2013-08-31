/* jshint -W031, -W068 */

/**
 * @description Unit tests for the package-source.js module
 */

'use strict';

var PackageSource = require('../..').PackageSource;

require('should');

describe('PackageSource', function () {

	describe('constructor', function () {

		it('should be a method', function () {
			PackageSource.should.be.a.function;
		});

		it('which throws exception with no argument', function () {
			(function () {
				new PackageSource();
			}).should.throw();
		});

		it('which should create an initialized object with a string parameter',
			function () {
			var source = new PackageSource('MIT');
			source.license.should.be.equal('MIT');
			source.url.should.be.equal('(none)');
		});


		it('and should create an initialized object with an object parameter',
			function () {
			var licenseObject, source;
			licenseObject = {
				type: 'MIT',
				url: 'http://opensource.org/licenses/MIT'
			},
			source = new PackageSource(licenseObject);
			source.license.should.be.equal('MIT');
			source.url.should.be.equal('http://opensource.org/licenses/MIT');
		});
	});

	describe('licenses method', function () {

		it('should return the license name wrapped in an Array', function () {
			var source = new PackageSource('MIT'),
				licenses = source.names();
			licenses.should.be.an.array;
			licenses.length.should.be.equal(1);
			licenses[0].should.be.equal('MIT');
		});

	});

});
