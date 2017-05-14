/**
 * @description Unit tests for globIgnoringModules
 */

'use strict';

const glob = require('../../lib/globIgnoringModules');
const path = require('path');

const fixturePath = path.resolve('test/fixtures/glob');

require('should');

describe('globIgnoringModules', () => {
  it('is a function', () => {
    glob.should.be.a.Function();
  });

  it('should return a promise', (done) => {
    const promise = glob();
    promise.should.be.an.Object();
    promise.then.should.be.a.Function();
    done();
  });

  it('will complain if there is no path', (done) => {
    const promise = glob();
    promise
    .then(() => {
      done(new Error('This should not resolve'));
    })
    .catch((err) => {
      (err instanceof TypeError).should.be.True();
      done();
    });
  });

  it('will complain if there is no pattern', (done) => {
    const promise = glob(fixturePath);
    promise
    .then(() => {
      done(new Error('This should not resolve'));
    })
    .catch((err) => {
      (err instanceof TypeError).should.be.True();
      done();
    });
  });

  it('with a valid directory and path will return correct results', (done) => {
    const promise = glob(fixturePath, 'module*');
    promise
    .then((results) => {
      results.should.be.an.Array();
      results.length.should.equal(2);
      results[0].should.be.equal('lib/module.js');
      results[1].should.be.equal('module.js');
      done();
    })
    .catch(done);
  });

  it('with no matching file should return an empty array', (done) => {
    const promise = glob(fixturePath, 'blah');
    promise
    .then((results) => {
      results.should.be.an.Array();
      results.length.should.equal(0);
      done();
    })
    .catch(done);
  });
});
