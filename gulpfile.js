'use strict';
/*global jasmine:true */

var
    clean    = require('./lib/clean'),
    middle   = require('@whitneyit/middle'),

    gulp     = require('gulp'),
    eslint   = require('gulp-eslint'),
    istanbul = require('gulp-istanbul'),
    jasmine  = require('gulp-jasmine'),
    jscs     = require('gulp-jscs'),
    serve    = require('gulp-serve');

gulp.task('clean:coverage', function (done) {
    clean('coverage', done);
});

gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', 'index.js', 'lib/**/*.js', 'tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(jscs());
});

gulp.task('serve:coverage', serve({
    'middleware' : middle('coverage'),
    'port'       : 3333,
    'root'       : 'coverage'
}));

gulp.task('test', ['clean:coverage'], function (done) {
    gulp.src(['lib/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(['tests/**/*.spec.js'])
                .pipe(jasmine())
                .pipe(istanbul.writeReports({
                    'dir'       : 'coverage/lcov',
                    'reporters' : ['lcov', 'text-summary']
                }))
                .on('end', done);
        });
});

gulp.task('default', ['lint', 'test']);
