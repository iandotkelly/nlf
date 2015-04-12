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
 * Create an archy formatted summary of the licenses found
 *
 * @param {Array} summaryData Array of licenses found
 */
function createSummary(summaryData) {
	return archy({
		label: 'LICENSES: ' + summaryData.sort().join(', ')
	});
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
	var summary = [];

	// go through all the modules, adding them to
	// the output archy formatted data
	licenseData.forEach(function (module) {
		output.push(createModuleNode(module));
		// add new licenses to the summary
		var moduleLicenses = module.summary();
		for (var index = 0; index < moduleLicenses.length; index++) {
			if (summary.indexOf(moduleLicenses[index]) === -1) {
				summary.push(moduleLicenses[index]);
			}
		}
	});

	// add the summary
	output.push(createSummary(summary));

	callback(null, output.join('\n'));
}


module.exports = {
	render: render
};
