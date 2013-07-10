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

var program = require('commander'),
	pjson = require('../package.json'),
	nlf = require('../lib/nlf');

program
	.command('nlf')
	.version(pjson.version)
	.option('-p, --production', 'production dependencies only, ignore any devDependencies in package.json')
	.option('-c, --csv', 'report in csv format')
	.parse(process.argv);

nlf.find('.', function(err, data) {
	console.log(data);
});


// blah - do stuff

