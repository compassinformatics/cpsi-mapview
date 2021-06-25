Ext.define('CpsiMapview.store.WfsFeatures', {
    extend: 'GeoExt.data.store.WfsFeatures',
    cacheFeatureCount: false,
    remoteSort: true,
    /**
     * remoteFilters causes the grids to load automatically - setting autoLoad to true
     * causes the grid to load twice
     *
     * @cfg {Boolean}
     */
    autoLoad: false,
    /**
     * if passThroughFilter is used with remote filters then the store gets
     * reloaded twice
     *
     * @cfg {Boolean}
     */
    passThroughFilter: false,
    remoteFilter: true,
    url: '/mapserver/?',
    version: '2.0.0',
    outputFormat: 'geojson',
    startIndex: 0,
    count: 20,
    format: new ol.format.GeoJSON()
});
