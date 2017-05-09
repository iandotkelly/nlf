/**
 * @description Unit tests for the nlf.js module
 */

'use strict';

const nlf = require('../..');
const path = require('path');

const fixturedir = path.join(__dirname, '../fixtures/test-project');
const fixtureSubdirs = path.join(__dirname, '../fixtures/test-project-subdirs');
const licensesArrayDir = path.join(__dirname, '../fixtures/licenses-array');
const licenseObjectDir = path.join(__dirname, '../fixtures/license-object');
const licensesObjectDir = path.join(__dirname, '../fixtures/licenses-object');
const licensesStringDir = path.join(__dirname, '../fixtures/licenses-string');
const missingName = path.join(__dirname, '../fixtures/missing-name');

describe('nlf', () => {
  describe('.find()', () => {
    // simple 'does it return in a timely manner'
    it('should work', function test(done) {
      this.timeout(50000);
      nlf.find(
        {
          directory: fixturedir,
        },
        (err) => {
          if (err) {
            done(err);
            return;
          }

          done();
        });
    });

    // simple 'does it return in a timely manner'
    it('should work with production only', function test(done) {
      this.timeout(50000);
      nlf.find(
        {
          directory: fixturedir,
          production: true,
        },
        (err) => {
          if (err) {
            done(err);
            return;
          }

          done();
        });
    });

    // simple 'does it return in a timely manner'
    it('should not work in a non node directory', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: '/',
        },
        (err) => {
          err.should.be.an.object;
          err.message.should.be.equal('No package.json file found.');
          done();
        });
    });

    // simple 'does it return in a timely manner'
    it('should work even with no options', function test(done) {
      this.timeout(50000);
      /* eslint array-callback-return: "off" */
      nlf.find((err) => {
        if (err) {
          done(err);
          return;
        }
        done();
      });
    });

    it('requires options.production to be a boolean', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          production: 'TRUE',
        },
        (err) => {
          err.should.be.an.object;
          done();
        });
    });

    it('requires options.directory to be a string', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: 1,
        },
        (err) => {
          err.should.be.an.object;
          done();
        });
    });

    // parse only current package.json deps., don't traverse inward
    it('should parse with a depth of 0', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          production: true,
          depth: 0,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(1);
          done();
        });
    });

    // parse only current package.json deps., don't traverse inward
    it('should parse with a depth of 1', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          production: true,
          depth: 1,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(2);
          done();
        });
    });

    // parse only current package.json deps., don't traverse downwards
    it('should parse with a depth of 0 including dev deps.', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          depth: 0,
          production: false,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(1);
          done();
        });
    });

    // parse only current package.json deps., don't traverse downwards
    it('should parse with a depth of 1 including dev deps.', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          depth: 1,
          production: false,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(3);
          done();
        });
    });

    it('should parse with a depth of Infinity', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          production: true,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(4);
          done();
        });
    });

    it('should parse with a depth of Infinity with dev deps', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixturedir,
          production: false,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(7);
          done();
        });
    });

    it('should include subdirs but ignore node_modules and bower_modules', function test(done) {
      this.timeout(50000);

      nlf.find(
        {
          directory: fixtureSubdirs,
          production: false,
        },
        (err, results) => {
          if (err) {
            throw err;
          }
          results.length.should.eql(4);
          let thisProject;
          for (let i = 0; i < results.length; i += 1) {
            if (results[i].id === 'nlf-test@1.0.0') {
              thisProject = results[i].licenseSources;
            }
          }
          thisProject.package.sources.length.should.be.eql(0);
          thisProject.readme.sources.length.should.be.eql(0);
          thisProject.license.sources.length.should.be.eql(1);
          thisProject.license.sources[0].filePath.should.be.eql(
            path.join(fixtureSubdirs, 'subdir/docs/license.md'));
          done();
        });
    });

    describe('with a license object', () => {
      it('should correctly get the license', (done) => {
        nlf.find(
          {
            directory: licenseObjectDir,
          },
          (err, results) => {
            if (err) {
              throw err;
            }
            results.length.should.eql(1);
            const sources = results[0].licenseSources.package.sources;
            sources.length.should.eql(1);
            sources[0].license.should.eql('MIT');
            done();
          });
      });
    });

    describe('with a licenses object', () => {
      it('should correctly get the license', (done) => {
        nlf.find(
          {
            directory: licensesObjectDir,
          },
          (err, results) => {
            if (err) {
              throw err;
            }
            results.length.should.eql(1);
            const sources = results[0].licenseSources.package.sources;
            sources.length.should.eql(1);
            sources[0].license.should.eql('MIT');
            done();
          });
      });
    });

    describe('with an array of licenses', () => {
      it('should correctly get all licenses', (done) => {
        nlf.find(
          {
            directory: licensesArrayDir,
          },
          (err, results) => {
            if (err) {
              throw err;
            }
            results.length.should.eql(1);
            const sources = results[0].licenseSources.package.sources;
            sources.length.should.eql(2);
            sources[0].license.should.eql('MIT');
            sources[1].license.should.eql('GPLv2');
            done();
          });
      });
    });


    describe('with an (incorrect) single licenses string', () => {
      it('should correctly get the license', (done) => {
        nlf.find(
          {
            directory: licensesStringDir,
          },
          (err, results) => {
            if (err) {
              throw err;
            }
            results.length.should.eql(1);
            const sources = results[0].licenseSources.package.sources;
            sources.length.should.eql(1);
            sources[0].license.should.eql('MIT');
            done();
          });
      });
    });

    describe('with a project without name or version', () => {
      it('should correctly get the license', (done) => {
        nlf.find(
          {
            directory: missingName,
          },
          (err, results) => {
            if (err) {
              throw err;
            }
            results.length.should.be.equal(1);
            const result = results[0];
            result.name.should.be.equal('missing-name');
            result.id.should.be.equal('missing-name@0.0.0');
            result.version.should.be.equal('0.0.0');
            const sources = result.licenseSources.package.sources;
            sources.length.should.eql(1);
            sources[0].license.should.eql('MIT');
            done();
          });
      });
    });
  });
});
