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

var preRegex = '(?:^|\\s|"|\\()';
var postRegex ='(?:$|\\s|"|\\))';

function regexpBuilder(text, flags) {
	return new RegExp(preRegex + text + postRegex, flags);
}

var patterns = [ {
		'name': 'BSD',
		'regex': [
			regexpBuilder('BSD'),
		]
	},
	{
		'name': 'GPL',
		'regex': [
			regexpBuilder('GPL', 'i'),
			regexpBuilder('GPLv\\d')
		]
	},
	{
		'name': 'Public Domain',
		'regex': [
			regexpBuilder('Public domain', 'i'),
		]
	},
	{
		'name': 'LGPL',
		'regex': [
			regexpBuilder('LGPL'),
		]
	},
	{
		'name': 'MIT',
		'regex' : [
			/(?:^|\s)MIT(?:$|\s)/,
			/(?:^|\s)\(MIT\)(?:$|\s)/
		]
	},
	{
		'name': 'Apache',
		'regex': [
			regexpBuilder('Apache\\sLicen[cs]e', 'i')
		]
	},
	{
		'name': 'MPL',
		'regex': [
			regexpBuilder('MPL')
		]
	},
	{
		'name': 'WTFPL',
		'regex': [
			regexpBuilder('WTFPL'),
			regexpBuilder(
				'DO\\sWHAT\\sTHE\\sFUCK\\sYOU\\sWANT\\sTO\\sPUBLIC\\sLICEN[CS]E',
				'i'
			)
		]
	},
	{
		'name': 'ISC',
		'regex': [
			regexpBuilder('ISC')
		]
	},
	{
		'name': 'Eclipse Public License',
		'regex': [
			regexpBuilder('Eclipse\\sPublic\\sLicen[cs]e', 'i'),
			regexpBuilder('EPL'),
			regexpBuilder('EPL-1\\.0')
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
