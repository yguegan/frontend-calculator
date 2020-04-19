const { src, dest } = require("gulp");
const sass = require('gulp-sass');

function build(callback) {
    buildCSS(callback)
    callback();
}

 function buildCSS() {
    src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/styles'));
}

exports.build = build;
exports.buildCSS = buildCSS