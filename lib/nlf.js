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
	Module = require('./module');

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

	var output = parseModule(data);

	callback(null, output);

}

function parseModule(moduleData, output) {

	output = output || {};

	var id = moduleData._id;

	var repository = (moduleData.repository || {}).url || 'none'; 
	var currentModule = new Module(id, moduleData.path, repository);

	if (moduleData.license) {
		currentModule.licenses.package.push(moduleData.license);
	}

	if (!output.hasOwnProperty(id)) {
		output[id] = currentModule;
	}

	if (moduleData.dependencies) {
		for (var propertyName in moduleData.dependencies) {
			if (moduleData.dependencies.hasOwnProperty(propertyName)) {
				var dependency = moduleData.dependencies[propertyName];
				if (typeof dependency !== 'object') {
					console.warn('warning ' + propertyName + 'probably not installed');
				} else {
					// if this has not been installed, then it will just be a string
				
					parseModule(moduleData.dependencies[propertyName], output);
				}
			}
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