/**
 * @description Unit tests for the license-find.js module
 *
 * @@NLF-IGNORE@@
 */

'use strict';

const licenseFind = require('../..').licenseFind;

require('should');

describe('license-find', () => {
  it('should be a function', () => {
    licenseFind.should.be.a.function;
  });

  describe('with GPL text', () => {
    it('should return GPL', () => {
      const output = licenseFind('blah GPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('GPL');
    });

    it('at the start should still return GPL', () => {
      const output = licenseFind('GPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('GPL');
    });
  });

  describe('with LGPL text', () => {
    it('should return LGPL', () => {
      const output = licenseFind('blah LGPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('LGPL');
    });

    it('at the start should still return LGPL', () => {
      const output = licenseFind('LGPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('LGPL');
    });
  });

  describe('with GPLvx text', () => {
    it('should return GPL', () => {
      let output = licenseFind('blah GPLv2 blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('GPL');

      output = licenseFind('blah GPLv9 blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('GPL');
    });

    it('at the start should still return GPL', () => {
      const output = licenseFind('GPLv2 blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('GPL');
    });
  });

  describe('with MIT text', () => {
    it('should return MIT', () => {
      const output = licenseFind('blah MIT blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MIT');
    });

    it('at the start should still return MIT', () => {
      const output = licenseFind('MIT blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MIT');
    });
  });

  describe('with (MIT) text', () => {
    it('should return MIT', () => {
      const output = licenseFind('blah (MIT) blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MIT');
    });

    it('at the start should still return MIT', () => {
      const output = licenseFind('(MIT) blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MIT');
    });
  });

  describe('with MPL text', () => {
    it('should return MPL', () => {
      const output = licenseFind('blah MPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MPL');
    });

    it('at the start should still return MPL', () => {
      const output = licenseFind('MPL blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('MPL');
    });
  });

  describe('with Apache License text', () => {
    it('should return Apache', () => {
      const output = licenseFind('blah Apache\nLicense blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('Apache');
    });

    it('at the start should still return Apache', () => {
      const output = licenseFind('Apache\nLicense blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('Apache');
    });
  });


  describe('with DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE text', () => {
    it('should return WTFPL', () => {
      const output =
        licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('WTFPL');
    });

    it('at the start should still return WTFPL', () => {
      const output = licenseFind('DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('WTFPL');
    });

    it('in any case should still return WTFPL', () => {
      const output = licenseFind('dO WHAT the fUck you want tO PUBLIC licensE blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('WTFPL');
    });

    it('with British spelling should still return WTFPL', () => {
      const output =
        licenseFind('blah DO WHAT THE FUCK YOU WANT TO PUBLIC LICENCE blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('WTFPL');
    });
  });

  describe('with ISC text', () => {
    it('should return ISC', () => {
      const output =
        licenseFind('blah ISC blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('ISC');
    });

    it('at the start should still return ISC', () => {
      const output = licenseFind('ISC blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('ISC');
    });
  });

  describe('with Eclipse Public License text', () => {
    describe('in full', () => {
      it('should return Eclipse Public License', () => {
        const output =
          licenseFind('blah EPL blah');
        output.length.should.be.equal(1);
        output[0].should.be.equal('Eclipse Public License');
      });
    });

    describe('in abbreviation', () => {
      it('should return Eclipse Public License', () => {
        let output = licenseFind('blah EPL blah');
        output.length.should.be.equal(1);
        output[0].should.be.equal('Eclipse Public License');

        output = licenseFind('blah EPL-1.0 blah');
        output.length.should.be.equal(1);
        output[0].should.be.equal('Eclipse Public License');
      });

      it('at the start should still return Eclipse Public License', () => {
        let output = licenseFind('EPL blah');
        output.length.should.be.equal(1);
        output[0].should.be.equal('Eclipse Public License');

        output = licenseFind('EPL-1.0 blah');
        output.length.should.be.equal(1);
        output[0].should.be.equal('Eclipse Public License');
      });
    });
  });

  describe('with BSD text', () => {
    it('should return BSD', () => {
      const output = licenseFind('blah BSD blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('BSD');
    });

    it('at the start should still return BSD', () => {
      const output = licenseFind('BSD blah');
      output.length.should.be.equal(1);
      output[0].should.be.equal('BSD');
    });
  });

  describe('with dual license, e.g. GPL & MIT text', () => {
    it('should return GPL & MIT', () => {
      const output = licenseFind('blah MIT blah\n\ncats GPL cats');
      output.length.should.be.equal(2);
      output[0].should.be.equal('GPL');
      output[1].should.be.equal('MIT');
    });
  });
});
