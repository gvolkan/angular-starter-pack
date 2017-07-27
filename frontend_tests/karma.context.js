require('core-js/es6');
require('core-js/es7/reflect');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/mocha-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('hammerjs/hammer');
require('rxjs/Rx');

Error.stackTraceLimit = Infinity;

const angularTesting = require('@angular/core/testing');
const angularPBD = require('@angular/platform-browser-dynamic/testing');
angularTesting.TestBed.initTestEnvironment(
  angularPBD.BrowserDynamicTestingModule,
  angularPBD.platformBrowserDynamicTesting()
);

const specs = require.context('./../frontend/', true, /\.spec\.ts/);
specs.keys().forEach(specs);