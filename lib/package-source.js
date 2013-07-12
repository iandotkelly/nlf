/**
 * @description A package.json source for a potential license
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly 2013
 *
 * @license  The MIT License
 */

'use strict';

/**
 * Constructor
 * 
 * @param   {String/Object} licenseProperty	The property from package.json
 * @returns {Object}						The PackageSource object
 */
function PackageSource(licenseProperty) {

	switch (typeof licenseProperty) {
	case 'string':
		this.license = licenseProperty;
		this.url = '(none)';
		break;
	case 'object':
		this.license = licenseProperty.type;
		this.url = licenseProperty.url;
		break;
	default:
		throw new Error('licenseProperty must be a string or an object');
	}

	return this;
}

/**
 * Returns which licenses this file potentially declares
 * 
 * @return {Array} Array of license name strings
 */
PackageSource.prototype.names = function () {

	return [ this.license ];

};

module.exports = PackageSource;