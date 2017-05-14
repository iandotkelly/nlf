/* eslint no-console: "off" */
/**
 *
 * @description Performs license search
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013-2017
 *
 * @license [url] The MIT License
 *
 */

'use strict';

const resolveDeps = require('snyk-resolve-deps');
const compareModuleNames = require('./compare-module-names');
const Module = require('./module');
const path = require('path');
const fs = require('fs');
const FileSource = require('./file-source');
const PackageSource = require('./package-source');
const csvFormatter = require('./formatters/csv');
const standardFormatter = require('./formatters/standard');
const LicenseCollection = require('./license-collection');
const licenseFind = require('./license-find');
const glob = require('./globIgnoringModules');
const fileExists = require('node-file-exists').default;

/**
 * Is this module a development dependency of its parent?
 *
 * @param  {Object}  moduleData The module's data
 * @return {Boolean}            True if the module is a production dependency
 */
function isDevDependency(moduleData) {
  return moduleData.depType === 'dev';
}

/**
 * Find potential license files - using glob matching
 *
 * @param   {String}   directory The directory to search in
 * @param   {String}   pattern   The glob pattern to apply
 * @returns {Promise}
 */
function findPotentialLicenseFiles(directory, pattern) {
  return new Promise((resolve, reject) => {
    if (typeof pattern !== 'string') {
      reject(new Error('pattern must be a string'));
      return;
    }

    if (typeof directory !== 'string') {
      reject(new Error('directory must be a string'));
      return;
    }

    // glob to find all files that match the pattern
    glob(directory, pattern).then((files) => {
      const found = files.reduce((acc, file) => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isFile()) {
          acc.push(filePath);
        }
        return acc;
      }, []);
      resolve(found);
    }).catch(reject);
  });
}

/**
 * Create a module object from a record in readInstalled
 *
 * @param  {Object}   moduleData The module data object
 * @param  {Function} callback   Callback (err, Array of module object)
 */
function createModule(moduleData) {
  /* eslint no-underscore-dangle: ["error", { "allow": ["__filename"] }] */
  return new Promise((resolve, reject) => {
    const repository = (moduleData.repository || {}).url || '(none)';
    const directory = path.dirname(moduleData.__filename);
    const id = moduleData.full;
    const name = moduleData.name || id;
    const version = moduleData.version || '0.0.0';
    const module = new Module(id, name, version, directory, repository);

    // glob for license files
    findPotentialLicenseFiles(directory, '*li@(c|s)en@(c|s)e*')
    .then((licenseFiles) => {
      module.licenseSources.license.addFiles(licenseFiles);
    })
    .then(() => {
      // glob for readme files
      findPotentialLicenseFiles(directory, '*readme*');
    }).then((readmeFiles) => {
      module.licenseSources.readme.addFiles(readmeFiles);
    })
    .then(() => {
      module.licenseSources.package.addPackage(moduleData);
      resolve(module);
    })
    .catch(reject);
  });
}

/**
 * Parse the data returned by readInstalled
 *
 * @param  {Object}   data     readInstalled data
 * @param  {Object}   options  the options object
 * @param  {Array}    output   The output array
 * @param  {Function} callback Callback function
 */
function parseInstalled(data, options) {
  return new Promise((resolve, reject) => {
    // count of outstanding unfinished parse functions
    let count = 0;

    /**
     * Recursively parse some readInstalled module data, including all dependencies
     *
     * @param  {Object}   moduleData  The module data
     * @param  {Object}   output      The output data
     * @param  {Function} callback    Callback
     */
    (function parseModuleData(moduleData, currentDepth, output) {
      const currentOutput = output;
      // don't parse this module if it is a development dependency
      // and we are only looking for production dependencies
      if (options.production && isDevDependency(moduleData)) {
        return;
      }

      // a module with this ID (name@version) is already in the output
      // collection, we don't need to process it again
      if (!output.hasOwnProperty(moduleData.full)) {
        // we need to lock this ID now in case another function call does this
        currentOutput[moduleData.full] = null;

        // we're going to call the async function - so increase count
        count += 1;
        createModule(moduleData).then((module) => {
          // decrease count when it returns
          count -= 1;

          // add this module to the output object/collection
          currentOutput[moduleData.full] = module;

          // iterate over all the dependencies - if any
          const dependencies = moduleData.dependencies || {};
          let name;

          if (currentDepth < options.depth) {
            for (name in dependencies) {
              if (dependencies.hasOwnProperty(name)) {
                if (typeof dependencies[name] === 'object') {
                  // this is the normal case where a dependency is an object
                  // recursively parse that object
                  parseModuleData(dependencies[name], currentDepth + 1, currentOutput);
                } else {
                  // TODO: is this required?
                  // if a module is in the project package.json file but
                  // has not yet been npm installed, it will just be a string and
                  // no futher detail should be
                  console.warn(`Warning: dependency "${name}" probably not installed.`);
                  console.warn('please install dependencies from npm before running nlf');
                }
              }
            }
          }

          // if count falls to zero, we are finished
          if (count === 0) {
            resolve(currentOutput);
          }
        })
        .catch(reject);
      }
    }(data, 0, {}));
  });
}

/**
 * Convert the module list object to an array
 *
 * @param  {Object} object The object
 * @return {Array}         An array made from each property of the object
 */
function convertToArray(object) {
  return Object.keys(object).map(key => object[key]).sort(compareModuleNames);
}

/**
 * Process the options for summary mode
 *
 * @param  {Object} options
 * @return {Object}          Cleaned up opions
 */
function processOptionSummaryMode(options) {
  const ops = options;
  ops.summaryMode = ops.summaryMode || 'simple';
  if (typeof ops.summaryMode !== 'string') {
    throw new Error('options.summaryMode must be a string');
  }
  ops.summaryMode = ops.summaryMode.toLowerCase();
  return ops;
}

/**
 * Process the options
 *
 * @param  {Object} options The options object passed into find()
 * @return {Object}         Options that have been massaged
 */
function processOptions(options) {
  let ops = options || {};

  if (typeof ops !== 'object') {
    throw new Error('options must be an object');
  }

  ops.directory = ops.directory || process.cwd();
  ops.production = ops.production || false;
  ops.depth = typeof ops.depth === 'number' ? ops.depth : Infinity;

  if (typeof ops.directory !== 'string') {
    throw new Error('options.directory must be a string');
  }

  if (typeof ops.production !== 'boolean') {
    throw new Error('options.production must be a boolean');
  }

  ops = processOptionSummaryMode(ops);

  return ops;
}

/**
 * Function to find licenses
 *
 * @param  {Object}   options   Options object
 * @param  {Function} callback  Callback function
 */
function find(options, callback) {
  let ops = options;
  let cb = callback;

  // process arguments
  if (typeof ops === 'function' && cb === undefined) {
    cb = ops;
    ops = undefined;
  }

  try {
    ops = processOptions(ops);
  } catch (err) {
    cb(err);
    return;
  }

  if (!fileExists(path.join(ops.directory, 'package.json'))) {
    cb(new Error('No package.json file found.'));
    return;
  }

  const depOptions = {
    dev: true,
    extraFields: ['repository', 'licenses', 'license'],
  };

  // use resolve dependency tree - whether this is npm2 or npm3
  resolveDeps(ops.directory, depOptions)
  .then((data) => {
    // parse the deps data
    parseInstalled(data, options)
    .then((output) => {
      cb(null, convertToArray(output));
    });
  }).catch((err) => {
    console.log(err);
    console.error('Serious problem reading node_module dependencies');
    cb(err);
  });
}

module.exports = {
  find,
  Module,
  FileSource,
  PackageSource,
  csvFormatter,
  standardFormatter,
  licenseFind,
  LicenseCollection,
};
