/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict';

var licenseFind = require('../../lib/license-find'),
	should = require('should');

describe('license-find', function () {

	it('should be a function', function () {
		licenseFind.should.be.a.function;
	})

	describe('with GPL text', function () {

		it('should return GPL', function () {
			var output = licenseFind('blah GPL blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('GPL');
		});

	});

	describe('with LGPL text', function () {

		it('should return LGPL', function () {
			var output = licenseFind('blah LGPL blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('LGPL');
		});

	});

	describe('with GPLv2 text', function () {

		it('should return GPL', function () {
			var output = licenseFind('blah GPLv2 blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('GPL');
		});

	});

	describe('with MIT text', function () {

		it('should return MIT', function () {
			var output = licenseFind('blah MIT blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('MIT');
		});

	});


	describe('with (MIT) text', function () {

		it('should return MIT', function () {
			var output = licenseFind('blah (MIT) blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('MIT');
		});

	});

	describe('with MPL text', function () {

		it('should return MPL', function () {
			var output = licenseFind('blah MPL blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('MPL');
		});

	});

	describe('with Apache License text', function () {

		it('should return Apache', function () {
			var output = licenseFind('blah Apache\nLicense blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('Apache');
		});

	});

	describe('with DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE text', function () {

		it('should return WTFPL', function () {
			var output = licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});

	});


	describe('with DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE text', function () {

		it('should return WTFPL', function () {
			var output = licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});

	});

	describe('with BSD text', function () {

		it('should return BSD', function () {
			var output = licenseFind('blah BSD blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('BSD');
		});

	});

	describe('with dual license, e.g. GPL & MIT text', function () {

		it('should return GPL & MIT', function () {
			var output = licenseFind('blah MIT blah\n\ncats GPL cats');
			output.length.should.be.equal(2);
			output[0].should.be.equal('GPL');
			output[1].should.be.equal('MIT');
		});

	});
});
