/**
 * @description Standard console output formatter
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013
 * @license MIT
 */

'use strict';

var archy = require('archy');

/**
 * Create the output string for a single module
 * 
 * @param  {Object} moduleData The module license data
 * @return {String}            An archy formatted string
 */
function createModuleNode(moduleData) {

	var output = {
		label: moduleData.id
			+ ' [license(s): '
			+ moduleData.summary().join(', ')
			+ ']',
		nodes: []
	},
		summary;

	summary = moduleData.licenseSources.package.summary();
	if (summary.length > 0) {
		output.nodes.push('package.json:  ' + summary.join(', '));
	}

	summary = moduleData.licenseSources.license.summary();
	if (summary.length > 0) {
		output.nodes.push('license files: ' + summary.join(', '));
	}

	summary = moduleData.licenseSources.readme.summary();
	if (summary.length > 0) {
		output.nodes.push('readme files: ' + summary.join(', '));
	}

	return archy(output);
}


/**
 * Render the license data
 * 
 * @param  {Array}    licenseData An array of module licence data
 * @param  {Function} callback    The callback (err, output string)
 */
function render(licenseData, callback) {

	if (typeof callback !== 'function') {
		throw new Error('must have a callback');
	}

	if (!Array.isArray(licenseData)) {
		return callback(new Error('licenseData must be an array'));
	}

	if (licenseData.length < 1) {
		return callback(new Error('must have at least one module in data'));
	}

	var output = [];

	licenseData.forEach(function (module) {
		output.push(createModuleNode(module));
	});

	callback(null, output.join('\n'));
}


module.exports = {
	render: render
};