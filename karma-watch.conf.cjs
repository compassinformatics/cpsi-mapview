const commonConfig = require('./karma-conf.common.cjs');

module.exports = function (config) {
    commonConfig(config); // apply shared configuration
    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
