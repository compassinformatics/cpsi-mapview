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

    // mock the getMap function to return a map
    BasiGX.util.Map.getMapComponent = function () {
        return Ext.create('GeoExt.component.Map');
    };

}(document, this));
