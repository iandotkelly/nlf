/* jshint -W068, -W100 */

/**
 * @description Unit tests standard formatter
 */

'use strict';

const standardFormat = require('../../..').standardFormatter;
const Module = require('../../..').Module;
const PackageSource = require('../../..').PackageSource;
const FileSource = require('../../..').FileSource;
const path = require('path');

const input = [];

require('should');

// input module
const mod = new Module('test@1.0.0', 'test', '1.0.0', '/dir/test');
mod.licenseSources.package.add(new PackageSource('Apache'));
mod.licenseSources.license.add(
  new FileSource(path.join(__dirname, '../../fixtures/MIT')));
mod.licenseSources.readme.add(
  new FileSource(path.join(__dirname, '../../fixtures/MIT')));
input.push(mod);

// expected reponse
const expected = 'test@1.0.0 [license(s): Apache, MIT]\n'
  + '├── package.json:  Apache\n'
  + '├── license files: MIT\n'
  + '└── readme files: MIT\n\n'
  + 'LICENSES: Apache, MIT\n';

const expectedWithDatailSummary = 'test@1.0.0 [license(s): Apache, MIT]\n'
  + '├── package.json:  Apache\n'
  + '├── license files: MIT\n'
  + '└── readme files: MIT\n\n'
  + 'LICENSES:\n'
  + '├─┬ Apache\n'
  + '│ └── test@1.0.0\n'
  + '└─┬ MIT\n'
  + '  └── test@1.0.0\n';

describe('standard formatter', () => {
  describe('render method', () => {
    describe('with no callback', () => {
      it('should throw', () => {
        mod.licenseSources.license.sources[0].read((licenseErr) => {
          if (licenseErr) {
            throw licenseErr;
          }

          mod.licenseSources.readme.sources[0].read((readmeErr) => {
            if (readmeErr) {
              throw readmeErr;
            }

            (() => {
              standardFormat.render(input);
            }).should.throw();
          });
        });
      });
    });


    describe('with no data', () => {
      it('should return an error', () => {
        standardFormat.render(undefined, {}, (err) => {
          err.should.be.an.object;
        });
      });
    });


    describe('with badly typed data', () => {
      it('should return an error', () => {
        standardFormat.render(1, {}, (err) => {
          err.should.be.an.object;
        });

        standardFormat.render(true, {}, (err) => {
          err.should.be.an.object;
        });

        standardFormat.render('cats', {}, (err) => {
          err.should.be.an.object;
        });
      });
    });


    describe('with an empty array', () => {
      it('should return an error', () => {
        standardFormat.render([], {}, (err) => {
          err.should.be.an.object;
        });
      });
    });

    it('should return a record in the expected format', (done) => {
      mod.licenseSources.license.sources[0].read()
      .then(() => {
        mod.licenseSources.readme.sources[0].read()
      .then(() => {
        standardFormat.render(input, { summaryMode: 'simple' }, (renderErr, output) => {
          if (renderErr) {
            throw renderErr;
          }

          output.should.be.equal(expected);
          done();
        });
      }).catch((err) => {
        throw err;
      });
      });
    });

    it('should return detail summary', (done) => {
      mod.licenseSources.license.sources[0].read()
      .then(() => {
        mod.licenseSources.readme.sources[0].read()
      .then(() => {
        standardFormat.render(input, { summaryMode: 'detail' }, (renderErr, output) => {
          if (renderErr) {
            throw renderErr;
          }

          output.should.be.equal(expectedWithDatailSummary);
          done();
        });
      });
      }).catch((err) => {
        throw err;
      });
    });
  });
});
