/**
 * @description Unit tests for the nlf.js module
 */

'use strict';

var nlf = require('../..'),
	path = require('path');

describe('nlf', function () {

	describe('.find()', function () {

		// simple 'does it return in a timely manner'
		it('should work', function (done) {

			this.timeout(50000);
			
			nlf.find(
				{
					directory: path.join(__dirname, '../..')
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
					directory: path.join(__dirname, '../..'),
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
					directory: path.join(__dirname, '../..'),
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

	});
});

