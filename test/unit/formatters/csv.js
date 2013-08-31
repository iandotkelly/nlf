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
mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test');
mod.licenseSources.package.sources.push(new PackageSource('Apache'));
mod.licenseSources.license.sources.push(
	new FileSource(path.join(__dirname, '../../fixtures/MIT')));
input.push(mod);

// expected reponse
expected = 'name,version,directory,repository,summary,from package.json,'
	+ 'from license,from readme\n'
	+ 'test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,';

describe('csv formatter', function () {

	describe('render method', function () {

		it('should return a record in the expected format', function (done) {

			mod.licenseSources.license.sources[0].read(function (err) {
				if (err) {
					throw err;
				}

				csvFormat.render(input, function (err, output) {

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
