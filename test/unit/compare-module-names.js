

/**
 * @description Unit tests for the compare-module-names module
 */

'use strict';

var compare = require('../../lib/compare-module-names');
var Module = require('../..').Module;

require('should');

describe('compare-module-names', function () {

	describe('where names are different', function () {

		describe('and versions the same', function () {

			it('they should be ordered correctly', function () {
				var module1 = new Module('aaa@1.0.0',
					'aaa', '1.0.0', '/', '', 'production');
				var module2 = new Module('bbb@1.0.0',
					'bbb', '1.0.0', '/', '', 'production');
				compare(module1, module2).should.equal(-1);
				compare(module2, module1).should.equal(1);
			});
		});

		describe('and versions are different', function () {

			it('they should be ordered correctly', function () {
				var module1 = new Module('aaa@2.0.0',
					'aaa', '2.0.0', '/', '', 'production');
				var module2 = new Module('bbb@1.0.0',
					'bbb', '1.0.0', '/', '', 'production');
				compare(module1, module2).should.equal(-1);
				compare(module2, module1).should.equal(1);
			});
		});

	});

	describe('where names are the same', function () {

		describe('and versions the same', function () {

			it('they should be ordered correctly', function () {
				var module1 = new Module('aaa@1.0.0',
					'aaa', '1.0.0', '/', '', 'production');
				var module2 = new Module('aaa@1.0.0',
					'aaa', '1.0.0', '/', '', 'production');
				compare(module1, module2).should.equal(0);
				compare(module2, module1).should.equal(0);
			});
		});

		describe('and versions are different', function () {

			it('they should be ordered correctly', function () {
				var module1 = new Module('aaa@2.0.0',
					'aaa', '2.0.0', '/', '', 'production');
				var module2 = new Module('aaa@1.0.0',
					'aaa', '1.0.0', '/', '', 'production');
				compare(module1, module2).should.equal(1);
				compare(module2, module1).should.equal(-1);
			});
		});

		describe('and versions have alpha or beta modifiers', function () {

			it('they should be ordered correctly', function () {
				var module1 = new Module('aaa@1.0.0',
					'aaa', '1.0.0', '/', '', 'production');
				var module2 = new Module('aaa@1.0.0-alpha1',
					'aaa', '1.0.0-alpha1', '/', '', 'production');
				compare(module1, module2).should.equal(1);
				compare(module2, module1).should.equal(-1);
			});
		});
	});
});
