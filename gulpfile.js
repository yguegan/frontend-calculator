const gulp = require("gulp");
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');
const del = require('del');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');


function start(callback) {
    connect.server({
        base: '.'
    }, function (){
        browserSync({
        injectChanges: true,
        proxy: 'localhost:8000'
        });
    });

};

async function build(callback) {
    gulp.series("cleanDist", "buildJS", "buildCSS")();
}

async function buildCSS() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'));
}

async function buildJS(){
    return gulp.src('./scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts')
    );
}

async function cleanDist() {
    return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
};

exports.build = build;
exports.cleanDist = cleanDist;
exports.buildCSS = buildCSS;
exports.buildJS = buildJS;
exports.start = start;