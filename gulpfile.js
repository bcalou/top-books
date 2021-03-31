const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imageResize = require('gulp-image-resize');
const rename = require('gulp-rename');
const webp = require('gulp-webp');

const dist = './_site/dist';

function cleanDist() {
  return src(dist, { allowEmpty: true }).pipe(clean({ force: true }));
}

async function images() {
  return series(
    parallel(resizeImages.bind(this, 700), resizeImages.bind(this, 350)),
    convertToWebp
  )();
}

function resizeImages(size) {
  return src('./src/img/*.jpg')
    .pipe(imageResize({ width: size, height: size }))
    .pipe(rename((path) => (path.basename += '_' + size)))
    .pipe(dest(dist));
}

function convertToWebp() {
  return src(`${dist}/*.jpg`).pipe(webp()).pipe(dest(dist));
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

exports.default = series(cleanDist, images, css, js, startWatchers);
exports.build = series(cleanDist, images, css, js);
