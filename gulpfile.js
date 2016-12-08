var gulp = require('gulp');
var eslint = require('gulp-eslint');
var gulpopen = require('gulp-open');


var src = './src/*.js';


gulp.task('lint', function() {
    return gulp.src(src)
        .pipe(eslint({
            'rules': {
                'camelcase': 1,
                'comma-dangle': 1,
                'quotes': [1, 'single'],
                'semi': 2,
                'indent': [1, 4]
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], function() {
    console.log('Finish!');
});