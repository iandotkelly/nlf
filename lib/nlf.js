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

var readInstalled = require('read-installed'),
	stringify = require('json-stringify-safe'),
	Module = require('./module'),
	path = require('path'),
	glob = require('glob'),
	license = require('./license'),
	matchNodeModules = /node_modules\//;

/**
 * Function called when readInstalled hits an issue
 * I want this to be logged to std-error
 *
 * @param  {String} output The error message
 */
function log(output) {
	console.error('Error in reading node_module dependencies, error was: '
		+ output);
}

/**
 * Parse the data returned by readInstalled
 *
 * @param  {Object}   data     readInstalled data
 * @param  {Array}    output   The output array
 * @param  {Function} callback Callback function
 */
function parseInstalled(data, callback) {

	// count of outstanding unfinished parse functions
	var count = 0;

	/**
	 * Recursively parse some readInstalled module data, including all dependencies
	 *
	 * @param  {Object}		moduleData	The module data
	 * @param  {Object}		output		The output data
	 * @param  {Function}	callback	Callback
	 */
	(function parseModuleData(moduleData, output) {

		if (!output.hasOwnProperty(moduleData._id)) {

			// we're going to call the async function - so increase count
			count++;
			createModule(moduleData, function (err, module) {
				// decrease count when it returns
				count--;

				if (err) {
					return callback(err);
				}

				// add this module to the output object/collection
				output[moduleData._id] = module;

				// iterate over all the dependencies
				for (var dependencyName in moduleData.dependencies || {}) {
					if (moduleData.dependencies.hasOwnProperty(dependencyName)) {
						if (typeof moduleData.dependencies[dependencyName] === 'object') {
							// this is the normal case where a dependency is an object
							// recursively parse that object
							parseModuleData(moduleData.dependencies[dependencyName],
								output);
						} else {
							// if a module is in the project package.json file but
							// has not yet been npm installed, it will just be a string and
							// no futher detail should be
							console.warn('Warning: dependency "' + dependencyName +
								'" probably not installed.');
							console.warn('please install dependencies from npm before running nlf');
						}
					}
				}

			});
		}

		// if count falls to zero, we are finished
		if (count === 0) {
			callback(null, output);
		}
	})(data, {});
}

/**
 * Find potential license files - using glob matching
 *
 * @param  {String}   directory The directory to search in
 * @param  {String}   pattern   The glob pattern to apply
 * @param  {Function} callback  Callback (err, arrayOfPaths)
 */
function findPotentialLicenseFiles(directory, pattern, callback) {

	if (typeof pattern !== 'string') {
		callback(new Error('pattern must be a string'));
	}

	if (typeof directory !== 'string') {
		callback(new Error('directory must be a string'));
	}

	// glob to find all files that match the pattern
	glob(pattern, { nocase: true, cwd: directory }, function (err, files) {

		if (err) {
			return callback(err);
		}

		var fileIndex,
			matchedFile,
			found = [];

		for (fileIndex = files.length - 1; fileIndex >= 0; fileIndex--) {
			matchedFile = files[fileIndex];
			// exclude files found in node_modules directories
			if (!matchNodeModules.test(matchedFile)) {
				found.push(path.join(directory, matchedFile));
			}
		}

		callback(null, found);
	});
}

/**
 * Create a module object from a record in readInstalled
 *
 * @param  {Object}   moduleData The module data object
 * @param  {Function} callback   Callback (err, Array of module object)
 */
function createModule(moduleData, callback) {

	var repository = (moduleData.repository || {}).url || '(none)',
		directory = moduleData.path,
		module = new Module(moduleData._id, moduleData.name,
			moduleData.version, directory, repository);

	// glob for license files
	findPotentialLicenseFiles(directory, '**/*license*',
		function (err, licenseFiles) {

		if (err) {
			return callback(err);
		}

		// glob for readme files
		findPotentialLicenseFiles(directory, '**/*readme*',
			function (err, readmeFiles) {

			if (err) {
				return callback(err);
			}

			// @todo search files
			module.licenses.license = licenseFiles;
			module.licenses.readme = readmeFiles;

			if (moduleData.license) {
				module.licenses.package.push(moduleData.license);
			}

			callback(null, module);

		});

	});


}

/**
 * Function to find licenses
 *
 * @param  {String}   directory Relative or absolute path of
 *                              project folder containing package.json
 * @param  {Function} callback  Callback function
 */
function find(directory, callback) {

	// default to cwd
	directory = directory || '.';

	// use npm read-installed module to search out all the node modules
	// to infinite depth (null)
	readInstalled(directory, null, log, function (err, data) {

		if (err) {
			console.error('Serious problem reading node_module dependencies');
			return callback(err);
		}

		parseInstalled(data, function (err, output) {

			callback(null, stringify(output, null, 4));

		});
	});
}

module.exports = {
	'find': find
};
