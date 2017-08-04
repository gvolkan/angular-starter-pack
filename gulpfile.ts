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
const frontendDevWebpackConfig = require('./tools/frontend/webpack.dev.config.js');
const frontendProdWebpackConfig = require('./tools/frontend/webpack.prod.config.js');

let appServerProcess = null;

gulp.doneCallback = function (err) {
    //console.log("GULP: Done");
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
        browser: "firefox",
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
    ]).pipe(gulp.dest("./dist/"));
});

// -------------------------------------------------------------------------

gulp.task('backend:clean', (cb) => {
    return del([
        "./dist/backend/infrastructure",
        "./dist/backend/kpassage",
        "./dist/backend/static",
        "./dist/backend/app.routes.ts",
        "./dist/backend/app.server.ts",
        "./dist/backend/app.ts",
    ], cb);
});
gulp.task("backend-misc:copy", () => {
    return gulp.src([
        "./src/backend/**/*",
        "!**/*.ts"
    ]).pipe(gulp.dest("./dist/backend"));
});
gulp.task('backend-ts:tslint', () => {
    return gulp.src([
        "./src/backend/**/*.ts"
    ]).pipe(gulpTSLint({
        formatter: "prose"
    })).pipe(gulpTSLint.report());
});
gulp.task('backend-ts:build_min_copy', ["backend-ts:tslint"], function () {
    const tsConfig = gulpTS.createProject('./tsconfig.json');
    const tsResult = gulp.src([
        './src/backend/**/*.ts'
    ]).pipe(gulpSourcemaps.init())
        .pipe(tsConfig());
    return tsResult.js
        .pipe(gulpUglify().on('error', function (e) {
            console.log("GULP: Error: " + e);
        }))
        .pipe(gulpSourcemaps.write())
        .pipe(gulp.dest('./dist/backend'));
});
gulp.task('backend-ts:watch', function () {
    gulp.watch([
        "./src/backend/**/*.ts"
    ], ['backend-ts:build_min_copy']
    ).on('change', function (e) {
        console.log('GULP: Changed: ' + e.path);
    });
});
gulp.task('backend:start', function () {
    let restartStatus = false;
    return gulpNodemon({
        script: './dist/backend/app.server'
        , ext: 'html js css scss ts json txt ico png'
        , watch: './src/backend'
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
    appServerProcess = spawn('node', ['./dist/backend/app.server'], { stdio: 'inherit' });
});
gulp.task('backend:e2e:cleaning', function () {
    console.log('GULP: E2E Finished');
    appServerProcess.kill('SIGTERM');
    appServerProcess = null;
    process.exit();
});
gulp.task('backend:e2e:testing', function () {
    return gulp.src('./tests/backend/**/*.e2e.ts')
        .pipe(gulpProtractor.protractor({
            configFile: './tests/backend/protractor.conf.ts',
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
    gulp.src("./tests/backend/coverage/html/index.html")
        .pipe(gulpOpen({app: 'firefox'}));
});

// -------------------------------------------------------------------------

gulp.task('frontend:clean', (cb) => {
    return del(["./dist/frontend"], cb);
});
gulp.task('frontend:tslint', () => {
    return gulp.src([
        "./src/frontend/**/*.ts"
    ]).pipe(gulpTSLint({
        formatter: "prose"
    })).pipe(gulpTSLint.report());
});
gulp.task('frontend:webpack', ["frontend:tslint"], function (callback) {
    if (process.env.NODE_ENV === 'production') {
        webpack(frontendProdWebpackConfig, function (err, stats) {
            console.log('GULP: Webpack PROD ', stats.toString({
            }));
            callback();
        });
    } else {
        webpack(frontendDevWebpackConfig, function (err, stats) {
            console.log('GULP: Webpack DEV ', stats.toString({
            }));
            callback();
        });
    }
});
gulp.task("frontend-html:min_copy", () => {
    const sources = [
        "./src/frontend/**/*.html",
        "./src/frontend/**/*.htm",
        '!./src/frontend/app{,/**}'
    ];
    return gulp.src(sources, { nodir: true })
        .pipe(gulpHtmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./dist/frontend"));
});
gulp.task("frontend-misc:copy", () => {
    let sources = [
        "./src/frontend/**/*",
        "!./src/frontend/**/*.html",
        "!./src/frontend/**/*.htm",
        "!./src/frontend/**/*.js",
        "!./src/frontend/**/*.scss",
        "!./src/frontend/**/*.ts"
    ];
    if (process.env.NODE_ENV === 'production') {
        sources = sources.concat("!./src/frontend/app{,/**}");
    }
    return gulp.src(sources, { nodir: true })
        .pipe(gulp.dest("./dist/frontend"));
});
gulp.task("frontend-js:min_copy", () => {
    const sources = [
        "./src/frontend/**/*.js",
        "!./src/frontend/app{,/**}"
    ];
    if (process.env.NODE_ENV === 'production') {
        return gulp.src(sources)
            .pipe(gulpUglify().on('error', function (e) {
                console.log("GULP: Error: " + e);
            }))
            .pipe(gulp.dest("./dist/frontend"));
    } else {
        return gulp.src(sources)
            .pipe(gulp.dest("./dist/frontend"));
    }
});
gulp.task("frontend-i18n:copy", () => {
    return gulp.src([
        "./src/frontend/assets/i18n/**/*.json"
    ]).pipe(gulp.dest("./dist/frontend/assets/i18n"));
});
gulp.task('frontend-sass:min_copy', function () {
    return gulp.src([
        './src/frontend/assets/sass/**/*.scss'
    ]).pipe(gulpSass({ outputStyle: 'compressed' })
        .on('error', gulpSass.logError))
        .pipe(gulp.dest('././dist/frontend/assets/css'));
});

// -------------------------------------------------------------------------

gulp.task("frontend_tests:open_coverage", () => {
    gulp.src("./tests/frontend/coverage/html/index.html")
        .pipe(gulpOpen({app: 'firefox'}));
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