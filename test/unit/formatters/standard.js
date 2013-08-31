/* jshint -W068, -W100 */

/**
 * @description Unit tests standard formatter
 */

'use strict';


var standardFormat = require('../../..').standardFormatter,
	Module = require('../../..').Module,
	PackageSource = require('../../..').PackageSource,
	FileSource = require('../../..').FileSource,
	input = [],
	mod,
	path = require('path'),
	expected;

require('should');

// input module
mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test');
mod.licenseSources.package.add(new PackageSource('Apache'));
mod.licenseSources.license.add(
	new FileSource(path.join(__dirname, '../../fixtures/MIT')));
mod.licenseSources.readme.add(
	new FileSource(path.join(__dirname, '../../fixtures/MIT')));
input.push(mod);

// expected reponse
expected = 'test@1.0.0 [license(s): Apache, MIT]\n'
	+ '├── package.json:  Apache\n'
	+ '├── license files: MIT\n'
	+ '└── readme files: MIT\n';

describe('standard formatter', function () {

	describe('render method', function () {

		describe('with no callback', function () {

			it('should throw', function () {
				
				mod.licenseSources.license.sources[0].read(function (err) {
					if (err) {
						throw err;
					}

					mod.licenseSources.readme.sources[0].read(function (err) {
						if (err) {
							throw err;
						}

						(function () {
							standardFormat.render(input);
						}).should.throw();

					});
				});
			});
		});


		describe('with no data', function () {

			it('should return an error', function () {

				standardFormat.render(undefined, function (err) {

					err.should.be.an.object;

				});

			});
		});


		describe('with badly typed data', function () {

			it('should return an error', function () {

				standardFormat.render(1, function (err) {

					err.should.be.an.object;

				});

				standardFormat.render(true, function (err) {

					err.should.be.an.object;

				});

				standardFormat.render('cats', function (err) {

					err.should.be.an.object;

				});

			});
		});


		describe('with an empty array', function () {

			it('should return an error', function () {

				standardFormat.render([], function (err) {

					err.should.be.an.object;

				});

			});
		});


		it('should return a record in the expected format', function (done) {

			mod.licenseSources.license.sources[0].read(function (err) {
				if (err) {
					throw err;
				}

				mod.licenseSources.readme.sources[0].read(function (err) {
					if (err) {
						throw err;
					}
					standardFormat.render(input, function (err, output) {

						if (err)
						{
							throw err;
						}

						output.should.be.equal(expected);
						done();
					});
				});
			});
		});
	});
});
