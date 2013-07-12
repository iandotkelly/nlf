

/**
 * @description Unit tests for the license-find.js module
 */

'use strict';

var LicenseCollection = require('../../lib/license-collection'),
	PackageSource = require('../../lib/package-source'),
	should = require('should');

describe('license-collection', function () {

	it('should be a function', function () {
		LicenseCollection.should.be.a.function;
	})

	describe('the constructor', function () {

		it('should return an object with an empty sources array', function () {
			var col = new LicenseCollection();
			col.sources.should.be.an.array;
			col.sources.length.should.be.equal(0);
		});

	});

	describe('the summary function', function () {

		describe('of an initialized object', function() {

			it('should return an empty array', function () {

				var col = new LicenseCollection(), summary;

				summary = col.summary();

				summary.should.be.an.array;
				summary.length.should.be.equal(0);
			});

		});

		describe('when a source has been added', function() {
			
			it('should return license names', function () {

				var col = new LicenseCollection(),
					licenseSource = new PackageSource('MIT'),
					summary;

				col.sources.push(licenseSource);

				summary = col.summary();

				summary.length.should.be.equal(1);
				summary[0].should.be.equal('MIT');
			});
		});
	});

});
