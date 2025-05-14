module.exports = function (config) {
    const files = [
        'https://geoext.github.io/extjs-gpl/build/classic/theme-neptune/resources/theme-neptune-all_1.css',
        'https://geoext.github.io/extjs-gpl/build/classic/theme-neptune/resources/theme-neptune-all_2.css',
        'https://geoext.github.io/extjs-gpl/build/classic/theme-neptune/resources/theme-neptune-all.css',
        './node_modules/ol/ol.css',
        './node_modules/ol/dist/ol.js',
        'https://geoext.github.io/extjs-gpl/build/ext-all-debug.js',
        'https://geoext.github.io/extjs-gpl/build/packages/ux/classic/ux.js',
        //'https://geoext.github.io/geoext/master/GeoExt.js',
        'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/0.6.9/opentype.min.js',
        './node_modules/jsonix/jsonix.js',
        'https://cdn.jsdelivr.net/gh/bjornharrtell/jsts@gh-pages/1.4.0/jsts.min.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/SLD_1_0_0_GeoServer.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/Filter_1_0_0.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/GML_2_1_2.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/GML_3_1_1.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/OWS_1_1_0.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/SMIL_2_0.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/SMIL_2_0_Language.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/WCS_1_1.js',
        './node_modules/@ogc-schemas/ogc-schemas/lib/WPS_1_0_0.js',
        './node_modules/w3c-schemas/lib/XLink_1_0.js',
        './node_modules/proj4/dist/proj4.js',
        'https://maps.googleapis.com/maps/api/js?v=3.42&key=AIzaSyAj6xrC0L3G0YquO1q6Qsma1ZEfYgGQotU&callback=Function.prototype',
        './node_modules/geostyler-sld-parser/dist/sldStyleParser.iife.js',
        './node_modules/geostyler-openlayers-parser/dist/olStyleParser.iife.js',
        'lib/turf.js',
        {
            pattern: 'node_modules/@geoext/geoext/src/**/*.js',
            included: true
        },
        {
            pattern: 'node_modules/@geoext/geoext/classic/**/*.js',
            included: true
        },
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
            '/CpsiMapview': '/base/app',
            '/GeoExt': '/base/src'
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

        plugins: [
            require('karma-mocha'),
            require('karma-mocha-reporter'),
            require('karma-coverage'),
            require('karma-expect'),
            require('karma-sinon'),
            require('karma-chrome-launcher')
        ],

        // list of files / patterns to load in the browser
        files: files,

        // list of files to exclude
        exclude: [],

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
