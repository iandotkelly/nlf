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
	path = require('path');

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

	var count = 0;

	/**
	 * Recursively parse some readInstalled module data, including all dependencies
	 * 
	 * @param  {Object}		moduleData	The module data
	 * @param  {Object}		output		The output data
	 * @param  {Function}	callback	Callback 
	 */
	(function parseModuleData(moduleData, output, callback) {

		if (!output.hasOwnProperty(moduleData._id)) {
			count++;
			createModule(moduleData, function (err, module) {

				if (err) {
					callback(err);
				}

				output[moduleData._id] = module;

				for (var dependencyName in moduleData.dependencies || {}) {
					if (moduleData.dependencies.hasOwnProperty(dependencyName)) {
						if (typeof moduleData.dependencies[dependencyName] === 'object') {
							// this is the normal case where a dependency is an object
							// recursively parse that object
							parseModuleData(moduleData.dependencies[dependencyName],
								output, callback);
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
				count--;
			});
		}

		// if count falls to zero, we are finished
		if (count === 0) {
			callback(null, output);
		}
	})(data, {}, function (err, output) {
		if (err) {
			callback(err);
		}
		callback(null, output);
	});
}

function createModule(moduleData, callback) {

	var repository = (moduleData.repository || {}).url || '(none)',
		directory = path.relative(path.resolve(process.cwd(), '..'), moduleData.path),
		module = new Module(moduleData._id, moduleData.name,
			moduleData.version, directory, repository);


	if (moduleData.license) {
		module.licenses.package.push(moduleData.license);
	}

	callback(null, module);
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
			callback(err);
		}

		parseInstalled(data, function (err, output) {

			callback(null, stringify(output, null, 4));

		});
	});
}

module.exports = {
	'find': find
};