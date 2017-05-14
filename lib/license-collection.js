
/**
 * @description A collection of licenses, either file-source or package-source
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013-2017
 * @license  The MIT License
 *
 * @@NLF-IGNORE@@
 *
 */

'use strict';

const FileSource = require('./file-source');
const PackageSource = require('./package-source');

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

/**
 * Add files to a module's collection
 *
 * @param {Array}    filePaths  Array of files
 * @return
 */
LicenseCollection.prototype.addFiles = function addFile(filePaths) {
  return new Promise((resolve, reject) => {
    // if this is called with a missing or empty list - just callback
    if (!filePaths || filePaths.length === 0) {
      resolve();
      return;
    }

    /**
     * Check whether we have completed the list
     */
    let pending = filePaths.length;
    function checkDone() {
      pending -= 1;
      if (!pending) {
        resolve();
      }
    }

    // iterate over all the file paths
    filePaths.forEach((filePath) => {
      const source = new FileSource(filePath);
      this.add(source);
      source.read().then(checkDone).catch(reject);
    });
  });
};

/**
 * Add licenses from package.json file
 *
 * @param {Object} moduleData The package.json data
 * @param {Object} module     The module to add the licenses to
 */
LicenseCollection.prototype.addPackage = function addPackage(moduleData) {
  const licenses = moduleData.licenses;
  const license = moduleData.license;

  // simple license declarations first - snyk puts 'none' if it was missing
  if (license !== 'none') {
    this.add(new PackageSource(license));
  }

  if (licenses) {
    // correct use of licenses array
    if (Array.isArray(licenses)) {
      for (let index = 0; index < licenses.length; index += 1) {
        if (licenses[index]) {
          this.add(new PackageSource(licenses[index]));
        }
      }
    } else if (typeof licenses === 'string' || typeof licenses === 'object') {
      // some modules incorrectly have a string or object licenses property
      this.add(new PackageSource(licenses));
    }
  }
};

module.exports = LicenseCollection;
