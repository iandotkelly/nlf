/**
 * @description Unit tests standard formatter
 */

'use strict';

const csvFormat = require('../../..').csvFormatter;
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
input.push(mod);


// expected reponse
const expected = 'name,version,directory,repository,summary,from package.json,'
  + 'from license,from readme\n'
  + 'test,1.0.0,/dir/test,(none),Apache;MIT,Apache,MIT,';

describe('csv formatter', () => {
  describe('render method', () => {
    describe('with no callback', () => {
      it('should throw', () => {
        mod.licenseSources.license.sources[0].read((err) => {
          if (err) {
            throw err;
          }

          (() => {
            csvFormat.render(input);
          }).should.throw();
        });
      });
    });

    describe('with no data', () => {
      it('should return an error', () => {
        csvFormat.render(undefined, {}, (err) => {
          err.should.be.an.object;
        });
      });
    });


    describe('with badly typed data', () => {
      it('should return an error', () => {
        csvFormat.render(1, {}, (err) => {
          err.should.be.an.object;
        });

        csvFormat.render(true, {}, (err) => {
          err.should.be.an.object;
        });

        csvFormat.render('cats', {}, (err) => {
          err.should.be.an.object;
        });
      });
    });

    describe('with an empty array', () => {
      it('should return an error', () => {
        csvFormat.render([], {}, (err) => {
          err.should.be.an.object;
        });
      });
    });

    describe('with good data', () => {
      it('should return a record in the expected format', (done) => {
        mod.licenseSources.license.sources[0].read((licenseErr) => {
          if (licenseErr) {
            throw licenseErr;
          }

          csvFormat.render(input, {}, (renderErr, output) => {
            if (renderErr) {
              throw renderErr;
            }

            output.should.be.equal(expected);
            done();
          });
        });
      });
    });
  });
});
