
/**
 * @description A collection of licenses, either file-source or package-source
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013
 * @license  The MIT License
 *
 * @@NLF-IGNORE@@
 * 
 */

'use strict';

/**
 * Constructor
 */
function LicenseCollection() {

	this.sources = [];

}

/**
 * Returns a summary of licenses
 * 
 * @return {Array} Array of license names, deduplicated and orered
 */
LicenseCollection.prototype.summary = function () {

	var dedup = {},
		output = [],
		names,
		name,
		nameIndex,
		sourceIndex;

	for (sourceIndex = 0; sourceIndex < this.sources.length; sourceIndex++) {
		names = this.sources[sourceIndex].names();
		for (nameIndex = 0; nameIndex < names.length; nameIndex++) {
			name = names[nameIndex];
			if (!dedup.hasOwnProperty(name)) {
				dedup[name] = null;
			}
		}
	}

	// convert back to an array
	for (name in dedup) {
		if (dedup.hasOwnProperty(name)) {
			output.push(name);
		}
	}

	return output.sort();
};

/**
 * Add a source to the collection 
 * 
 * @param  {Object} source The source to add
 */
LicenseCollection.prototype.add = function (source) {

	if (typeof source !== 'object') {
		throw new Error('source must be an object');
	}

	this.sources.push(source);
};

module.exports = LicenseCollection;