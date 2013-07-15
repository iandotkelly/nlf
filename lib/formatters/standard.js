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
	};

	if (moduleData.licenseSources.package.sources.length > 0) {
		output.nodes.push('package.json:  '
			+ moduleData.licenseSources.package.summary());
	}

	if (moduleData.licenseSources.license.sources.length > 0) {
		output.nodes.push('license files: '
			+ moduleData.licenseSources.license.summary());
	}

	if (moduleData.licenseSources.readme.sources.length > 0) {
		output.nodes.push('readme files: '
			+ moduleData.licenseSources.readme.summary());
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

	if (!Array.isArray(licenseData)) {
		return callback(new Error('licenseData must be an array'));
	}

	if (licenseData.length < 1) {
		return callback(new Error('must have at least one module in data'));
	}

	if (typeof callback !== 'function') {
		return callback(new Error('must have a callback'));
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