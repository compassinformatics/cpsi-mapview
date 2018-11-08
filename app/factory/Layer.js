/**
 * [extend description]
 * @type {String}
 */
Ext.define('CpsiMapview.factory.Layer', {
    alternateClassName: 'LayerFactory',
    requires: [],

    singleton: true,

    /**
     * Creates an OpenLayer layer object from a JSON config
     *
     * @param  {Object} layerConf  The configuration object
     * @return {ol.layer.Base} OL layer object
     */
    createLayer: function(layerConf) {

        var layerType = layerConf.layerType;
        var mapLayer;

        switch (layerType) {
        case 'wms':
            mapLayer = LayerFactory.createWms(layerConf);
            break;
        case 'wfs':
            mapLayer = LayerFactory.createWfs(layerConf);
            break;
        case 'esrirest':
            mapLayer = LayerFactory.createEsriRest(layerConf);
            break;
        case 'osm':
            mapLayer = LayerFactory.createOsm(layerConf);
            break;
        case 'empty':
            mapLayer = LayerFactory.createEmptyLayer(layerConf);
            break;
        case 'bing_aerial':
            mapLayer = LayerFactory.createBing(layerConf, 'Aerial');
            break;
        case 'google_roadmap':
            mapLayer = LayerFactory.createGoogle(layerConf, 'google.maps.MapTypeId.ROADMAP');
            break;
        case 'google_terrain':
            mapLayer = LayerFactory.createGoogle(layerConf, 'google.maps.MapTypeId.TERRAIN');
            break;
        case 'google_hybrid':
            mapLayer = LayerFactory.createGoogle(layerConf, 'google.maps.MapTypeId.HYBRID');
            break;
        case 'google_satellite':
            mapLayer = LayerFactory.createGoogle(layerConf, 'google.maps.MapTypeId.SATELLITE');
            break;
        case 'nasa':
            mapLayer = LayerFactory.createNasa(layerConf);
            break;
        case 'os':
            mapLayer = LayerFactory.createOs(layerConf);
            break;
        case 'arcgiscache':
            mapLayer = LayerFactory.createArcGisCache(layerConf);
            break;
        case 'arcgisrest':
            mapLayer = LayerFactory.createArcGisRest(layerConf);
            break;
        case 'switchlayer':
            mapLayer = LayerFactory.createSwitchLayer(layerConf);
            break;
        default:
            Ext.log.warn('Layer type not known');
            //do nothing, and return empty layer
        }

        return mapLayer;
    },

    createEmptyLayer: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createSwitchLayer: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    /**
     * Creates an OGC WMS layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Tile}    WMS layer
     */
    createWms: function(layerConf) {
        return new ol.layer.Tile({
            name: layerConf.text,
            source: new ol.source.TileWMS({
                url: layerConf.url,
                params: {
                    'LAYERS': layerConf.serverOptions.layers,
                    'TILED': true,
                    'TRANSPARENT': true
                },
                crossOrigin: 'anonymous'
            }),
            visible: layerConf.openLayers.visibility,
            minResolution: layerConf.openLayers.minResolution,
            maxResolution: layerConf.openLayers.maxResolution,
            opacity: layerConf.openLayers.opacity
        });
    },

    /**
     * Creates an OGC WFS layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Vector}  WFS layer
     */
    createWfs: function(layerConf) {
        var url = layerConf.url;

        var srid = 'EPSG:3857';
        var mapPanel = CpsiMapview.view.main.Map.guess();
        if (mapPanel) {
            srid = mapPanel.olMap.getView().getProjection().getCode();
        }

        var featureType = layerConf.featureType;

        // assemble fix URL parts
        var fixUrlParams =
            'service=WFS&request=GetFeature&version=1.1.0' +
            '&typename=' + featureType +
            '&outputFormat=application/json' +
            '&srsname=' + srid;
        url = Ext.String.urlAppend(url, fixUrlParams);

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                // add current map extent
                return Ext.String.urlAppend(url,
                    'bbox=' + extent.join(',') + ',' + srid);
            },
            strategy: ol.loadingstrategy.bbox
        });

        // by default use clustering, however we may want to deactivate this for
        // line features
        var noCluster = layerConf.noCluster || false;
        var clusterSource;
        if (!noCluster) {
            clusterSource = new ol.source.Cluster({
                threshold: 5,
                source: vectorSource
            });
        }

        var sldUrl = layerConf.sldUrl;
        var sld = layerConf.sld;
        if (sldUrl && sld) {
            // TODO load and parse style (in whatever format, to be discussed)
            // this.loadSLD(mapLayer, sld, this.mapFile, sldUrl);
        }

        var wfsLayer = new ol.layer.Vector({
            name: layerConf.text,
            // either clustered or non-clustered source
            source: clusterSource ? clusterSource : vectorSource,
            visible: layerConf.openLayers.visibility,
            minResolution: layerConf.openLayers.minResolution,
            maxResolution: layerConf.openLayers.maxResolution,
            opacity: layerConf.openLayers.opacity
        });

        if (layerConf.tooltipsConfig) {
            //TODO has to be implemented with
            //     https://github.com/meggsimum/cpsi-mapview/issues/27
        }

        return wfsLayer;
    },

    /**
     * Creates a Bing layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @param  {String} type      The Bing layer type, e.g. 'Aerial'
     * @return {ol.layer.Tile}    Bing layer
     */
    createBing: function(layerConf, type) {

        return new ol.layer.Tile({
            name: layerConf.text,
            preload: Infinity,
            source: new ol.source.BingMaps({
                key: layerConf.token,
                imagerySet: type
                // use maxZoom 19 to see stretched tiles instead of the BingMaps
                // "no photos at this zoom level" tiles
                // maxZoom: 19
            }),
            visible: layerConf.openLayers.visibility,
            minResolution: layerConf.openLayers.minResolution,
            maxResolution: layerConf.openLayers.maxResolution,
            opacity: layerConf.openLayers.opacity
        });
    },

    /**
     * Creates an ESRI REST tile layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} ESRI REST tile layer
     */
    createEsriRest: function(layerConf) {
        return new ol.layer.Tile({
            name: layerConf.text,
            source: new ol.source.XYZ({
                attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url: layerConf.url + '{z}/{y}/{x}'
            }),
            visible: layerConf.openLayers.visibility,
            minResolution: layerConf.openLayers.minResolution,
            maxResolution: layerConf.openLayers.maxResolution,
            opacity: layerConf.openLayers.opacity
        });
    },

    /**
     * Creates an OSM layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} OSM layer
     */
    createOsm: function(layerConf) {
        // OSM based map tiles
        return new ol.layer.Tile({
            name: layerConf.text,
            source: new ol.source.OSM(),
            visible: layerConf.openLayers.visibility,
            minResolution: layerConf.openLayers.minResolution,
            maxResolution: layerConf.openLayers.maxResolution,
            opacity: layerConf.openLayers.opacity
        });
    },

    createGoogle: function(layerConf, layerType) {

        Ext.log.info('Not implemented yet', layerConf, layerType);
    },

    createNasa: function(layerConf) {

        Ext.log.info('Not implemented yet', layerConf);
    },

    createOs: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createArcGisCache: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createArcGisRest: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createServerArray: function(path) {
        Ext.log.info('Not implemented yet', path);
    }

});
