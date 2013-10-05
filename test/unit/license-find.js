/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict';

var licenseFind = require('../..').licenseFind;

require('should');

describe('license-find', function () {
	/* jshint maxstatements:20 */

	it('should be a function', function () {
		licenseFind.should.be.a.function;
	});

	describe('with GPL text', function () {

		it('should return GPL', function () {
			var output = licenseFind('blah GPL blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('GPL');

		});

		it('at the start should still return GPL', function () {
			var output = licenseFind('GPL blah');
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

		it('at the start should still return LGPL', function () {
			var output = licenseFind('LGPL blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('LGPL');
		});

	});

	describe('with GPLvx text', function () {

		it('should return GPL', function () {
			var output = licenseFind('blah GPLv2 blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('GPL');

			output = licenseFind('blah GPLv9 blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('GPL');
		});

		it('at the start should still return GPL', function () {
			var output = licenseFind('GPLv2 blah');
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

		it('at the start should still return MIT', function () {
			var output = licenseFind('MIT blah');
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

		it('at the start should still return MIT', function () {
			var output = licenseFind('(MIT) blah');
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

		it('at the start should still return MPL', function () {
			var output = licenseFind('MPL blah');
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

		it('at the start should still return Apache', function () {
			var output = licenseFind('Apache\nLicense blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('Apache');
		});
	});


	describe('with DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE text', function () {

		it('should return WTFPL', function () {
			var output =
				licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});

		it('at the start should still return WTFPL', function () {
			var output = licenseFind('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});


		it('in any case should still return WTFPL', function () {
			var output = licenseFind('dO WHAT the fUck you want tO PUBLIC licensE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});


		it('with British spelling should still return WTFPL', function () {
			var output =
				licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('WTFPL');
		});
	});


	describe('with ISC text', function () {

		it('should return ISC', function () {
			var output =
				licenseFind('blah ISC blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('ISC');
		});

		it('at the start should still return ISC', function () {
			var output = licenseFind('ISC blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('ISC');
		});

	});

	describe('with Eclipse Public License text', function () {

		describe('in full', function () {

			it('should return Eclipse Public License', function () {
				var output =
					licenseFind('blah EPL blah');
				output.length.should.be.equal(1);
				output[0].should.be.equal('Eclipse Public License');
			});
		});

		describe('in abbreviation', function () {

			it('should return Eclipse Public License', function () {
				var output = licenseFind('blah EPL blah');
				output.length.should.be.equal(1);
				output[0].should.be.equal('Eclipse Public License');

				output = licenseFind('blah EPL-1.0 blah');
				output.length.should.be.equal(1);
				output[0].should.be.equal('Eclipse Public License');
			});

			it('at the start should still return Eclipse Public License', function () {
				var output = licenseFind('EPL blah');
				output.length.should.be.equal(1);
				output[0].should.be.equal('Eclipse Public License');

				output = licenseFind('EPL-1.0 blah');
				output.length.should.be.equal(1);
				output[0].should.be.equal('Eclipse Public License');

			});

		});
	});

	describe('with BSD text', function () {

		it('should return BSD', function () {
			var output = licenseFind('blah BSD blah');
			output.length.should.be.equal(1);
			output[0].should.be.equal('BSD');
		});

		it('at the start should still return BSD', function () {
			var output = licenseFind('BSD blah');
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
