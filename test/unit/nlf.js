'use strict';

var nlf = require('../../lib/nlf');

describe('nlf', function () {
  describe('.find()', function () {
    it('should work', function (done) {
      this.timeout(50000);
      nlf.find(process.cwd(), function (err, data) {
        if (err) {
          return done(err);
        }

        done();
      });
    });
  });
});
