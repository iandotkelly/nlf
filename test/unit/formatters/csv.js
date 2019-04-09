/* jshint -W068 */

/**
 * @description Unit tests standard formatter
 */

'use strict';

var csvFormat = require('../../..').csvFormatter,
	Module = require('../../..').Module,
	PackageSource = require('../../..').PackageSource,
	FileSource = require('../../..').FileSource,
	input = [],
	mod,
	path = require('path'),
	expected;

require('should'),

// input module
mod = new Module(
	'test@1.0.0',
	'test',
	'1.0.0',
	'/dir/test',
	'',
	'',
	{ name: 'author', email: 'email', url: 'url' }
);
mod.licenseSources.package.add(new PackageSource('Apache'));
mod.licenseSources.license.add(
	new FileSource(path.join(__dirname, '../../fixtures/MIT')));
input.push(mod);


// expected reponse
expected = 'name,version,directory,repository,summary,from package.json,'
	+ 'from license,from readme,author\n'
	+ 'test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,,author email url';

describe('csv formatter', function () {

	describe('render method', function () {

		describe('with no callback', function () {

			it('should throw', function () {

				mod.licenseSources.license.sources[0].read(function (err) {
					if (err) {
						throw err;
					}

					(function () {
						csvFormat.render(input);
					}).should.throw();
				});
			});
		});


		describe('with no data', function () {

			it('should return an error', function () {

				csvFormat.render(undefined, {}, function (err) {

					err.should.be.an.object;

				});

			});
		});


		describe('with badly typed data', function () {

			it('should return an error', function () {

				csvFormat.render(1, {}, function (err) {

					err.should.be.an.object;

				});

				csvFormat.render(true, {}, function (err) {

					err.should.be.an.object;

				});

				csvFormat.render('cats', {}, function (err) {

					err.should.be.an.object;

				});

			});
		});


		describe('with an empty array', function () {

			it('should return an error', function () {

				csvFormat.render([], {}, function (err) {

					err.should.be.an.object;

				});

			});
		});

		describe('with good data', function () {

			it('should return a record in the expected format', function (done) {

				mod.licenseSources.license.sources[0].read(function (err) {
					if (err) {
						throw err;
					}

					csvFormat.render(input, {}, function (err, output) {

						if (err) {
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
