
'use strict';

var readInstalled = require('read-installed'),
	stringify = require('json-stringify-safe');

/**
 * Function called when readInstalled hits an issue
 * I want this to be logged to std-error
 * 
 * @param  {String} output The error message 
 */
function log(output) {
	console.error('Error in reading node_module dependencies, error was: ' + output);
}

function find(directory, callback) {

	directory = directory || '.';

	readInstalled(directory, null, log, function (err, data) {

		if (err) {
			console.error('Serious problem reading node_module dependencies');
			callback(err);
		}

		callback(null, stringify(data, null, 4));
	});
}

module.exports = {
	'find': find
};