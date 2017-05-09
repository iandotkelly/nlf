/**
 * @description - gulp build file
 *
 * @copyright Ian Kelly 2015
 */

'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');
const eslint = require('gulp-eslint');

// set coveralls environmental variable
process.env.COVERALLS_REPO_TOKEN = 'rCIR66aQA8jUA7Berlh1PHd917mjMt4hU';

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

/**
 * Task for developer test and coverage report
 */
gulp.task('test', () =>
  gulp.src(['lib/**/*.js', 'test/unit/**/*.js'], { read: false })
  .pipe(mocha()));

gulp.task('coverage', shell.task([
  './node_modules/.bin/nyc gulp test',
  './node_modules/.bin/nyc report --reporter=html',
]));

gulp.task('coveralls', shell.task([
  './node_modules/.bin/nyc gulp test',
  './node_modules/.bin/nyc report --reporter=text-lcov | coveralls',
]));

gulp.task('default', ['lint', 'test']);
gulp.task('travis', ['lint', 'test']);
