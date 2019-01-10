const gulp = require ('gulp');
const sass = require ('gulp-sass');
const watch = require ('gulp-watch');
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


gulp.task('style', function(){
  gulp.watch(paths.styles.src).on('change', function() {
    return gulp.src(paths.styles.src)
      .pipe(sass())
      .pipe(gulp.dest(paths.styles.dest))
  });
});
