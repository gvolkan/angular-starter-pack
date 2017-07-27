const path = require('path');
const webpackConfig = require('./karma.webpack.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        proxies: {
            '/assets/i18n/': path.resolve(__dirname, './../frontend/assets/i18n') + '/'
        },
        files: [
            { pattern: './karma.context.js', included: true, served: true, watched: false },
            { pattern: './../frontend/assets/i18n/**', included: false, served: true, watched: false },
            { pattern: './../node_modules/@angular/material/prebuilt-themes/indigo-pink.css', included: true, served: true, watched: false },
        ],
        preprocessors: {
            './karma.context.js': ['webpack', 'sourcemap'],
        },
        webpack: webpackConfig,
        webpackMiddleware: { stats: 'errors-only' },
        frameworks: ['mocha'],
        reporters: ['mocha', 'coverage-istanbul'],
        port: 10200,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        browsers: ['Firefox'],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: [
                    //'--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=10201',
                ],
            }
        },
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-sourcemap-loader',
            'karma-coverage',
            'karma-coverage-istanbul-reporter'
        ],
        coverageIstanbulReporter: {
            reports: ['html', 'text-summary', 'json-summary'],
            dir: path.join(__dirname, './coverage'),
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: true,
            'report-config': {
                html: {
                    subdir: './html'
                }
            },
            thresholds: {
                emitWarning: true,
                global: {
                    statements: 100,
                    lines: 100,
                    branches: 100,
                    functions: 100
                }
            }
        }
    });
};
