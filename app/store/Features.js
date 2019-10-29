Ext.define('CpsiMapview.store.WfsFeatures', {
    extend: 'GeoExt.data.store.WfsFeatures',
    cacheFeatureCount: false,
    remoteSort: true,
    passThroughFilter: false,
    remoteFilter: true,
    layerOptions: {
        displayInLayerSwitcher: false
    },
    url: '/mapserver/?',
    version: '2.0.0',
    outputFormat: 'geojson',
    startIndex: 0,
    count: 20,
    format: new ol.format.GeoJSON()
});
