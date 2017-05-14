/**
 * @description Unit tests for the file-source.js module
 */

'use strict';

const FileSource = require('../..').FileSource;
const path = require('path');
const fs = require('fs');

const mitFile = fs.readFileSync(path.join(__dirname, '../fixtures/MIT'), 'utf-8');

require('should');

describe('FileSource', () => {
  describe('constructor', () => {
    it('should be a method', () => {
      FileSource.should.be.a.Function();
    });

    it('which throws exception with no path', () => {
      /* eslint no-new: "off" */
      (() => {
        new FileSource();
      }).should.throw();
    });

    it('which should create an initialized object with a path parameter', () => {
      const source = new FileSource('/dir/filename');
      source.filePath.should.be.equal('/dir/filename');
      source.text.should.be.equal('');
      source.names().length.should.be.equal(0);
    });
  });

  describe('read an MIT license', () => {
    let source;

    beforeEach((done) => {
      source = new FileSource(path.join(__dirname, '../fixtures/MIT'));
      source.read().then(done);
    });

    it('should contain the MIT text', () => {
      source.text.should.not.be.equal('');
      source.text.should.be.equal(mitFile);
    });

    it('should detect an MIT license only', () => {
      const licenses = source.names();
      licenses.length.should.be.equal(1);
      licenses[0].should.be.equal('MIT');
    });
  });

  describe('read() with a bad filename', () => {
    it('will return an error', (done) => {
      const source = new FileSource(path.join(__dirname, '../fixtures/CATS'));
      source.read().then(() => {
        throw new Error('should not reach here');
      }).catch((err) => {
        err.should.be.an.object;
        done();
      });
    });
  });
});
