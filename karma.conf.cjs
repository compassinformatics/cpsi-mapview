const commonConfig = require('./karma-conf.common.cjs');

module.exports = function (config) {
    commonConfig(config); // apply shared configuration

    let sourcePreprocessors = 'coverage';
    function isDebug(argument) {
        return argument === '--debug';
    }
    if (process.argv.some(isDebug)) {
        sourcePreprocessors = [];
    }

    config.set({
        // Preprocess so we can gather coverage
        preprocessors: {
            'app/**/*.js': sourcePreprocessors // remove coverage here if we want to debug a test
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // optionally, configure the reporter
        coverageReporter: {
            dir: 'coverage/',
            check: {
                emitWarning: true, // don't fail the tests
                global: {
                    statements: 15 // minimum coverage of 15%
                }
            },
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
            ]
        }
    });
};
