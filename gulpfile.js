const gulp = require('gulp');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const runElectron = require('gulp-run-electron');
const replace = require('gulp-replace');
const del = require('del');

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

gulp.task('build-app', function (done) {
    const builder = require('electron-builder');

    gulp.src('app/index.html').pipe(gulp.dest('dist/tmp-files'));

    gulp.src('app/index.html')
        .pipe(replace('<script async id="__bs_script__" src="http://localhost:3000/browser-sync/browser-sync-client.js?v=2.18.8"></script>',''))
        .pipe(gulp.dest('app/'));

    builder.build({
        config: {
            appId: 'com.electron.template',
            productName: 'BrowserSyncElectronMinimalSetup',
            buildVersion: '1.0.0',
            copyright: 'Pablo Puga',
            artifactName: '${productName}_${version}.${ext}'
        }
    }).then(function () {
        closeTask();
    }).catch(function (error) {
        console.error('Build Error', error);
        closeTask();
    });

    function closeTask() {
        gulp.src('dist/tmp-files/index.html').pipe(gulp.dest('app/'));
        del(['dist/tmp-files/']);
        done();
    }
});