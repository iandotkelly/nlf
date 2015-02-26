'use strict';

var editDistance = require('fast-levenshtein').get,
	assert = require('assert');


function editDistanceMatch(text, licenseNames, spdxLicenses, take) {
	assert(licenseNames.length > 0, 'licenseNames must be non-empty');
	assert(Object.keys(spdxLicenses).length >= licenseNames.length,
				 'spdxLicenses must be at least as long as licenseNames');

	if (!take) {
		take = 500;
	}

	var scores = licenseNames.map(function(name) {
		var score = editDistance(
      text.slice(0,take), spdxLicenses[name].license.slice(0,take));
		return {name: name, score: score};
	});

	var bestScore = scores[0];
	scores.forEach(function(score) {
		if (score.score < bestScore.score) {
			bestScore = score;
		}
	});

	return bestScore.name;
}

module.exports = editDistanceMatch;
