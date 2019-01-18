"use strict";

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const plumber = require ('gulp-plumber');
const sourcemaps = require ('gulp-sourcemaps');
const gulpIf = require ('gulp-if');
const del = require ('del');
const newer = require ('gulp-newer');
const imagemin = require ('gulp-imagemin');
const postcss = require ('gulp-postcss');
const autoprefixer = require ('autoprefixer');

const isDevelopment = true;

const debug = require ('gulp-debug');

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
      .pipe(postcss([autoprefixer()]))
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
    .pipe(newer('source'))
    .pipe(debug({title: 'copy'}))
    .pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  return gulp.src(path.src.img)
    .pipe(newer(path.build.img))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'copy')));

gulp.task('watch', function () {
  gulp.watch(path.watch.style, gulp.series('styles'));
  gulp.watch('source/**/*', gulp.series('copy'));
});

gulp.task('dev', gulp.series('build','watch'));
