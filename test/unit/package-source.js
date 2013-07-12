/**
 * @description Unit tests for the package-source.js module
 */

'use strict';

var PackageSource = require('../..').PackageSource,
	should = require('should');

describe('PackageSource', function () {

	describe('constructor', function () {

		it('should be a method', function () {
			PackageSource.should.be.a.function;
		});

		it('which throws exception with no argument', function () {
			(function() {
				var source = new PackageSource();
			}).should.throw();
		});

		it('which should create an initialized object with a string parameter', function () {
			var source = new PackageSource('MIT');
			source.license.should.be.equal('MIT');
			source.url.should.be.equal('(none)');
		});

	});

	describe('licenses method', function () {

		it('should return the license name wrapped in an Array', function () {
			var source = new PackageSource('MIT'),
				licenses = source.licenses();
			licenses.should.be.an.array;
			licenses.length.should.be.equal(1);
			licenses[0].should.be.equal('MIT');
		});

	});

});
