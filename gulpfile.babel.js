import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import yargs from 'yargs';
import rimraf from 'rimraf';
import eslint from 'gulp-eslint';

import {ES6_COMPILE_DIR, SRC_DIR} from './constants';

const args = yargs
    .alias('d', 'debug')
    .argv;
const isDev = args.debug; // Debug mode, will produce uncompressed debug bundle, and watch src file changes

/////////////////////////////////////
// task for code style
gulp.task('eslint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', `!${ES6_COMPILE_DIR}/**`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/////////////////////////////////////
// tasks to compile es6 to es5 code
gulp.task('clean-es6-output', () => {
    rimraf.sync(`${ES6_COMPILE_DIR}/*`);
});
gulp.task('compile-es6', () => {
    return gulp.src(`${SRC_DIR}/**/*.js`)
        .pipe(gulpBabel())
        .pipe(gulp.dest(ES6_COMPILE_DIR));
});
gulp.task('watch-compile-es6', () => {
    return gulp.watch(`${SRC_DIR}/**/*.js`, ['compile-es6']);
});

gulp.task('default', ['clean-es6-output', (isDev ? 'watch-compile-es6' : 'compile-es6')]);
