
/**
 *
 * @description Represents a module
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013
 *
 * @license http://opensource.org/licenses/MIT The MIT License
 *
 */

'use strict';

const LicenseCollection = require('./license-collection');

/**
 * Constructor for Module object - represents one module in the dependency chain
 *
 * @param {String} name       The name of the module
 * @param {String} directory  The directory of the module
 * @param {String} repository The repository of the module
 * @param {String} type       The type of the module
 *                            (e.g. production, development)
 */
function Module(id, name, version, directory, repository, type) {
  if (!id) {
    throw new Error('id must be defined');
  }

  if (!directory) {
    throw new Error('directory must be defined');
  }

  this.id = id;
  this.name = name;
  this.version = version;
  this.repository = (repository || '(none)')
    .replace('git://', 'http://')
    .replace('.git', '')
    .replace(/^git\+/, '');
  this.directory = directory;
  this.type = type || '(none)';

  this.licenseSources = {
    package: new LicenseCollection(),
    license: new LicenseCollection(),
    readme: new LicenseCollection(),
  };
}

/**
 * Return a de-duplicated list of all licenses
 *
 * @return {Array} An array of license strings
 */
Module.prototype.summary = function summary() {
  const dedupe = {};
  let all = [];

  // concatenate all the different license source collections
  Object.keys(this.licenseSources).forEach((source) => {
    all = all.concat(this.licenseSources[source].summary());
  });

  for (const licenseName of all) {
    dedupe[licenseName] = null;
  }

  // convert back to an array
  const output = Object.keys(dedupe);

  // add unknown, if there are none
  if (output.length === 0) {
    output.push('Unknown');
  }

  return output.sort();
};

module.exports = Module;
