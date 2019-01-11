const gulp = require ('gulp');
const sass = require ('gulp-sass');
const plumber = require ('gulp-plumber');
const browserSync = require ('browser-sync').create();

const paths = {
  styles: {
    src: 'source/SCSS/**/*.scss',
    dest: 'build/css/'
  },
  scripts: {
    src: 'source/js/**/*.js',
    dest: 'build/js/'
  }
};


gulp.task('styles', function(){
    return gulp.src(paths.styles.src)
      .pipe(sass())
      .pipe(plumber())
      .pipe(gulp.dest(paths.styles.dest))
});

gulp.watch(paths.styles.src, gulp.series('styles'));

