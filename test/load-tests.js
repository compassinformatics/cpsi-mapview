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

    // Get "Ext.getApplication is not a function" when running tests so mock this here
    Ext.getApplication = function () {
        return {
            enableIsLocked: true // enable the padlock icon
        };
    }

}(document, this));
