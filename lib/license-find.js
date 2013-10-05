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
			/(?:^|\s)BSD\s/
		]
	},
	{
		'name': 'GPL',
		'regex': [
			/(?:^|\s)GPL\s/,
			/(?:^|\s)GPLv\d\s/
		]
	},
	{
		'name': 'LGPL',
		'regex': [
			/(?:^|\s)LGPL\s/
		]
	},
	{
		'name': 'MIT',
		'regex' : [
			/(?:^|\s)MIT\s/,
			/(?:^|\s)\(MIT\)\s/
		]
	},
	{
		'name': 'Apache',
		'regex': [
			/(?:^|\s)Apache\sLicen[cs]e\s/i
		]
	},
	{
		'name': 'MPL',
		'regex': [
			/(?:^|\s)MPL\s/
		]
	},
	{
		'name': 'WTFPL',
		'regex': [
			/(?:^|\s)WTFPL\s/,
			/(?:^|\s)DO\sWHAT\sTHE\sFUCK\sYOU\sWANT\sTO\sPUBLIC\sLICEN[CS]E\s/i
		]
	},
	{
		'name': 'ISC',
		'regex': [
			/(?:^|\s)ISC\s/,
			/(?:^|\s)\(ISC\)\s/
		]
	},
	{
		'name': 'Eclipse Public License',
		'regex': [
			/(?:^|\s)Eclipse\sPublic\sLicen[cs]e\s/i,
			/(?:^|\s)EPL\s/,
			/(?:(?:^|\s)|\()EPL-1\.0(?:\)|\s)/
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