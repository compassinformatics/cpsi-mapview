/**
 * Factory util class to generate OpenLayers layer instances according to a
 * JSON configuration.
 *
 * @class CpsiMapview.factory.Layer
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

        // This is the same for all types
        if (mapLayer) {
            // handle base layer logic
            if (layerConf.isBaseLayer) {
                mapLayer.set('isBaseLayer', true);
                mapLayer.on(
                    'change:visible', LayerFactory.ensureOnlyOneBaseLayerVisible
                );
            }
            // assign relevant legend properties
            mapLayer.set('legendUrl', layerConf.legendUrl);
            mapLayer.set('legendHeight', layerConf.legendHeight);
            mapLayer.set('legendWidth', layerConf.legendWidth);
        }

        return mapLayer;
    },

    /**
     * The handler when a virtual base layer changes its visibility. This method
     * ensures that only one of these virtual base layers is visible at a time.
     *
     * @param {ol.Object.Event} evt The event which contains the layer.
     */
    ensureOnlyOneBaseLayerVisible: function(evt) {
        var changedLayer = evt.target;
        if (changedLayer.get('isBaseLayer') && changedLayer.getVisible()) {
            var allLayers = BasiGX.util.Layer.getAllLayers();
            Ext.each(allLayers, function(layer) {
                if (!layer.get('isBaseLayer') || layer.id === changedLayer.id) {
                    return;
                }
                if (layer.getVisible()) {
                    layer.setVisible(false);
                }
            });
        }

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
        var layer;
        var singleTile = layerConf.openLayers.singleTile;
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {
            url: layerConf.url,
            params: {
                'LAYERS': layerConf.serverOptions.layers,
                'TRANSPARENT': true,
                'TILED': !singleTile
            },
            ratio: singleTile ? 1 : undefined,
            crossOrigin: 'anonymous'
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            isTimeDedendent: !!layerConf.timeitem,
            dateFormat: layerConf.dateFormat,
            timeProperty: layerConf.timeitem
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        if (singleTile) {

            olLayerConf.source = new ol.source.ImageWMS(olSourceConf);
            layer = new ol.layer.Image(olLayerConf);

        } else {

            olLayerConf.source = new ol.source.TileWMS(olSourceConf);
            layer = new ol.layer.Tile(olLayerConf);
        }

        return layer;
    },

    /**
     * Creates an OGC WFS layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Vector}  WFS layer
     */
    createWfs: function(layerConf) {
        var url = layerConf.url;
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var srid = 'EPSG:3857';
        var mapPanel = CpsiMapview.view.main.Map.guess();
        if (mapPanel) {
            srid = mapPanel.olMap.getView().getProjection().getCode();
        }

        var featureType = layerConf.featureType;
        var geometryProperty = layerConf.geometryProperty;

        // assemble fix URL parts
        var fixUrlParams =
            'service=WFS&request=GetFeature&version=1.1.0' +
            '&typename=' + featureType +
            '&outputFormat=application/json' +
            '&srsname=' + srid;
        url = Ext.String.urlAppend(url, fixUrlParams);

        var olSourceConf = {
            format: new ol.format.GeoJSON(),
            strategy: ol.loadingstrategy.bbox
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var vectorSource = new ol.source.Vector(olSourceConf);

        var loaderFn = function(extent) {
            vectorSource.dispatchEvent('vectorloadstart');

            var allFilters = [];
            var bboxFilter = BasiGX.util.WFS.getBboxFilter(
                mapPanel.olMap,
                geometryProperty,
                extent
            );
            // this within the function is bound to the vector source it's
            // called from.
            var timeFilters = this.get('timeFilters');
            if (!Ext.isEmpty(timeFilters)) {
                allFilters = Ext.Array.merge(allFilters, timeFilters);
            }
            allFilters.push(bboxFilter);

            var filter = BasiGX.util.WFS.combineFilters(allFilters);
            var reqUrl = Ext.String.urlAppend(
                url, 'filter=' + encodeURIComponent(filter)
            );

            var xhr = new XMLHttpRequest();
            xhr.open('GET', reqUrl);
            var onError = function() {
                vectorSource.removeLoadedExtent(extent);
                vectorSource.dispatchEvent('vectorloaderror');
            };
            xhr.onerror = onError;
            xhr.onload = function() {
                if (xhr.status == 200) {
                    var features = vectorSource.getFormat().readFeatures(
                        xhr.responseText
                    );
                    vectorSource.addFeatures(features);
                    vectorSource.dispatchEvent('vectorloadend');
                } else {
                    onError();
                }
            };
            xhr.send();
        };

        vectorSource.setLoader(loaderFn);

        // by default use clustering, however we may want to deactivate this for
        // line features
        var noCluster = layerConf.noCluster || false;
        var clusterSource;
        if (!noCluster) {
            var clusterSourceConf = {
                threshold: 5,
                source: vectorSource
            };
            clusterSourceConf = Ext.apply(clusterSourceConf, olSourceProps);
            clusterSource = new ol.source.Cluster(clusterSourceConf);
        }

        var sldUrl = layerConf.sldUrl;
        var sld = layerConf.sld;
        if (sldUrl && sld) {
            // TODO load and parse style (in whatever format, to be discussed)
            // this.loadSLD(mapLayer, sld, this.mapFile, sldUrl);
        }

        var olLayerConf = {
            name: layerConf.text,
            source: clusterSource ? clusterSource : vectorSource,
            toolTipConfig: layerConf.tooltipsConfig,
            isTimeDedendent: !!layerConf.timeitem,
            dateFormat: layerConf.dateFormat,
            timeProperty: layerConf.timeitem
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var wfsLayer = new ol.layer.Vector(olLayerConf);

        if (layerConf.tooltipsConfig) {
            // create a custom toolitp for this layer
            var toolTip = Ext.create('CpsiMapview.view.layer.ToolTip', {
                toolTipConfig: layerConf.tooltipsConfig,
                layer: wfsLayer
            });
            wfsLayer.toolTip = toolTip;

            // show / hide on appropriate events
            mapPanel.on('cmv-map-pointerrest', function(hoveredObjs, evt) {
                // show tooltip with feature attribute information
                Ext.each(hoveredObjs, function (hoveredObj) {
                    if (hoveredObj.layer &&
                          hoveredObj.layer.id === wfsLayer.id &&
                          hoveredObj.layer.toolTip) {
                        hoveredObj.layer.toolTip.draw(hoveredObj.feature, evt);
                    }
                });
            });

            // hide tooltip if mouse moves again
            mapPanel.on('cmv-map-pointermove', function () {
                toolTip.hide();
            });

            // hide all tooltips if cursor leaves map
            mapPanel.on('cmv-map-pointerrestout', function () {
                CpsiMapview.view.layer.ToolTip.clear();
            });
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
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);
        var olSourceConf = {
            key: layerConf.token,
            imagerySet: type
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            preload: Infinity,
            source: new ol.source.BingMaps(olSourceConf)
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        return new ol.layer.Tile(olLayerConf);
    },

    /**
     * Creates an ESRI REST tile layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} ESRI REST tile layer
     */
    createEsriRest: function(layerConf) {
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {
            url: layerConf.url + '{z}/{y}/{x}'
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            source: new ol.source.XYZ(olSourceConf)
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var layer = new ol.layer.Tile(olLayerConf);

        return layer;
    },

    /**
     * Creates an OSM layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} OSM layer
     */
    createOsm: function(layerConf) {
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {};
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            source: new ol.source.OSM(olSourceConf)
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        return new ol.layer.Tile(olLayerConf);
    },

    createGoogle: function(layerConf, layerType) {

        Ext.log.info('Not implemented yet', layerConf, layerType);
    },

    /**
     * Creates a World Wind (BlueMarble-200412) layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile}     World Wind (BlueMarble-200412) layer
     */
    createNasa: function(layerConf) {
        var nasaWms = this.createWms({
            url: 'https://worldwind25.arc.nasa.gov/wms?',
            serverOptions: {
                layers: 'BlueMarble-200412'
            },
            openLayers: layerConf.openLayers
        });

        return nasaWms;
    },

    createOs: function(layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createArcGisCache: function(layerConf) {
        // Maybe this helps: https://stackoverflow.com/a/41608464
        Ext.log.info('Not implemented yet', layerConf);
    },

    /**
     * Creates an ArcGIS REST layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile}     ArcGIS REST layer
     */
    createArcGisRest: function(layerConf) {
        var layer;
        var singleTile = layerConf.openLayers.singleTile;
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {
            url: layerConf.url,
            params: layerConf.serverOptions || {},
            ratio: singleTile ? 1 : undefined
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        if (singleTile) {

            olLayerConf.source = new ol.source.ImageArcGISRest(olSourceConf);
            layer = new ol.layer.Image(olLayerConf);

        } else {

            olLayerConf.source = new ol.source.TileArcGISRest(olSourceConf);
            layer = new ol.layer.Tile(olLayerConf);
        }

        return layer;
    },

    createServerArray: function(path) {
        Ext.log.info('Not implemented yet', path);
    },

    /**
     * Transforms the OpenLayers 2 config options to OL (>=v3) layer pendants.
     *
     * @param  {Object} ol2Conf OL2 config
     * @return {Object}         OL (>=v3) layer config
     */
    ol2PropsToOlLayerProps: function (ol2Conf) {
        var map = BasiGX.util.Map.getMapComponent().getMap();
        var units = map.getView().getProjection().getUnits();

        // min. and max. resolution detection:
        // either directly given in config or indirectly by scale or we leave it
        // unset
        var minRes = ol2Conf.minResolution ||
            BasiGX.util.Map.getResolutionForScale(ol2Conf.minScale, units) ||
            undefined;
        var maxRes = ol2Conf.maxResolution ||
            BasiGX.util.Map.getResolutionForScale(ol2Conf.maxScale, units) ||
            undefined;

        var olProps = {
            opacity: ol2Conf.opacity,
            visible: ol2Conf.visibility,
            maxResolution: maxRes,
            minResolution: minRes
            // no OL >=v3 pendant mapped yet
            // numZoomLevels: ol2Conf.numZoomLevels,
            // zoomOffset: ol2Conf.zoomOffset,
            // resolutions: ol2Conf.resolutions
        };
        return olProps;
    },

    /**
     * Transforms the OpenLayers 2 config options to OL (>=v3) source pendants.
     *
     * @param  {Object} ol2Conf OL2 config
     * @return {Object}         OL (>=v3) source config
     */
    ol2PropsToOlSourceProps: function (ol2Conf) {
        var olSourceProps = {
            attributions: ol2Conf.attribution,
            projection: ol2Conf.projection,
            transition: ol2Conf.transitionEffect === null ? 0 : undefined,
            gutter: ol2Conf.gutter
        };

        return olSourceProps;
    }

});
