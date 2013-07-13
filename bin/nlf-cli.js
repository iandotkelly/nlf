#!/usr/bin/env node

/**
 *
 * @description cli for nlf
 *
 * @author Ian Kelly
 * @copyright Copyright (C) Ian Kelly
 *
 * @license http://opensource.org/licenses/MIT The MIT License
 * 
 */

'use strict';

var program = require('commander'),
	pjson = require('../package.json'),
	nlf = require('../lib/nlf');

program
	.command('nlf')
	.version(pjson.version)
	.parse(process.argv);

nlf.find(process.cwd(), function (err, data) {

	if (err) {
		console.error(err);
		process.exit(1);
	}

	if (data && data.length > 0) {
		var moduleIndex;
		console.log(data[0].csvHeading());
		for (moduleIndex = 0; moduleIndex < data.length; moduleIndex++) {
			console.log(data[moduleIndex].toCsvRecord());
		}
	}

});

