const path = require('path');
const del = require("del");
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

const gulp = require("gulp");
const gulpSass = require('gulp-sass');
const gulpTSLint = require('gulp-tslint');
const gulpUglify = require('gulp-uglify');
const gulpNodemon = require('gulp-nodemon');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpTS = require("gulp-typescript");
const gulpHtmlmin = require('gulp-htmlmin');
const gulpOpen = require("gulp-open");
const gulpProtractor = require("gulp-protractor");

const webpack = require('webpack');
const frontendDevWebpackConfig = require('./frontend/build_and_deploy/webpack.dev.config.js');
const frontendProdWebpackConfig = require('./frontend/build_and_deploy/webpack.prod.config.js');

let appServerProcess = null;

gulp.doneCallback = function (err) {
    console.log("GULP: Done");
    if (err) {
        console.log("GULP: Error " + JSON.stringify(err));
        process.exit(err ? 1 : 0);
    }
    if (appServerProcess) {
        appServerProcess.kill('SIGTERM');
        appServerProcess = null;
        process.exit(err ? 1 : 0);
    }
};

// -------------------------------------------------------------------------

function syncBrowser(proxy_url) {
    browserSync.init(null, {
        proxy: proxy_url,
        reloadDelay: 500,
        browser: "chromium-browser",
        port: String(process.env.APP_SERVER_PORT_BS),
        logLevel: "debug",
        server: false,
        online: false
    });
};

gulp.task('all:browser_sync', function () {
    syncBrowser("http://localhost:" + String(process.env.APP_SERVER_PORT) + "/");
});

gulp.task('all:browser_sync:reload', function () {
    browserSync.reload({ stream: false });
});

// -------------------------------------------------------------------------

gulp.task("all-misc:copy", () => {
    return gulp.src([
        "./package.json",
    ]).pipe(gulp.dest("./deploy/"));
});

// -------------------------------------------------------------------------

gulp.task('backend:clean', (cb) => {
    return del([
        "./deploy/backend/build_and_deploy",
        "./deploy/backend/infrastructure",
        "./deploy/backend/kpassage",
        "./deploy/backend/static",
        "./deploy/backend/app.routes.ts",
        "./deploy/backend/app.server.ts",
        "./deploy/backend/app.ts",
    ], cb);
});
gulp.task("backend-misc:copy", () => {
    return gulp.src([
        "backend/**/*",
        "!**/*.ts"
    ]).pipe(gulp.dest("./deploy/backend"));
});
gulp.task('backend-ts:tslint', () => {
    return gulp.src([
        "backend/**/*.ts"
    ]).pipe(gulpTSLint({
        formatter: "prose"
    })).pipe(gulpTSLint.report());
});
gulp.task('backend-ts:build_min_copy', ["backend-ts:tslint"], function () {
    const tsConfig = gulpTS.createProject('./tsconfig.json');
    const tsResult = gulp.src([
        'backend/**/*.ts'
    ]).pipe(gulpSourcemaps.init())
        .pipe(tsConfig());
    return tsResult.js
        .pipe(gulpUglify().on('error', function (e) {
            console.log("GULP: Error: " + e);
        }))
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('./deploy/backend'));
});
gulp.task('backend-ts:watch', function () {
    gulp.watch([
        "backend/**/*.ts"
    ], ['backend-ts:build_min_copy']
    ).on('change', function (e) {
        console.log('GULP: Changed: ' + e.path);
    });
});
gulp.task('backend:start', function () {
    let restartStatus = false;
    return gulpNodemon({
        script: './deploy/backend/app.server'
        , ext: 'html js css scss ts json txt ico png'
        , watch: 'frontend'
        , tasks: function (changedFiles) {
            const tasks = [];
            changedFiles.forEach(function (file) {
                if (path.extname(file) === '.ts') {
                    tasks.push('frontend:webpack');
                    tasks.push('frontend-js:min_copy');
                }
                if (path.extname(file) === '.js') {
                    tasks.push('frontend-js:min_copy');
                }
                if (path.extname(file) === '.scss') {
                    tasks.push('frontend-sass:min_copy');
                }
                if (path.extname(file) === '.css') {
                    tasks.push('frontend-misc:copy');
                }
                if (path.extname(file) === '.html') {
                    tasks.push('frontend:webpack');
                    tasks.push('frontend-js:min_copy');
                    tasks.push('frontend-misc:copy');
                }
                if (path.extname(file) === '.json') {
                    tasks.push('frontend-misc:copy');
                }
                tasks.push('all:browser_sync:reload');
            });
            return tasks;
        }
    }).on('restart', function () {
        restartStatus = true;
        console.log('GULP: Server restarted');
    }).on('start', function () {
        browserSync.reload({ stream: false });
        console.log('GULP: Server started');
    }).on('exit', function () {
        if (!restartStatus) {
            process.exit();
            return;
        }
        restartStatus = false;
        console.log('GULP: Server stoped');
    });
});

// -------------------------------------------------------------------------

gulp.task('infrastructure:testing:driver-update', () => { return gulpProtractor['webdriver_update']; });

gulp.task('backend:e2e:setup', function () {
    console.log('GULP: E2E Started');
    const spawn = require('child_process').spawn;
    appServerProcess = spawn('node', ['./deploy/backend/app.server'], { stdio: 'inherit' });
});
gulp.task('backend:e2e:cleaning', function () {
    console.log('GULP: E2E Finished');
    appServerProcess.kill('SIGTERM');
    appServerProcess = null;
    process.exit();
});
gulp.task('backend:e2e:testing', function () {
    return gulp.src('./backend_tests/**/*.e2e.ts')
        .pipe(gulpProtractor.protractor({
            configFile: './backend_tests/protractor.conf.ts',
            args: []
        }))
        .on('error', function (e) {
            console.log('GULP: Error running E2E testing', JSON.stringify(e));
            appServerProcess.kill('SIGTERM');
            appServerProcess = null;
            process.exit();
        });
});
gulp.task('backend:e2e', function () {
    runSequence(
        'infrastructure:testing:driver-update',
        'backend:e2e:setup',
        'backend:e2e:testing',
        'backend:e2e:cleaning'
    );
});

gulp.task("backend_tests:open_coverage", () => {
    gulp.src("./backend_tests/coverage/html/index.html")
        .pipe(gulpOpen());
});

// -------------------------------------------------------------------------

gulp.task('frontend:clean', (cb) => {
    return del(["./deploy/frontend"], cb);
});
gulp.task('frontend:tslint', () => {
    return gulp.src([
        "frontend/**/*.ts"
    ]).pipe(gulpTSLint({
        formatter: "prose"
    })).pipe(gulpTSLint.report());
});
gulp.task('frontend:webpack', ["frontend:tslint"], function (callback) {
    if (process.env.NODE_ENV === 'production') {
        webpack(frontendProdWebpackConfig, function (err, stats) {
            console.log('GULP: Webpack ', stats.toString({
            }));
            callback();
        });
    } else {
        webpack(frontendDevWebpackConfig, function (err, stats) {
            console.log('GULP: Webpack ', stats.toString({
            }));
            callback();
        });
    }
});
gulp.task("frontend-html:min_copy", () => {
    const sources = [
        "frontend/**/*.html",
        "frontend/**/*.htm",
        '!frontend/app{,/**}'
    ];
    return gulp.src(sources, { nodir: true })
        .pipe(gulpHtmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./deploy/frontend"));
});
gulp.task("frontend-misc:copy", () => {
    let sources = [
        "frontend/**/*",
        "!frontend/**/*.html",
        "!frontend/**/*.htm",
        "!frontend/**/*.js",
        "!frontend/**/*.scss",
        "!frontend/**/*.ts"
    ];
    if (process.env.NODE_ENV === 'production') {
        sources = sources.concat("!frontend/build_and_deploy{,/**}");
        sources = sources.concat("!frontend/app{,/**}");
    }
    return gulp.src(sources, { nodir: true })
        .pipe(gulp.dest("./deploy/frontend"));
});
gulp.task("frontend-js:min_copy", () => {
    const sources = [
        "frontend/**/*.js",
        "!frontend/build_and_deploy{,/**}",
        "!frontend/app{,/**}"
    ];
    if (process.env.NODE_ENV === 'production') {
        return gulp.src(sources)
            .pipe(gulpUglify().on('error', function (e) {
                console.log("GULP: Error: " + e);
            }))
            .pipe(gulp.dest("./deploy/frontend"));
    } else {
        return gulp.src(sources)
            .pipe(gulp.dest("./deploy/frontend"));
    }
});
gulp.task("frontend-i18n:copy", () => {
    return gulp.src([
        "frontend/assets/i18n/**/*.json"
    ]).pipe(gulp.dest("./deploy/frontend/assets/i18n"));
});
gulp.task('frontend-sass:min_copy', function () {
    return gulp.src([
        './frontend/assets/sass/**/*.scss'
    ]).pipe(gulpSass({ outputStyle: 'compressed' })
        .on('error', gulpSass.logError))
        .pipe(gulp.dest('././deploy/frontend/assets/css'));
});

// -------------------------------------------------------------------------

gulp.task("frontend_tests:open_coverage", () => {
    gulp.src("./frontend_tests/coverage/html/index.html")
        .pipe(gulpOpen());
});

// -------------------------------------------------------------------------

gulp.task('all:clean', function () {
    runSequence(
        'all-misc:copy',
        'frontend:clean',
        'backend:clean'
    );
});
gulp.task('all:deploy_local', function () {
    runSequence(
        'backend:start',
        'backend-ts:watch',
        'all:browser_sync'
    );
});

gulp.task('all:build_dev', function () {
    runSequence(
        'frontend:webpack',
        [
            'frontend-js:min_copy',
            'frontend-html:min_copy',
            'frontend-misc:copy',
            'frontend-i18n:copy',
            'frontend-sass:min_copy'
        ],
        [
            'backend-ts:build_min_copy',
            'backend-misc:copy'
        ]
    );
});
gulp.task('all:build_prod', function () {
    runSequence(
        'frontend:webpack',
        [
            'frontend-js:min_copy',
            'frontend-html:min_copy',
            'frontend-misc:copy',
            'frontend-i18n:copy',
            'frontend-sass:min_copy'
        ],
        [
            'backend-ts:build_min_copy',
            'backend-misc:copy'
        ]
    );
});