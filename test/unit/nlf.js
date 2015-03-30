/**
 * @description Unit tests for the nlf.js module
 */

'use strict';

var nlf = require('../..');
var path = require('path');

var fixturedir = path.join(__dirname, '../fixtures/test-project');


describe('nlf', function () {

	describe('.find()', function () {

		// simple 'does it return in a timely manner'
		it('should work', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir
				},
				function (err) {

					if (err) {
						return done(err);
					}

					done();
				});
		});

		// simple 'does it return in a timely manner'
		it('should work with production only', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					production: true
				},
				function (err) {

					if (err) {
						return done(err);
					}

					done();
				});
		});

		// simple 'does it return in a timely manner'
		it('should not work in a non node directory', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: '/'
				},
				function (err) {
					err.should.be.an.object;
					err.message.should.be.equal('No package.json file found.');
					done();
				});
		});

		// simple 'does it return in a timely manner'
		it('should work even with no options', function (done) {

			this.timeout(50000);

			nlf.find(
				function (err) {

					if (err) {
						return done(err);
					}

					done();
				});
		});

		it('requires options.production to be a boolean', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					production: 'TRUE'
				},
				function (err) {
					err.should.be.an.object;
					done();
				});

		});

		it('requires options.directory to be a string', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: 1
				},
				function (err) {
					err.should.be.an.object;
					done();
				});

		});

		//parse only current package.json deps., don't traverse inward
		it('should parse with a depth of 0', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					production: true,
					depth : 0
				},
				function (err, results) {
					if (err) {
						throw err;
					}
					results.length.should.eql(2);
					done();
				});

		});

		//parse only current package.json deps., don't traverse downwards
		it('should parse with a depth of 0 including dev deps.', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					depth : 0,
					production: false
				},
				function (err, results) {
					if (err) {
						throw err;
					}
					results.length.should.eql(3);
					done();
				});

		});

		it('should parse with a depth of Infinity', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					production: true
				},
				function (err, results) {
					if (err) {
						throw err;
					}
					results.length.should.eql(3);
					done();
				});

		});

		it('should parse with a depth of Infinity with dev deps', function (done) {

			this.timeout(50000);

			nlf.find(
				{
					directory: fixturedir,
					production: false
				},
				function (err, results) {
					if (err) {
						throw err;
					}
					results.length.should.eql(7);
					done();
				});

		});
	});
});
