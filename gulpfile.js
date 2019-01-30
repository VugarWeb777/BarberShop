"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');//Компилятор scss
const plumber = require('gulp-plumber');//Отслеживание ошибок
const sourcemaps = require('gulp-sourcemaps');// Исходные карты
const gulpIf = require('gulp-if');// Условия
const del = require('del');// моудль удаления
const newer = require('gulp-newer');//копирует только измененые файлы
const autoPrefix = require('gulp-autoprefixer');//Автопрефиксер
const remember = require('gulp-remember');//Запоминает изменения
const cleanCSS = require('gulp-clean-css');// Минификатор css
const rename = require('gulp-rename');//Переменовать
const notify = require('gulp-notify');// Уведомления
const browserSync = require('browser-sync').create();
const uglify = require ('gulp-uglify');// Минификация JS
const htmlmin = require('gulp-htmlmin');//Минификация css
/*const tinypng = require('gulp-tinypng');//Сжатие png,jpg*/
const svgstore = require ('gulp-svgstore');//SVG Спрайт
const svgmin = require ('gulp-svgmin');//Сжатие svg
const cheerio = require ('gulp-cheerio');// удаление лишнего svg



const isDevelopment = false;//статус разработки

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
        return {
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

gulp.task('js:minify', function () {
  return gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest(path.build.js))
});

gulp.task('html:minify', function () {
  return gulp.src('source/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'))
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


/*gulp.task('images', function () {
  return gulp.src('build/img/!*.{png,jpeg,jpg}')
    .pipe(tinypng('D5Mhyq57spKKcSgqQrdw9pJxLFvSNQg4'))
    .pipe(gulp.dest(path.build.img))
});*/

const clean   = require('gulp-cheerio-clean-svg');
gulp.task("svg:sprite", function () {
  return gulp.src("build/img/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio(clean({
      removeSketchType: true,
      removeEmptyGroup: true,
      removeEmptyDefs: true,
      removeEmptyLines: true,
      removeComments: true,
      tags: [
        'title',
        'desc',
      ],
      attributes: [
        'style',
        'fill*'
      ],
    })))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
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
  gulp.series('copy','styles','html:minify','js:minify','svg:sprite')));

gulp.task('watch', function () {
  gulp.watch(path.watch.style, gulp.series('styles'));
  gulp.watch('source/index.html',gulp.series('html:minify'));
  gulp.watch(path.watch.js, gulp.series('js:minify'));
  gulp.watch('source/**/*', gulp.series('copy'));
});

gulp.task('build', gulp.series('dev', gulp.parallel('watch', 'serve')));





