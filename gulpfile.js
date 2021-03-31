const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const dist = './_site/dist';

function cleanDist() {
  return src(dist, { allowEmpty: true }).pipe(clean({ force: true }));
}

function css() {
  return src('./src/styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(dest(dist));
}

function js() {
  return src('./src/js/script.js').pipe(dest(dist));
}

function startWatchers() {
  watch('./src/styles/**/*.scss', css);
  watch('./src/js/script.js', js);
}

exports.default = series(cleanDist, css, js, startWatchers);
exports.build = series(cleanDist, css, js);
