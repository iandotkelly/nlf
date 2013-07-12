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
	Module = require('./module'),
	path = require('path'),
	glob = require('glob'),
	FileSource = require('./file-source'),
	PackageSource = require('./package-source'),
	matchNodeModules = /node_modules\//;

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

		// a module with this ID (name@version) is already in the output
		// collection, we don't need to process it again
		if (!output.hasOwnProperty(moduleData._id)) {

			// we need to lock this ID now in case another function call does this
			output[moduleData._id] = null;

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

				// iterate over all the dependencies - if any
				var dependencies = moduleData.dependencies || {},
					name;

				for (name in dependencies) {
					if (dependencies.hasOwnProperty(name)) {
						if (typeof dependencies[name] === 'object') {
							// this is the normal case where a dependency is an object
							// recursively parse that object
							parseModuleData(dependencies[name], output);
						} else {
							// if a module is in the project package.json file but
							// has not yet been npm installed, it will just be a string and
							// no futher detail should be
							console.warn('Warning: dependency "' + name +
								'" probably not installed.');
							console.warn('please install dependencies from npm before running nlf');
						}
					}
				}

				// if count falls to zero, we are finished
				if (count === 0) {
					callback(null, output);
				}
			});
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
		return callback(new Error('pattern must be a string'));
	}

	if (typeof directory !== 'string') {
		return callback(new Error('directory must be a string'));
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
 * Add files to a module's collection
 * 
 * @param {Array}    filePaths  Array of file paths
 * @param {Array }   collection The collection to add the fileSource objects to
 * @param {Function} callback   Callback (err);
 */
function addFiles(filePaths, collection, callback) {

	// if this is called with a missing or empty list - just callbacj
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

		addFiles(licenseFiles, module.licenseSources.license, function (err) {

			if (err) {
				return callback(err);
			}

			// glob for readme files
			findPotentialLicenseFiles(directory, '**/*readme*',
				function (err, readmeFiles) {

				if (err) {
					return callback(err);
				}

				addFiles(readmeFiles, module.licenseSources.readme, function (err) {

					if (err) {
						return callback(err);
					}

					// finally, if there is data in package.json relating to licenses
					if (moduleData.license) {
						module.licenseSources.package.add(new PackageSource(moduleData.license));
					}

					callback(null, module);
				});
			});
		});
	});
}

function convertToArray(object) {

	var propertyName,
		output = [];


	for (propertyName in object) {
		if (object.hasOwnProperty(propertyName)) {
			output.push(object[propertyName]);
		}
	}

	return output;

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
	directory = directory || process.cwd();

	/**
	 * Function called when readInstalled hits an issue
	 *
	 * @param  {String} output The error message
	 */
	function log(output) {
		console.error('Error in reading node_module dependencies, error was: '
			+ output);
	}

	// use npm read-installed module to search out all the node modules
	readInstalled(directory, null, log, function (err, data) {

		if (err) {
			console.error('Serious problem reading node_module dependencies');
			return callback(err);
		}

		// parse the read-installed data
		parseInstalled(data, function (err, output) {

			if (err) {
				return callback(err);
			}

			// return the output
			callback(null, convertToArray(output));
		});
	});
}

module.exports = {
	'find': find,
	'Module': Module,
	'FileSource': FileSource,
	'PackageSource': PackageSource
};
