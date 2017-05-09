/* eslint "import/no-extraneous-dependencies": ["error", {"devDependencies": true}] */
/* eslint-env node, mocha */

/**
 * @description Unit tests for the compare-module-names module
 */

'use strict';

const compare = require('../../lib/compare-module-names');
const Module = require('../..').Module;

require('should');

describe('compare-module-names', () => {
  describe('where names are different', () => {
    describe('and versions the same', () => {
      it('they should be ordered correctly', () => {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production');
        const module2 = new Module('bbb@1.0.0',
          'bbb', '1.0.0', '/', '', 'production');
        compare(module1, module2).should.equal(-1);
        compare(module2, module1).should.equal(1);
      });
    });

    describe('and versions are different', () => {
      it('they should be ordered correctly', () => {
        const module1 = new Module('aaa@2.0.0',
          'aaa', '2.0.0', '/', '', 'production');
        const module2 = new Module('bbb@1.0.0',
          'bbb', '1.0.0', '/', '', 'production');
        compare(module1, module2).should.equal(-1);
        compare(module2, module1).should.equal(1);
      });
    });
  });

  describe('where names are the same', () => {
    describe('and versions the same', () => {
      it('they should be ordered correctly', () => {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production');
        const module2 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production');
        compare(module1, module2).should.equal(0);
        compare(module2, module1).should.equal(0);
      });
    });

    describe('and versions are different', () => {
      it('they should be ordered correctly', () => {
        const module1 = new Module('aaa@2.0.0',
          'aaa', '2.0.0', '/', '', 'production');
        const module2 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production');
        compare(module1, module2).should.equal(1);
        compare(module2, module1).should.equal(-1);
      });
    });

    describe('and versions have alpha or beta modifiers', () => {
      it('they should be ordered correctly', () => {
        const module1 = new Module('aaa@1.0.0',
          'aaa', '1.0.0', '/', '', 'production');
        const module2 = new Module('aaa@1.0.0-alpha1',
          'aaa', '1.0.0-alpha1', '/', '', 'production');
        compare(module1, module2).should.equal(1);
        compare(module2, module1).should.equal(-1);
      });
    });
  });
});
