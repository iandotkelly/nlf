/**
 *
 * @description Module for identifying license from a text string
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly
 *
 * @license The MIT License
 *
 * @@NLF-IGNORE@@
 *
 */

'use strict';

function regexpBuilder(text, flags) {
  return new RegExp(`(?:^|\\s|"|\\()${text}(?:$|\\s|"|\\))`, flags);
}

const patterns = [{
  name: 'BSD',
  regex: [
    regexpBuilder('BSD'),
  ],
}, {
  name: 'GPL',
  regex: [
    regexpBuilder('GPL', 'i'),
    regexpBuilder('GPLv\\d'),
  ],
}, {
  name: 'Public Domain',
  regex: [
    regexpBuilder('Public domain', 'i'),
  ],
}, {
  name: 'LGPL',
  regex: [
    regexpBuilder('LGPL'),
  ],
}, {
  name: 'MIT',
  regex: [
    /(?:^|\s)MIT(?:$|\s)/,
    /(?:^|\s)\(MIT\)(?:$|\s)/,
  ],
}, {
  name: 'Apache',
  regex: [
    regexpBuilder('Apache\\sLicen[cs]e', 'i'),
  ],
}, {
  name: 'MPL',
  regex: [
    regexpBuilder('MPL'),
  ],
}, {
  name: 'WTFPL',
  regex: [
    regexpBuilder('WTFPL'),
    regexpBuilder('DO\\sWHAT\\sTHE\\sFUCK\\sYOU\\sWANT\\sTO\\sPUBLIC\\sLICEN[CS]E', 'i'),
  ],
}, {
  name: 'ISC',
  regex: [
    regexpBuilder('ISC'),
  ],
}, {
  name: 'Eclipse Public License',
  regex: [
    regexpBuilder('Eclipse\\sPublic\\sLicen[cs]e', 'i'),
    regexpBuilder('EPL'),
    regexpBuilder('EPL-1\\.0'),
  ],
}];

// pattern to deliberately exclude a file
const excludePattern = /@@NLF-IGNORE@@/;

/**
 * Identifies potential license text
 *
 * @param  {String} text The text to scan
 * @return {Array}       Array of potential license names
 */
function identifyLicense(text) {
  const output = [];

  // ignore files that have the ignore flag - e.g. the nfl project itself
  if (excludePattern.test(text)) {
    return output;
  }

  for (const pattern of patterns) {
    for (const regex of pattern.regex) {
      if (regex.test(text)) {
        output.push(pattern.name);
        break;
      }
    }
  }

  return output.sort();
}

module.exports = identifyLicense;
