const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const styleSource = './src/scss/styles.css';
const styleDest = './build/css/';

gulp.task('style', function(done) {
	gulp.src(styleSource)
		.pipe(sourcemaps.init())
		.pipe(sass({
			errorLogToConsole: true,
			outputStyle: 'compressed'
		}))
		.on('error', console.error.bind(console))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(rename({suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(styleDest));
	done();
	/*
	 * Use of done prevents "The following tasks did not
	 * complete: Did you forget to signal async completion?"
	**/
});
