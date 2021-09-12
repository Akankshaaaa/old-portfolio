const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano =  require('cssnano');
const autoprefixer = require('autoprefixer');
const { src, series, parallel, dest, watch} = require('gulp');

const jsPath = 'src/js/**/*.js';
const cssPath = 'src/css/**/*.css';


function copyHtml() {
	return src('src/*.html').pipe(gulp.dest('dist'));
}

function jsTask() {
	return src(jsPath)
	.pipe(sourcemaps.init())
	.pipe(terser())
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/js'));
}


function cssTask() {
	return src(cssPath)
	.pipe(sourcemaps.init())
	.on('CssSyntaxError', function (er) {
  console.error('Throwing error:', er);
	})
	.pipe(concat('base.css'))
	.pipe(postcss([autoprefixer(), cssnano()]))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('dist/css'));
}

function watchTask() {
	watch([cssPath, jsPath], { interval: 1000 }, parallel(jsTask));
}

exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.copyHtml = copyHtml;
exports.default = series(
	parallel(copyHtml, cssTask, jsTask),
	watchTask
	);
