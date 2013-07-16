/**
 * @description Unit tests standard formatter
 */

'use strict';

var csvFormat= require('../../../lib/formatters/csv.js'),
	should = require('should'),
	Module = require('../../../lib/module.js'),
	PackageSource = require('../../../lib/package-source'),
	FileSource = require('../../../lib/file-source'),
	input = [],
	mod,
	path = require('path'),
	expected;

// input module
mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test');
mod.licenseSources.package.sources.push(new PackageSource('Apache'));
mod.licenseSources.license.sources.push(new FileSource(path.join(__dirname, '../../fixtures/MIT')));
input.push(mod);

// expected reponse
expected = 'name,version,directory,repository,summary,from package.json,from license,from readme\n'
      + 'test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,';

describe('standard formatter', function () {

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
