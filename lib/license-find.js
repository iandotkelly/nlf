/**
 *
 * @description Module for identifying license from a text string
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly
 *
 * @license The MIT License
 *
 * @@NLF-IGNORE@@
 * 
 */

'use strict';

var patterns = [ {
		'name': 'BSD',
		'regex': [
			/\sBSD\s/
		]
	},
	{
		'name': 'GPL',
		'regex': [
			/\sGPL\s/,
			/\sGPLv2\s/
		]
	},
	{
		'name': 'LGPL',
		'regex': [
			/\sLGPL\s/
		]
	},
	{
		'name': 'MIT',
		'regex' : [
			/\sMIT\s/,
			/\s\(MIT\)\s/
		]
	},
	{
		'name': 'Apache',
		'regex': [
			/\sApache\sLicen[cs]e\s/i
		]
	},
	{
		'name': 'MPL',
		'regex': [
			/\sMPL\s/
		]
	},
	{
		'name': 'WTFPL',
		'regex': [
			/\sDO\sWHAT\sTHE\sFUCK\sYOU\sWANT\sTO\sPUBLIC\sLICEN[CS]E\s/i
		]

	},
	{
		'name': 'ISC',
		'regex': [
			/\sISC\s/,
			/\s\(ISC\)\s/
		]
	}
],
	// pattern to deliberately exclude a file
	excludePattern = /@@NLF-IGNORE@@/;

/**
 * Identifies potential license text
 * 
 * @param  {String} text The text to scan
 * @return {Array}       Array of potential license names
 */
function identifyLicense(text) {

	var licenseIndex,
		regexIndex,
		pattern,
		output = [];

	// ignore files that have the ignore flag - e.g. the nfl project itself
	if (!excludePattern.test(text)) {
		for (licenseIndex = patterns.length - 1; licenseIndex >= 0; licenseIndex--) {
			pattern = patterns[licenseIndex];
			for (regexIndex = pattern.regex.length - 1; regexIndex >= 0; regexIndex--) {
				if (pattern.regex[regexIndex].test(text)) {
					output.push(pattern.name);
					break;
				}
			}
		}
	}

	return output.sort();
}

module.exports = identifyLicense;