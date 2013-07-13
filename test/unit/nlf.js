/**
 * @description Unit tests for the nlf.js module
 */

'use strict';

var nlf = require('../../lib/nlf'),
  path = require('path');

describe('nlf', function () {

  describe('.find()', function () {

    // simple 'does it return in a timely manner'
    it('should work', function (done) {

      this.timeout(50000);
      
      nlf.find({ directory: path.join(__dirname, '../..') }, function (err, data) {
        if (err) {
          return done(err);
        }

        done();
      });
    });
  });
});
