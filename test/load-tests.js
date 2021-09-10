// This file is taken from GeoExt3
(function() {
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'BasiGX': '/BasiGX',
            'CpsiMapview': '/CpsiMapview'
        }
    });

    // create a simple object to mock the application for testing
    Ext.app.Application.instance = {
        enableIsLocked: true // enable the padlock icon
    };

}(document, this));
