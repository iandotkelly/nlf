/* eslint no-console: "off" */

/**
 *
 * @description Performs license search
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013
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
const glob = require('glob-all');
const FileSource = require('./file-source');
const PackageSource = require('./package-source');
const csvFormatter = require('./formatters/csv');
const standardFormatter = require('./formatters/standard');
const LicenseCollection = require('./license-collection');
const licenseFind = require('./license-find');
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
 * Perform a glob search, but specifically ignoring
 * the node_modules folder, and not using the glob
 * 'ignore' as this is just a final filter on the result
 * and is very slow
 *
 * @param {String}   directory   The path of the directory to search from
 * @param {String}   filePattern A glob file pattern, e.g. *.js
 * @returns {Promise}
 */
function globIgnoringModules(directory, filePattern) {
  return new Promise((resolve, reject) => {
    // find all the subdirectories, but ignoring the node modules
    glob('*/', {
      cwd: directory,
      ignore: ['**/node_modules/**', '**/bower_components/**'],
    }, (initerr, subdirs) => {
      if (initerr) {
        reject(initerr);
        return;
      }

      // convert the directories into individual glob patterns
      const globpatterns = [];
      for (let index = 0; index < subdirs.length; index += 1) {
        globpatterns.push(`${subdirs[index]}**/${filePattern}`);
      }

      // add a pattern for the root directory
      globpatterns.push(filePattern);

      // now do the glob proper
      glob(globpatterns, {
        nocase: true,
        cwd: directory,
        ignore: ['**/node_modules/**', '**/bower_components/**'],
      }, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  });
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
    globIgnoringModules(directory, pattern).then((files) => {
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
 * Add files to a module's collection
 *
 * @param {Array}    filePaths  Array of file s
 * @param {Array }   collection The collection to add the fileSource objects to
 * @param {Function} callback   Callback (err);
 */
function addFiles(filePaths, collection) {
  return new Promise((resolve, reject) => {
    // if this is called with a missing or empty list - just callback
    if (!filePaths || filePaths.length === 0) {
      reject(null);
      return;
    }

    let fileIndex;
    let pending = filePaths.length;
    let source;

    /**
     * Check whether we have completed the list
     */
    function checkDone() {
      pending -= 1;
      if (!pending) {
        resolve();
      }
    }

    // iterate over all the file paths
    for (fileIndex = 0; fileIndex < filePaths.length; fileIndex += 1) {
      source = new FileSource(filePaths[fileIndex]);
      collection.add(source);
      // read the files
      source.read().then(checkDone).catch(reject);
    }
  });
}

/**
 * Add licenses from package.json file
 *
 * @param {Object} moduleData The package.json data
 * @param {Object} module     The module to add the licenses to
 */
function addPackageJson(moduleData, module) {
  const licenses = moduleData.licenses;
  const license = moduleData.license;

  // finally, if there is data in package.json relating to licenses
  // simple license declarations first - snyk puts 'none' if it was missing
  if (license !== 'none') {
    module.licenseSources.package.add(new PackageSource(license));
  }

  if (licenses) {
    // correct use of licenses array
    if (Array.isArray(licenses)) {
      for (let index = 0; index < licenses.length; index += 1) {
        if (licenses[index]) {
          module.licenseSources.package.add(new PackageSource(licenses[index]));
        }
      }
    } else if (typeof licenses === 'string' || typeof licenses === 'object') {
      // some modules incorrectly have a string or object licenses property
      module.licenseSources.package.add(new PackageSource(licenses));
    }
  }
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
      addFiles(licenseFiles, module.licenseSources.license);
    })
    .then(() => {
      // glob for readme files
      findPotentialLicenseFiles(directory, '*readme*');
    }).then((readmeFiles) => {
      addFiles(readmeFiles, module.licenseSources.readme);
    })
    .then(() => {
      addPackageJson(moduleData, module);
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
