const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');

// Don't use ./ if you want a watch file to
// const styleSource = './src/scss/styles.css'; <-- Won't watch for new chanages
const styleSource = 'src/scss/styles.css';
const styleDest = './build/css/';

const jsSource = 'src/js/script.js';
const jsDest = './build/js/';

const styleWatch = 'src/scss/**/';
const scriptWatch = 'src/js/**/';

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

/* This is the original js task before concatting &  minifying
gulp.task('js', function(done) {
	gulp.src( jsSource)
		.pipe(gulp.dest(jsDest));
	done();
});
*/

/**
 * browserify, transform babelify [env], sundle, source,
 * rename .min, buffer, init sourcemap, uglify, write
 * sourcemap, dist
 */
gulp.task('js', function(done) {
	browserify();

});


gulp.task('watch', function() { 
	gulp.watch(styleWatch, gulp.series('style'));
	gulp.watch(scriptWatch, gulp.series('js'));
});

// Note, in Gulp4, the gulp.series or gulp.parallel is now required.
// Forgetting it can lead to a "Task function must be specified"
// error
gulp.task('default', gulp.parallel(['style', 'js']));
