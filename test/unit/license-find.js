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
  /* jshint -W101 */

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


	describe('when given license text not containing a license title', function () {
		describe('when text corresponds to a popular license', function () {
			var bsdLicenseText =
					'Copyright (c) 2015, Joe Schmoe\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n\n1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n\n2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.';


			describe('when options is null', function () {
				it('should not recognize the license', function () {
					var output = licenseFind(bsdLicenseText);
					output.should.be.empty;
				});
			});

			describe('when options.editDistance is false', function () {
				it('should not recognize the license', function () {
					var output = licenseFind(bsdLicenseText, {editDistance: false});
					output.should.be.empty;
				});
			});

			describe('when options.editDistance is true', function () {
				it('should recognize the license', function () {
					var output = licenseFind(bsdLicenseText, {editDistance: true});
					output.should.eql(['BSD-2-Clause']);
				});
			});

			describe('when options.editDistance is an empty array', function () {
				it('should throw an error', function () {
					(function () {
						licenseFind(bsdLicenseText, {editDistance: []});
					}).should.throwError();
				});
			});
		});

		describe('when text corresponds to an obscure license', function () {
			var zedLicenseText =
					'(c) Jim Davies, January 1995\nYou may copy and distribute this file freely.	Any queries and complaints should be forwarded to Jim.Davies@comlab.ox.ac.uk.\nIf you make any changes to this file, please do not distribute the results under the name `zed-csp.sty\'.';


			describe('when options is null', function () {
				it('should not recognize the license', function () {
					var output = licenseFind(zedLicenseText);
					output.should.be.empty;
				});
			});

			describe('when options.editDistance is false', function () {
				it('should not recognize the license', function () {
					var output = licenseFind(zedLicenseText, {editDistance: false});
					output.should.be.empty;
				});
			});

			describe('when options.editDistance is true', function () {
				it('should recognize a different license', function () {
					var output = licenseFind(zedLicenseText, {editDistance: true});
					output.should.not.equal('Zed');
				});
			});

			describe('when options.editDistance is an empty array', function () {
				it('should throw an error', function () {
					(function () {
						licenseFind(zedLicenseText, {editDistance: []});
					}).should.throwError();
				});
			});

			describe('when options.editDistance is an array containing a popular SPDX license key', function () {
				it('should recognize a different license', function () {
					var output = licenseFind(zedLicenseText, {editDistance: ['BSD-2-Clause']});
					output.should.not.equal('Zed');
				});
			});

			describe('when options.editDistance is an array containing a non-SPDX license key', function () {
				it('should throw an error', function () {
					(function () {
						licenseFind(zedLicenseText, {editDistance: ['Bogus-Key']});
					}).should.throwError();
				});
			});

			describe('when options.editDistance is an array containing the SPDX key of the obscure license', function () {
				it('should recognize the the license', function () {
					var output = licenseFind(zedLicenseText, {editDistance: ['YPL-1.1', 'Zed', 'BSD-2-Clause']});
					output.should.eql(['Zed']);
				});
			});

		});
	});
});
