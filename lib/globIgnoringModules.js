/**
 *
 * @description Perform a glob search, but specifically ignoring
 *              the node_modules folder, and not using the glob
 *              'ignore' as this is just a final filter on the result
 *              and is very slow
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2017
 *
 * @license The MIT License
 *
 */

'use strict';

const glob = require('globby');

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
    if (typeof directory !== 'string') {
      reject(new TypeError('directory should be a string'));
      return;
    }
    if (typeof filePattern !== 'string') {
      reject(new TypeError('filePattern should be a string'));
      return;
    }

    // find all the subdirectories, but ignoring the node modules
    glob('*/', {
      cwd: directory,
      ignore: ['**/node_modules/**', '**/bower_components/**'],
    })
    .then((subdirs) => {
      // convert the directories into individual glob patterns
      const globpatterns = subdirs.map(subdir => `${subdir}**/${filePattern}`);
      // add a pattern for the root directory
      globpatterns.push(filePattern);

      // now do the glob proper
      glob(globpatterns, {
        nocase: true,
        cwd: directory,
        ignore: ['**/node_modules/**', '**/bower_components/**'],
      })
      .then(resolve);
    })
    .catch(reject);
  });
}

module.exports = globIgnoringModules;
