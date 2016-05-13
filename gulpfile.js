const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const  source = require('vinyl-source-stream');

// Gulp dependencies go here
gulp.task('watch',function() {
	gulp.watch(['./public/es6/*.js'],['build','browserify']);
});
gulp.task('default',['build','browserify','watch']);
gulp.task('build', function() {

  // Run ESLint
  gulp.src(["es6/**/*.js", "public/es6/**/*.js"]).pipe(eslint()).pipe(eslint.format());
  // Node source
  gulp.src("es6/**/*.js").pipe(babel()).pipe(gulp.dest("dist"));
  // browser source
  gulp.src("public/es6/**/*.js").pipe(babel()).pipe(gulp.dest("public/dist"));
});
gulp.task('browserify', function() {
   return browserify('./public/dist/wolves.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/dist/'));
});
