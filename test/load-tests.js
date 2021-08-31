// This file is taken from GeoExt3
(function() {
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'GeoExt': '../lib/geoext3',
            'BasiGX': '../lib/BasiGX',
            'CpsiMapview': '../app'
        }
    });

    // create a simple object to mock the application for testing
    Ext.app.Application.instance = {
        enableIsLocked: true // enable the padlock icon
    };

}(document, this));
