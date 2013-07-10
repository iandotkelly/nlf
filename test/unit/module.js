
'use strict';

var Module = require('../../lib/module'),
	should = require('should');

describe('Module', function () {

	describe('constructor', function () {

		it('should be a method', function () {
			Module.should.be.a.function;
		});

		it('with sensible parameters should return an object', function () {
			var myObject = new Module('my-module', 'https://myhost/myrepo');
			myObject.should.be.an.object;
		});


		it('should set the name and repository', function () {
			var myModule = new Module('my-module', 'https://myhost/myrepo');
			myModule.name.should.be.equal('my-module');
			myModule.repository.should.be.equal('https://myhost/myrepo');
			should.not.exist(myModule.type);
		});

		it('should set the type', function () {
			var myModule = new Module('my-module', 'https://myhost/myrepo', 'development');
			myModule.type.should.be.equal('development');
		});

		it('with no name should throw an exception', function () {
			(function () {
 				new Module();
			}).should.throw();
		});

		it('should have a licenses object with empty arrays in it', function () {
			var myModule = new Module('my-module');
			myModule.licenses.should.be.an.object;
			myModule.licenses.package.should.be.an.array;
			myModule.licenses.package.length.should.be.equal(0);
			myModule.licenses.readme.should.be.an.array;
			myModule.licenses.readme.length.should.be.equal(0);
			myModule.licenses.license.should.be.an.array;
			myModule.licenses.license.length.should.be.equal(0);
		});

	});

	describe('summary method', function() {

		it('when initialized should only Unknown in it', function () {
			var myModule = new Module('my-module'),
				summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(1);
			summary[0].should.be.equal('Unknown');
		});

		it('when a single package license is added, should appear in the summary', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.package.push('MIT');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(1);
			summary[0].should.be.equal('MIT');			
		});

		it('when a two different package licenses are added, they appear in the summary alphabetically', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.package.push('MIT');
			myModule.licenses.package.push('Apache');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(2);
			summary[0].should.be.equal('Apache');	
			summary[1].should.be.equal('MIT');
		});


		it('when a single license file license is added, should appear in the summary', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.license.push('MIT');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(1);
			summary[0].should.be.equal('MIT');			
		});


		it('when a two different license file licenses are added, they appear in the summary alphabetically', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.license.push('MIT');
			myModule.licenses.license.push('Apache');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(2);
			summary[0].should.be.equal('Apache');	
			summary[1].should.be.equal('MIT');
		});

		it('when a single readme license is added, should appear in the summary', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.readme.push('MIT');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(1);
			summary[0].should.be.equal('MIT');			
		});


		it('when a two different readme licenses are added, they appear in the summary alphabetically', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.readme.push('MIT');
			myModule.licenses.readme.push('Apache');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(2);
			summary[0].should.be.equal('Apache');	
			summary[1].should.be.equal('MIT');
		});

		it('duplicate licenses from different sources are removed from the summary', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.package.push('MIT');
			myModule.licenses.package.push('Apache');
			myModule.licenses.package.push('GPL');
			myModule.licenses.license.push('MIT');
			myModule.licenses.license.push('Apache');
			myModule.licenses.readme.push('MIT');
			myModule.licenses.readme.push('Apache');
			summary = myModule.summaryLicenses();
			summary.should.be.an.array;
			summary.length.should.be.equal(3);
			summary[0].should.be.equal('Apache');	
			summary[1].should.be.equal('GPL');	
			summary[2].should.be.equal('MIT');
		});

	});

	describe('csvHeading method', function () {

		it('should return the correct string', function () {
			var myModule = new Module('my-module');
			myModule.csvHeading().should.equal('name,repository,type,summary,from package.json,from license,from readme');
		});

	});


	describe('toCsvRecord method', function () {

		it('should return the correct string', function () {
			var myModule = new Module('my-module'),
				summary;
			myModule.licenses.package.push('MIT');
			myModule.licenses.package.push('GPL');
			myModule.licenses.license.push('MIT');
			myModule.licenses.license.push('Apache');
			myModule.licenses.readme.push('MIT');
			myModule.licenses.readme.push('Apache');
			myModule.toCsvRecord().should.equal('my-module,(none),(none),Apache;GPL;MIT,GPL;MIT,Apache;MIT,Apache;MIT');
		});
	});

});
