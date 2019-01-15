"use strict";

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const plumber = require ('gulp-plumber');
const sourcemaps = require ('gulp-sourcemaps');
const gulpIf = require ('gulp-if');
const del = require ('del');
const isDevelopment = true;
/*const debug = require ('gulp-debug');*/

const path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: { //Пути откуда брать исходники
    html: 'source/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    js: 'source/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
    style: 'source/style/style.scss',
    img: 'source/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: 'source/fonts/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'source/**/*.html',
    js: 'source/js/**/*.js',
    style: 'source/style/**/*.scss',
    img: 'source/img/**/*.*',
    fonts: 'source/fonts/**/*.*'
  },
  clean: './build'
};


gulp.task('styles', function(){
    return gulp.src(path.src.style)
      .pipe(gulpIf(isDevelopment === true, sourcemaps.init()))
      .pipe(sass())
      .pipe(plumber())
      .pipe(gulpIf(isDevelopment === true, sourcemaps.write()))
      .pipe(gulp.dest(path.build.css))
});

gulp.task('clean', function () {
  return del('build');
});
gulp.task('copy', function() {
  return gulp.src([
    path.src.fonts,
    path.src.img,
    path.src.js,
    path.src.html
  ], {since: gulp.lastRun('copy'), base: 'source'})
    .pipe(gulp.dest('build'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'copy')));

gulp.watch(path.watch.style, gulp.series('styles'));
gulp.watch('source/**/*', gulp.series('copy'));

