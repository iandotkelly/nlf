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
	fs = require('fs'),
	glob = require('glob'),
	FileSource = require('./file-source'),
	PackageSource = require('./package-source'),
	csvFormatter = require('./formatters/csv'),
	standardFormatter = require('./formatters/standard'),
	LicenseCollection = require('./license-collection'),
	licenseFind = require('./license-find'),
	matchNodeModules = /node_modules\//;

/**
 * Is this module a development dependency of its parent?
 *
 * @param  {Object}  moduleData The module's data
 * @return {Boolean}            True if the module is a production dependency
 */
function isDevDependency(moduleData) {

	// this might be the root object - which by definition is production
	if (moduleData.parent === undefined) {
		return false;
	}

	var dependencies = moduleData.parent.devDependencies || {},
		dependencyName;

	// look for this module in the production dependencies of the parent
	// and return true if it is found
	for (dependencyName in dependencies) {
		if (dependencies.hasOwnProperty(dependencyName)) {
			if (dependencyName === moduleData.name) {
				return true;
			}
		}
	}

	return false;
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
	(function parseModuleData(moduleData, output) {

		// don't parse this module if it is a development dependency
		// and we are only looking for production dependencies
		if (options.production && isDevDependency(moduleData)) {
			return;
		}

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
			if (matchNodeModules.test(matchedFile)) {
				continue;
			}

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
					var index;

					if (err) {
						return callback(err);
					}

					// finally, if there is data in package.json relating to licenses
					// simple license declarations first
					if (moduleData.license) {
						module.licenseSources.package.add(new PackageSource(moduleData.license));
					}

					// more complex ones
					if (moduleData.licenses) {
						for (index = 0; index < moduleData.licenses.length; index++) {
							module.licenseSources.package.add(
								new PackageSource(moduleData.licenses[index])
							);
						}
					}

					callback(null, module);
				});
			});
		});
	});
}

/**
 * Convert an object to an array
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

	return output;
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

	if (typeof options.directory !== 'string') {
		throw new Error('options.directory must be a string');
	}

	if (typeof options.production !== 'boolean') {
		throw new Error('options.production must be a boolean');
	}

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

	/**
	 * Function called when readInstalled hits an issue
	 *
	 * @param  {String} output The error message
	 */
	function log(output) {
		console.error('Error in reading node_module dependencies, error was: '
			+ output);
	}

	if (!fileExistsSync(path.join(options.directory, 'package.json'))) {
		return callback(new Error('No package.json file found.'));
	}

	// use npm read-installed module to search out all the node modules
	readInstalled(options.directory, { log: log }, function (err, data) {

		if (err) {
			console.error('Serious problem reading node_module dependencies');
			return callback(err);
		}

		// parse the read-installed data
		parseInstalled(data, options, function (err, output) {

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
	'PackageSource': PackageSource,
	'csvFormatter': csvFormatter,
	'standardFormatter': standardFormatter,
	'licenseFind': licenseFind,
	'LicenseCollection': LicenseCollection
};
