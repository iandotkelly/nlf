/* jshint -W068 */

/**
 * @description Unit tests for the license-find.js module
 * 
 * @@NLF-IGNORE@@
 */

'use strict';

var LicenseCollection = require('../..').LicenseCollection,
	PackageSource = require('../..').PackageSource;

require('should');

describe('license-collection', function () {

	it('should be a function', function () {
		LicenseCollection.should.be.a.function;
	});

	describe('the constructor', function () {

		it('should return an object with an empty sources array', function () {
			var col = new LicenseCollection();
			col.sources.should.be.an.array;
			col.sources.length.should.be.equal(0);
		});

	});

	describe('the add method', function () {

		it('should throw if the type is not an object', function () {

			(function () {
				var col = new LicenseCollection();
				col.add();
			}).should.throw();

			(function () {
				var col = new LicenseCollection();
				col.add('cats');
			}).should.throw();

		});

		it('should add an object', function () {

			var col = new LicenseCollection();

			col.sources.length.should.be.equal(0);
			col.add({ hello: 'cats'});
			col.sources.length.should.be.equal(1);
			col.sources[0].hello.should.be.equal('cats');
		});

	});

	describe('the summary function', function () {

		describe('of an initialized object', function () {

			it('should return an empty array', function () {

				var col = new LicenseCollection(), summary;

				summary = col.summary();

				summary.should.be.an.array;
				summary.length.should.be.equal(0);
			});

		});

		describe('when a source has been added', function () {
			
			it('should return license names', function () {

				var col = new LicenseCollection(),
					licenseSource = new PackageSource('MIT'),
					summary;

				col.add(licenseSource);

				summary = col.summary();

				summary.length.should.be.equal(1);
				summary[0].should.be.equal('MIT');
			});
		});
	});

});
