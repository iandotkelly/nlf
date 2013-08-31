/* jshint -W068, -W031 */

/**
 * @description Unit tests for the file-source.js module
 */

'use strict';

var FileSource = require('../..').FileSource,
	path = require('path'),
	fs = require('fs'),
	mitFile = fs.readFileSync(path.join(__dirname, '../fixtures/MIT'), 'utf-8');

require('should');

describe('FileSource', function () {

	describe('constructor', function () {

		it('should be a method', function () {
			FileSource.should.be.a.function;
		});

		it('which throws exception with no path', function () {
			(function () {
				new FileSource();
			}).should.throw();
		});

		it('which should create an initialized object with a path parameter',
			function () {
			var source = new FileSource('/dir/filename');
			source.filePath.should.be.equal('/dir/filename');
			source.text.should.be.equal('');
			source.names().length.should.be.equal(0);
		});

	});

	describe('read an MIT license', function () {

		var source;

		beforeEach(function (done) {
			source = new FileSource(path.join(__dirname, '../fixtures/MIT'));
			source.read(done);
		});

		it('should contain the MIT text', function () {
			source.text.should.not.be.equal('');
			source.text.should.be.equal(mitFile);
		});

		it('should detect an MIT license only', function () {
			var licenses = source.names();
			licenses.length.should.be.equal(1);
			licenses[0].should.be.equal('MIT');
		});
	});

	describe('read() with a bad filename', function () {

		it('will return an error', function (done) {
			var source = new FileSource(path.join(__dirname, '../fixtures/CATS'));
			source.read(function (err) {
				err.should.be.an.object;
				done();
			});
		});

	});

});
