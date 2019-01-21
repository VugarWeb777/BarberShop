"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');//Отслеживание ошибок
const sourcemaps = require('gulp-sourcemaps');// Исходные карты
const gulpIf = require('gulp-if');// Условия
const del = require('del');// моудль удаления
const newer = require('gulp-newer');//копирует только измененые файлы
const autoPrefix = require('gulp-autoprefixer');
const remember = require('gulp-remember');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');// Минификатор css
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

const isDevelopment = true;//статус разработки

const debug = require('gulp-debug');//дебаг

const path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: '/build/',
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


gulp.task('styles', function () {
  return gulp.src(path.src.style, {since: gulp.lastRun('styles')})
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return{
          title: 'Styles',
          message: err.message
        };
      })
    }))
    .pipe(remember('styles'))
    .pipe(gulpIf(isDevelopment === true, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoPrefix({browsers: ['last 2 versions']}))
    .pipe(gulp.dest(path.build.css))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('style.min.css'))
    .pipe(gulpIf(isDevelopment === true, sourcemaps.write()))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream())
});


gulp.task('clean', function () {
  return del('build');
});
gulp.task('copy', function () {
  return gulp.src([
    path.src.fonts,
    path.src.img,
    path.src.js,
    path.src.html
  ], {since: gulp.lastRun('copy'), base: 'source'})
    .pipe(newer('build'))
    .pipe(debug({title: 'copy'}))
    .pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  return gulp
    .src(path.build.img)
    .pipe((imagemin([
      imagemin.jpegtran({progressive: true, arithmetic: true, buffer: true}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ])))
    .pipe(gulp.dest(path.build.img));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
  browserSync.watch('source/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
  'clean',
  gulp.parallel('copy', 'styles')));

gulp.task('watch', function () {
  gulp.watch(path.watch.style, gulp.series('styles'));
  gulp.watch('source/**/*', gulp.series('copy'));
});

gulp.task('build', gulp.series('dev', gulp.parallel('watch', 'serve')));





