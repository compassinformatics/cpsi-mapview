/* eslint-env node */
/* eslint max-len: 0 */
module.exports = function(config) {

    var files = [
        'https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-neptune/resources/theme-neptune-all_1.css',
        'https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-neptune/resources/theme-neptune-all_2.css',
        'https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/classic/theme-neptune/resources/theme-neptune-all.css',
        'node_modules/@geoext/openlayers-legacy/dist/ol.css',
        'node_modules/@geoext/openlayers-legacy/dist/ol.js',
        'https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/ext-all-debug.js',
        'https://cdnjs.cloudflare.com/ajax/libs/extjs/6.2.0/packages/ux/classic/ux.js',
        'https://geoext.github.io/geoext3/master/GeoExt.js',
        'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/0.6.9/opentype.min.js',
        'https://cdn.jsdelivr.net/npm/jsonix@3.0.0/jsonix.min.js',
        'https://cdn.jsdelivr.net/gh/bjornharrtell/jsts@gh-pages/1.4.0/jsts.min.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/SLD_1_0_0_GeoServer.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/Filter_1_0_0.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/GML_2_1_2.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/GML_3_1_1.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/OWS_1_1_0.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/SMIL_2_0.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/SMIL_2_0_Language.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/WCS_1_1.js',
        'https://cdn.jsdelivr.net/gh/highsource/ogc-schemas@2.6.1/scripts/lib/WPS_1_0_0.js',
        'https://cdn.jsdelivr.net/gh/highsource/w3c-schemas@1.4.0/scripts/lib/XLink_1_0.js',
        'https://cdn.jsdelivr.net/npm/proj4@2.5.0/dist/proj4-src.min.js',
        'https://maps.googleapis.com/maps/api/js?v=3.42&key=AIzaSyAj6xrC0L3G0YquO1q6Qsma1ZEfYgGQotU&callback=Function.prototype',
        './node_modules/geostyler-sld-parser/browser/sldStyleParser.iife.js',
        './node_modules/geostyler-openlayers-parser/browser/olStyleParser.iife.js',
        'lib/turf.js',
        {
            pattern: 'node_modules/@terrestris/basigx/src/**/*.js',
            served: true,
            included: false // or get Duplicate entity name errors
        },
        'app/util/Style.js', // ensure this is included first as it is used when defining CpsiMapview.view.toolbar.MapFooter
        {
            pattern: 'app/**/*.js',
            watched: true,
            served: true,
            included: false
        },
        {
            pattern: 'test/**/*.js',
            watched: true,
            served: true,
            included: true
        },
        {
            pattern: 'test/resources/**/*',
            included: false,
            served: true
        }
    ];

    config.set({
        basePath: '.',

        proxies: {
            '/resources': '/base/test/resources',
            '/spec': '/base/test/spec',
            '/BasiGX': '/base/node_modules/@terrestris/basigx/src',
            '/CpsiMapview': '/base/app'
        },

        // the following works to limit the tests run
        // see https://github.com/karma-runner/karma-mocha/issues/192
        // also https://stackoverflow.com/questions/38876237/karma-start-passing-parameters
        client: {
            mocha: {
                grep: config.grep
            }
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'expect', 'sinon'],

        // list of files / patterns to load in the browser
        files: files,

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'app/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'ChromeNoSandbox'
            // 'Firefox',
            // 'Chromium_no_sandbox'
        ],

        customLaunchers: {
            ChromeNoSandbox: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--headless',
                    '--disable-web-security',
                    '--disable-gpu',
                    // Without a remote debugging port, Google Chrome exits immediately.
                    '--remote-debugging-port=9999',
                    '--remote-debugging-address=1.1.1.1'
                ]
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
