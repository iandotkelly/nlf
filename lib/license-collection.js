
/**
 * @description A collection of licenses, either file-source or package-source
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013
 * @license  The MIT License
 *
 * @@NLF-IGNORE@@
 *
 */

'use strict';

/**
 * Constructor
 */
function LicenseCollection() {
  this.sources = [];
}

/**
 * Returns a summary of licenses
 *
 * @return {Array} Array of license names, deduplicated and ordered
 */
LicenseCollection.prototype.summary = function summary() {
  /* eslint no-prototype-builtins: "off" */
  const dedup = {};

  // deduplicate using keys of object
  for (const source of this.sources) {
    for (const name of source.names()) {
      dedup[name] = null;
    }
  }

  // convert keys back to an array
  return Object.keys(dedup).sort();
};

/**
 * Add a source to the collection
 *
 * @param  {Object} source The source to add
 */
LicenseCollection.prototype.add = function add(source) {
  if (typeof source !== 'object') {
    throw new Error('source must be an object');
  }

  this.sources.push(source);
};

module.exports = LicenseCollection;
