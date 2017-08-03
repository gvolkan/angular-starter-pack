require('ts-node/register');

module.exports.config = {
    specs: [
        './e2e/**/*.e2e.ts'
    ],
    framework: 'mocha',
    mochaOpts: {
        reporter: "spec",
        slow: 3000
    },
    baseUrl: 'http://localhost:' + process.env.APP_SERVER_PORT,
    capabilities: {
        'browserName': 'chrome'
    },
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,
    useAllAngular2AppRoots: true
};