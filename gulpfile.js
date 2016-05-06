const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

// Gulp dependencies go here
gulp.task('watch',function() {
	gulp.watch(['./public/es6/*.js'],['build']);
});
gulp.task('default',['build','watch']);
gulp.task('build', function() {

  // Run ESLint
  gulp.src(["es6/**/*.js", "public/es6/**/*.js"]).pipe(eslint()).pipe(eslint.format());
  // Node source
  gulp.src("es6/**/*.js").pipe(babel()).pipe(gulp.dest("dist")); 
  // browser source
  gulp.src("public/es6/**/*.js").pipe(babel()).pipe(gulp.dest("public/dist"));
});
