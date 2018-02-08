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

var resolveDeps = require('snyk-resolve-deps');
var compareModuleNames = require('./compare-module-names');
var Module = require('./module');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var FileSource = require('./file-source');
var PackageSource = require('./package-source');
var csvFormatter = require('./formatters/csv');
var standardFormatter = require('./formatters/standard');
var LicenseCollection = require('./license-collection');
var licenseFind = require('./license-find');

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
 * Parse the data returned by readInstalled
 *
 * @param  {Object}		data     readInstalled data
 * @param  {Object}		options  the options object
 * @param  {Array}		output   The output array
 * @param  {Function}	callback Callback function
 */
function parseInstalled(data, options, callback) {

	// count of outstanding unfinished parse functions
	var count = 0;

	/**
	 * Recursively parse some readInstalled module data, including all dependencies
	 *
	 * @param  {Object}		moduleData	The module data
	 * @param  {Object}		output		The output data
	 * @param  {Function}	callback	Callback
	 */
	(function parseModuleData(moduleData, currentDepth, output) {

		// don't parse this module if it is a development dependency
		// and we are only looking for production dependencies
		if (options.production && isDevDependency(moduleData)) {
			return;
		}

		// a module with this ID (name@version) is already in the output
		// collection, we don't need to process it again
		if (!output.hasOwnProperty(moduleData.full)) {

			// we need to lock this ID now in case another function call does this
			output[moduleData.full] = null;

			// we're going to call the async function - so increase count
			count++;
			createModule(moduleData, function (err, module) {
				// decrease count when it returns
				count--;

				if (err) {
					return callback(err);
				}

				// add this module to the output object/collection
				output[moduleData.full] = module;

				// iterate over all the dependencies - if any
				var dependencies = moduleData.dependencies || {},
					name;

				if (currentDepth < options.depth) {
					for (name in dependencies) {
						if (dependencies.hasOwnProperty(name)) {
							if (typeof dependencies[name] === 'object') {
								// this is the normal case where a dependency is an object
								// recursively parse that object
								parseModuleData(dependencies[name], currentDepth + 1, output);
							} else {
								// TODO: is this required?
								// if a module is in the project package.json file but
								// has not yet been npm installed, it will just be a string and
								// no futher detail should be
								console.warn('Warning: dependency "' + name +
									'" probably not installed.');
								console.warn('please install dependencies from npm before running nlf');
							}
						}
					}
				}

				// if count falls to zero, we are finished
				if (count === 0) {
					callback(null, output);
				}
			});
		}

	})(data, 0, {});
}

/**
 * Perform a glob search, but specifically ignoring
 * the node_modules folder, and not using the glob
 * 'ignore' as this is just a final filter on the result
 * and is very slow
 *
 * @param {String}   directory   The path of the directory to search from
 * @param {String}   filePattern A glob file pattern, e.g. *.js
 * @param {Function} callback    (err, results)
 */
function globIgnoringModules(directory, filePattern, callback) {

	// find all the subdirectories, but ignoring the node modules
	glob('*/', {
		cwd: directory,
		ignore: ['**/node_modules/**', '**/bower_components/**']
	}, function(err, subdirs) {
		if (err) {
			return callback(err);
		}

		// convert the directories into individual glob patterns
		var globpatterns = [];
		for (var index = 0; index < subdirs.length; index++) {
			globpatterns.push(subdirs[index] + '**/' + filePattern);
		}

		// add a pattern for the root directory
		globpatterns.push(filePattern);

		// now do the glob proper
		glob(globpatterns, {
			nocase: true,
			cwd: directory,
			ignore: ['**/node_modules/**', '**/bower_components/**']
		}, callback);

	});
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
		return callback(new Error('pattern must be a string'));
	}

	if (typeof directory !== 'string') {
		return callback(new Error('directory must be a string'));
	}

	// glob to find all files that match the pattern
	globIgnoringModules(directory, pattern, function (err, files) {

		if (err) {
			return callback(err);
		}

		var fileIndex,
			matchedFile,
			found = [];

		for (fileIndex = files.length - 1; fileIndex >= 0; fileIndex--) {
			matchedFile = files[fileIndex];

			var filePath = path.join(directory, matchedFile);
			// check that it is a file
			if (fs.statSync(filePath).isFile()) {
				found.push(filePath);
			}
		}

		callback(null, found);
	});
}


/**
 * Add files to a module's collection
 *
 * @param {Array}    filePaths  Array of file s
 * @param {Array }   collection The collection to add the fileSource objects to
 * @param {Function} callback   Callback (err);
 */
function addFiles(filePaths, collection, callback) {

	// if this is called with a missing or empty list - just callback
	if (!filePaths || filePaths.length === 0) {
		return callback(null);
	}

	var fileIndex,
		pending = filePaths.length,
		source;

	/**
	 * Check whether we have completed the list
	 */
	function checkDone(err) {
		if (err) {
			callback(err);
		}

		pending--;
		if (!pending) {
			callback(null);
		}
	}

	// iterate over all the file paths
	for (fileIndex = 0; fileIndex < filePaths.length; fileIndex++) {
		source = new FileSource(filePaths[fileIndex]);
		collection.add(source);
		// read the files
		source.read(checkDone);
	}
}

/**
 * Add licenses from package.json file
 *
 * @param {Object} moduleData The package.json data
 * @param {Object} module     The module to add the licenses to
 */
function addPackageJson(moduleData, module) {

	var licenses = moduleData.licenses,
		license = moduleData.license;

	// finally, if there is data in package.json relating to licenses
	// simple license declarations first - snyk puts 'none' if it was missing
	if (license !== 'none') {
		module.licenseSources.package.add(new PackageSource(license));
	}

	if (licenses) {
		// correct use of licenses array
		if (Array.isArray(licenses)) {
			for (var index = 0; index < licenses.length; index++) {
				if (licenses[index]) {
					module.licenseSources.package.add(
						new PackageSource(licenses[index])
					);
				}
			}
		} else if (typeof licenses === 'string' || typeof licenses === 'object') {
			// some modules incorrectly have a string or object licenses property
			return module.licenseSources.package.add(new PackageSource(licenses));
		}
	}
}

/**
 * Create a module object from a record in readInstalled
 *
 * @param  {Object}   moduleData The module data object
 * @param  {Function} callback   Callback (err, Array of module object)
 */
function createModule(moduleData, callback) {

	var repository = (moduleData.repository || {}).url || 
	    moduleData.repository || '(none)';
	var directory = path.dirname(moduleData.__filename);
	var id = moduleData.full;
	var name = moduleData.name || id;
	var version = moduleData.version || '0.0.0';
	var module = new Module(id, name, version, directory, repository);

	// glob for license files
	findPotentialLicenseFiles(directory, '*li@(c|s)en@(c|s)e*',
		function (err, licenseFiles) {

		if (err) {
			return callback(err);
		}

		addFiles(licenseFiles, module.licenseSources.license, function (err) {

			if (err) {
				return callback(err);
			}

			// glob for readme files
			findPotentialLicenseFiles(directory, '*readme*',
				function (err, readmeFiles) {

				if (err) {
					return callback(err);
				}

				addFiles(readmeFiles, module.licenseSources.readme, function (err) {
					if (err) {
						return callback(err);
					}

					addPackageJson(moduleData, module);

					callback(null, module);
				});
			});
		});
	});
}

/**
 * Convert the module list object to an array
 *
 * @param  {Object} object The object
 * @return {Array}         An array made from each property of the object
 */
function convertToArray(object) {

	var propertyName,
		output = [];

	for (propertyName in object) {
		if (object.hasOwnProperty(propertyName)) {
			output.push(object[propertyName]);
		}
	}

	output.sort(compareModuleNames);

	return output;
}

function processOptionSummaryMode(options) {
	options.summaryMode = options.summaryMode || 'simple';
	if (typeof options.summaryMode !== 'string') {
		throw new Error('options.summaryMode must be a string');
	}
	options.summaryMode = options.summaryMode.toLowerCase();
}

/**
 * Process the options
 *
 * @param  {Object} options The options object passed into find()
 * @return {Object}         Options that have been massaged
 */
function processOptions(options) {

	options = options || {};

	if (typeof options !== 'object') {
		throw new Error('options must be an object');
	}

	options.directory = options.directory || process.cwd();
	options.production = options.production || false;
	options.depth = typeof options.depth === 'number' ? options.depth : Infinity;

	if (typeof options.directory !== 'string') {
		throw new Error('options.directory must be a string');
	}

	if (typeof options.production !== 'boolean') {
		throw new Error('options.production must be a boolean');
	}

	processOptionSummaryMode(options);

	return options;
}


/**
 * Does a file exist?
 *
 * @param  {String} filePath The path of the file
 * @return {Boolean}         True if the file exists
 */
function fileExistsSync(filePath) {

	try {
		var stats = fs.statSync(filePath);
		return stats.isFile();
	} catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

/**
 * Function to find licenses
 *
 * @param  {Object}   options   Options object
 * @param  {Function} callback  Callback function
 */
function find(options, callback) {

	// process arguments
	if (typeof options === 'function' && callback === undefined) {
		callback = options;
		options = undefined;
	}

	try {
		options = processOptions(options);
	} catch (err) {
		return callback(err);
	}

	if (!fileExistsSync(path.join(options.directory, 'package.json'))) {
		return callback(new Error('No package.json file found.'));
	}

	var depOptions = {
		dev: true,
		extraFields: [ 'repository', 'licenses', 'license' ]
	};

	// use resolve dependency tree - whether this is npm2 or npm3
	resolveDeps(options.directory, depOptions).then(function (data) {

		// parse the deps data
		parseInstalled(data, options, function (err, output) {

			if (err) {
				return callback(err);
			}

			// return the output
			callback(null, convertToArray(output));
		});

	}).catch(function(err) {
		console.error('Serious problem reading node_module dependencies');
		return callback(err);
	});

}


module.exports = {
	'find': find,
	'Module': Module,
	'FileSource': FileSource,
	'PackageSource': PackageSource,
	'csvFormatter': csvFormatter,
	'standardFormatter': standardFormatter,
	'licenseFind': licenseFind,
	'LicenseCollection': LicenseCollection
};
