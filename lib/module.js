
/**
 *
 * @description Represents a module
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013
 *
 * @license http://opensource.org/licenses/MIT The MIT License
 * 
 */

'use strict';

/**
 * Constructor for Module object - represents one module in the dependency chain
 * 
 * @param {String} name       The name of the module
 * @param {String} repository The repository of the module
 * @param {String} type       The type of the module 
 *                            (e.g. production, development)
 */
function Module(name, version, repository, type) {

	if (!name) {
		throw new Error('name must be defined');
	}

	this.name = name;
	this.repository = repository;
	this.type = type;

	this.licenses = {
		'package': [],
		'readme': [],
		'license': []
	};
}

/**
 * Return the module as a CSV record
 * 
 * @return {String} The Module as a CSV record
 */
Module.prototype.toCsvRecord = function () {

	// @todo - what do do if any of the data contains a comma?
	// put double quotes around the value?
	return this.name + ',' +
			(this.repository || '(none)') + ',' +
			(this.type || '(none)') + ',' +
			this.summaryLicenses().join(';') + ',' +
			this.licenses.package.sort().join(';') + ',' +
			this.licenses.license.sort().join(';') + ',' +
			this.licenses.readme.sort().join(';');
};

/**
 * Return a de-duplicated list of all licenses
 * 
 * @return {Array} An array of license strings
 */
Module.prototype.summaryLicenses = function () {

	var dedupe = {},
		licenseSource,
		index,
		output = [],
		licenseName;

	// de-duplicate the licenses arrays, using an object to store values as properties
	for (licenseSource in this.licenses) {
		if (this.licenses.hasOwnProperty(licenseSource)) {
			for (index = this.licenses[licenseSource].length - 1; index >= 0; index--) {
				dedupe[this.licenses[licenseSource][index]] = null;
			}
		}
	}

	// convert back to an array
	for (licenseName in dedupe) {
		if (dedupe.hasOwnProperty(licenseName)) {
			output.push(licenseName);
		}
	}

	// add unknown, if there are none
	if (output.length === 0) {
		output.push('Unknown');
	}

	return output.sort();
};

/**
 * Returns the CSV column headings
 * @return {[type]} [description]
 */
Module.prototype.csvHeading = function () {
	return 'name,repository,type,summary,' +
			'from package.json,from license,from readme';
};

module.exports = Module;