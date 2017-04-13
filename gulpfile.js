const gulp = require('gulp');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const runElectron = require('gulp-run-electron');

gulp.task('default', ['watchers', 'run-electron']);

gulp.task('watchers', function () {
    browserSync.init({
        localOnly: true
    });
    gulp.watch('app/index.html').on('change', browserSync.reload);
    gulp.watch(['main.js', 'app/js/*.js']).on('change', browserSync.reload);
    gulp.watch('app/css/*.css', function () {
        return gulp.src('app/css/*.css')
            .pipe(plumber({
                errorHandler: function (error) {
                    console.log('[CSS] ' + error.message);
                    this.emit('end');
                }
            }))
            .pipe(browserSync.stream());
    });
});

gulp.task('run-electron', function () {
    gulp.src('.').pipe(runElectron([], {}));
});