'use strict';

var Mocha = require('mocha'),
	reporter = process.env.MOCHA_REPORTER || 'spec',
	globs = require('globs'),
	path = require('path'),
	patterns = [];

require('should');

function test(f) {
	patterns.push(path.join(__dirname, f));
}

test('unit/**/*.js');

globs(patterns, function (err, files) {
	if (err) {
		throw err;
	}

	var mocha = new Mocha();

	mocha.files = files;
	mocha.reporter(reporter);
	mocha.run(process.exit);
});
