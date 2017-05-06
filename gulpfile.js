/**
 * @description - gulp build file
 *
 * @copyright Ian Kelly 2015
 */

'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');

// set coveralls environmental variable
process.env['COVERALLS_REPO_TOKEN'] = 'rCIR66aQA8jUA7Berlh1PHd917mjMt4hU';

/**
 * Linting task
 */
gulp.task('lint', function() {
	return gulp.src(['lib/**/*.js', 'test/unit/**/*.js', 'gulpfile.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Task for developer test and coverage report
 */
gulp.task('test', function () {
	return gulp.src(['lib/**/*.js', 'test/unit/**/*.js'], { read: false })
		.pipe(mocha());
});

gulp.task('coveralls', shell.task([
	'./node_modules/.bin/nyc gulp test',
	'./node_modules/.bin/nyc report | coveralls'
]));

gulp.task('default', ['lint', 'test']);
gulp.task('travis', ['lint', 'test']);
gulp.task('coverage', ['coveralls']);
