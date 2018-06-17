'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const del = require('del');
const browserSync = require('browser-sync');

const paths = {
    pug: {
        src: 'assets/pug/pages/*.pug',
        dest: 'public/',
        watch: 'assets/pug/**/*.pug'
    },
    stylus: {
        src: 'assets/static/styles/styles.styl',
        dest: 'public/',
        watch: 'assets/static/styles/**/**/**/*.styl'
    },
    js: {
        src: 'assets/static/scripts/*.js',
        dest: 'public/',
        watch: 'assets/static/scripts/*.js'
    }, 
    img: {
        src: 'assets/static/images/**/**/*',
        dest: 'public/images/',
        watch: 'assets/static/images/**/**/*'
    },
    fonts: {
        src: 'assets/static/fonts/**/*',
        dest: 'public/fonts/',
        watch: 'assets/static/fonts/**/*'
    },
    php: {
        src: 'assets/static/*.php',
        dest: 'public/',
        watch: 'assets/static/*.php'
    },
    libs: {
        normalize: 'node_modules/normalize.css/normalize.css',
        jquery: 'node_modules/jquery/dist/jquery.min.js',
        src: 'assets/static/libs/**/**/*',
        dest: 'public/libs/',
        watch: 'assets/static/libs/**/**/*'
    },
    dir: 'public/'
}

gulp.task('clean', () => {
    return del(paths.dir);
});

gulp.task('html:build', () => {
    return gulp.src(paths.pug.src)
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest))
});

gulp.task('css:build', () => {
    return gulp.src(paths.stylus.src)
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true,
            'include css': true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.stylus.dest))
});

gulp.task('js:build', () => {
    return gulp.src(paths.js.src)
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(concat('common.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js.dest))
});

gulp.task('fonts:build', () => {
    return gulp.src(paths.fonts.src)
        .pipe(newer(paths.fonts.dest))
        .pipe(gulp.dest(paths.fonts.dest))
});

gulp.task('img:build', () => {
    return gulp.src(paths.img.src)
        .pipe(newer(paths.img.dest))
        .pipe(gulp.dest(paths.img.dest))
});

gulp.task('php:build', () => {
    return gulp.src(paths.php.src)
        .pipe(gulp.dest(paths.php.dest))
});

gulp.task('libs:build', () => {
    return gulp.src([
        paths.libs.src,
        paths.libs.normalize,
        paths.libs.jquery
    ])
    .pipe(newer(paths.libs.dest))
    .pipe(gulp.dest(paths.libs.dest))
});

gulp.task('serve', () => {
    browserSync.init({
        server: paths.dir
    });

    gulp.watch(paths.dir + '**/**/*.*').on('change', browserSync.reload);    
});

gulp.task('watch', () => {
    gulp.watch(paths.pug.watch, gulp.series('html:build'));
    gulp.watch(paths.stylus.watch, gulp.series('css:build'));
    gulp.watch(paths.js.watch, gulp.series('js:build'));
    gulp.watch(paths.fonts.watch, gulp.series('fonts:build'));
    gulp.watch(paths.img.watch, gulp.series('img:build'));
    gulp.watch(paths.libs.watch, gulp.series('libs:build'));
});

gulp.task('build', 
    gulp.series('fonts:build', 'img:build', 'html:build', 'css:build', 'js:build', 'php:build'));

gulp.task('default', gulp.series('clean', 'build', 'libs:build', gulp.parallel('watch', 'serve')));
