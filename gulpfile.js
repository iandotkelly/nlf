/**
 * @description - gulp build file
 *
 * @copyright Ian Kelly 2015
 */

'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');
var coveralls = require('gulp-coveralls');

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
gulp.task('test', ['lint'], function () {
	return gulp.src(['lib/**/*.js', 'test/unit/**/*.js'], { read: false })
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.pipe(cover.instrument({
			pattern: ['lib/**/*.js']
		}))
		.pipe(mocha())
		.pipe(cover.gather())
		.pipe(cover.format())
		.pipe(gulp.dest('reports'));
});

/**
 * Task for travis-ci which pipes coverage to coveralls
 */
gulp.task('test-coveralls', ['lint'], function() {
	return gulp.src(['lib/**/*.js', 'test/unit/**/*.js'], { read: false })
		.pipe(cover.instrument({
			pattern: ['lib/**/*.js']
		}))
		.pipe(mocha())
		.pipe(cover.gather())
		.pipe(cover.format({
			reporter: 'lcov'
		}))
		.pipe(coveralls());
});

gulp.task('default', ['lint', 'test']);
gulp.task('travis', ['lint', 'test-coveralls']);
