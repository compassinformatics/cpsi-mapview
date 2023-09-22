// This file is taken from GeoExt3
(function () {

    // see https://stackoverflow.com/a/27390799/179520

    // Karma normally starts the tests right after all files specified in 'karma-conf.common.js' have been loaded
    // We only want the tests to start after Sencha Touch/ExtJS has bootstrapped the application
    // 1. We temporary override the '__karma__.loaded' function
    // 2. When Ext is ready we call the '__karma__.loaded' function manually

    var karmaLoadedFunction = window.__karma__.loaded;
    window.__karma__.loaded = function () { };


    Ext.onReady(function () {
        Ext.Loader.setConfig({
            enabled: true,
            disableCaching: false,
            paths: {
                'BasiGX': '/BasiGX',
                'CpsiMapview': '/CpsiMapview'
            }
        });

        // create a simple object to mock the application for testing
        Ext.app.Application.instance = {
            enableIsLocked: true // enable the padlock icon
        };

        // mock the getMap function to return a map
        BasiGX.util.Map.getMapComponent = function () {
            return Ext.create('GeoExt.component.Map');
        };

        window.__karma__.loaded = karmaLoadedFunction;
        window.__karma__.loaded();
    });

}(document, this));
