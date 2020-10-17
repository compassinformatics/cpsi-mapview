/**
 * Factory util class to generate OpenLayers layer instances according to a
 * JSON configuration.
 *
 * @class CpsiMapview.factory.Layer
 */
Ext.define('CpsiMapview.factory.Layer', {
    alternateClassName: 'LayerFactory',
    requires: [
        'CpsiMapview.util.Legend',
        'CpsiMapview.view.main.Map',
        'CpsiMapview.view.layer.ToolTip',
        'CpsiMapview.util.WmsFilter',
        'BasiGX.util.Layer',
        'BasiGX.util.Map',
        'BasiGX.util.WFS',
        'BasiGX.util.Namespace'
    ],

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
            case 'xyz':
                mapLayer = LayerFactory.createXyz(layerConf);
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
            case 'vt':
                mapLayer = LayerFactory.createVectorTilesLayer(layerConf);
                break;
            case 'vtwms':
                mapLayer = LayerFactory.createVectorTilesWmsLayer(layerConf);
                break;
            default:
                Ext.log.warn('Layer type not known');
            //do nothing, and return empty layer
        }

        // This is the same for all types except switchlayer
        // which returns one of its 2 child layers

        if (mapLayer && layerType !== 'switchlayer') {
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
            mapLayer.set('layerKey', layerConf.layerKey);

            // indicator if a refresh option is offered in layer context menu
            var allowRefresh = layerConf.refreshLayerOption !== false;
            mapLayer.set('refreshLayerOption', allowRefresh);
            // indicator if a label option is drawn in layer context menu for wms layers
            mapLayer.set('labelClassName', layerConf.labelClassName);
            // indicator if an opacity slider is offered in layer context menu
            var allowOpacitySlider = layerConf.opacitySlider !== false;
            mapLayer.set('opacitySlider', allowOpacitySlider);
            // the xtype of any associated grid
            mapLayer.set('gridXType', layerConf.gridXType);
            // if layer should show a feature info window
            mapLayer.set('featureInfoWindow', layerConf.featureInfoWindow);
            // attribute grouping config
            mapLayer.set('grouping', layerConf.grouping);
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

    /**
     * Creates an layer which renders shows a WMS for small scales and a WFS
     * for large scales as sub layer.
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Base}    The created sub layer
     */
    createSwitchLayer: function(layerConf) {
        // compute switch resolution when layer is
        // initialised the first time
        if(!layerConf.switchResolution){

            // compute resolution from scale
            var unit = BasiGX.util.Map.getMapComponent().getView().getProjection().getUnits();
            var vectorFeaturesMinScale = layerConf.vectorFeaturesMinScale;
            var switchResolution = BasiGX.util.Map.getResolutionForScale(vectorFeaturesMinScale ,unit);

            // add computed switch resolution to layerConf
            layerConf.switchResolution = switchResolution;
        }

        // create layer depending on the resolution
        var mapPanel = CpsiMapview.view.main.Map.guess();
        var resolution = mapPanel.olMap.getView().getResolution();

        var resultLayer;
        var olVisibility = { openLayers: { visibility: layerConf.visibility } };
        if (resolution < layerConf.switchResolution) {
            var confBelowSwitchResolution = layerConf.layers[1];
            // apply overall visibility to sub layer
            Ext.Object.merge(confBelowSwitchResolution, olVisibility);
            resultLayer = LayerFactory.createLayer(confBelowSwitchResolution);
            resultLayer.set('currentSwitchType', 'below_switch_resolution');
        } else {
            var confAboveSwitchResolution = layerConf.layers[0];
            // apply overall visibility to sub layer
            Ext.Object.merge(confAboveSwitchResolution, olVisibility);
            resultLayer = LayerFactory.createLayer(confAboveSwitchResolution);
            resultLayer.set('currentSwitchType', 'above_switch_resolution');
        }

        // store the whole layer configuration
        resultLayer.set('switchConfiguration', layerConf);

        // for later identification
        resultLayer.set('isSwitchLayer', true);

        return resultLayer;
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

        var serverOptions = {};

        // force all keys to be uppercase
        Ext.Object.each(layerConf.serverOptions, function (key, value) {
            serverOptions[key.toUpperCase()] = value;
        });

        // derive STYLES parameter: either directly set in serverOptions or we
        // we take the first of a possible SLD style list
        var styles = serverOptions.STYLES || '';
        var activatedStyle;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            // check if first possible SLD style list is an object (with STYLES
            // name and UI alias) or if the STYLES name is directly provided.
            var firstStyle = layerConf.styles[0];
            var stylesWmsParam =
                Ext.isObject(firstStyle) ? firstStyle.name : firstStyle;
            styles = stylesWmsParam;
            activatedStyle = stylesWmsParam;
        }

        var olSourceConf = {
            url: layerConf.url,
            params: {
                'STYLES': styles,
                'TRANSPARENT': true,
                'TILED': !singleTile
            },
            ratio: singleTile ? 1 : undefined,
            crossOrigin: 'anonymous'
        };

        // apply any WMS serverOptions from the config to the params
        olSourceConf.params = Ext.apply(olSourceConf.params, serverOptions);

        if (!olSourceConf.params.LAYERS) {
            Ext.log.warn('LAYERS parameter not set on WMS');
        }

        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            isTimeDependent: !!layerConf.timeitem,
            dateFormat: layerConf.dateFormat,
            timeProperty: layerConf.timeitem,
            isNumericDependent: Ext.isDefined(layerConf.numericitem), // TODO docs
            isWms: true, // TODO docs
            styles: layerConf.styles, // TODO docs
            activatedStyle: activatedStyle
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
    * Creates custom filters for a vector layer
    *
    * @param {ol.source.Vector}  Vector layer source
    * @return {Ext.util.Filter[]} filters array with custom filters
    */
    createCustomFilters: function (layerSource) {
        var allFilters = [];

        // this within the function is bound to the vector source it's
        // called from.
        var timeFilters = layerSource.get('timeFilters');
        if (!Ext.isEmpty(timeFilters)) {
            allFilters = Ext.Array.merge(allFilters, timeFilters);
        }
        var numericFilters = layerSource.get('numericFilters'); // TODO docs
        if (!Ext.isEmpty(numericFilters)) {
            numericFilters = BasiGX.util.WFS.unwrapFilter(numericFilters);
            allFilters = Ext.Array.merge(allFilters, numericFilters);
        }

        /**
         * Apply additional filters.
         * To get access to them here an instance of `Ext.grid.filter.filters`
         * must be set on layer source.
         * For example, this can be possibly achieved via `filterchange`
         * listener of FeatureGrid component if used with GeoExt feature grid
         * component:
         *
         *   'filterchange': function (rec, filters) {
         *       var wfsLayerSource = someWfsLayer.getSource();
         *       wfsLayerSource.getSource().set('additionalFilters', filters);
         *       wfsLayerSource.clear();
         *       wfsLayerSource.refresh();
         *    }
         *
         * See also GeoExt3 example for filter-grid:
         * https://rawgit.com/geoext/geoext3/master/examples/features/grid-filter.html
         *
         */
        var additionalFilters = layerSource.get('additionalFilters');

        if (additionalFilters) {
            Ext.each(additionalFilters, function(addFilter) {
                var ogcUtil = GeoExt.util.OGCFilter;
                var serializedFilter =
                    ogcUtil.getOgcFilterBodyFromExtJsFilterObject(addFilter, '2.0.0');
                allFilters.push(serializedFilter);
            });
        }

        return allFilters;
    },

    /**
     * Creates an OGC WFS layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Vector}  WFS layer
     */
    createWfs: function(layerConf) {
        var url = layerConf.url;
        var baseUrl = layerConf.url;
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
        var serverOptions = layerConf.serverOptions || {};

        var params = {
            SERVICE: 'WFS',
            REQUEST: 'GetFeature',
            VERSION: '1.1.0',
            OUTPUTFORMAT: 'application/json',
            TYPENAME: featureType,
            SRSNAME: srid
        };

        Ext.iterate(serverOptions, function(key, val) {
            key = (key + '').toUpperCase();
            if (key in params && val === null) {
                delete params[key];
            } else {
                params[key] = val;
            }
        });

        url = Ext.String.urlAppend(url, Ext.Object.toQueryString(params));

        var olSourceConf = {
            format: new ol.format.GeoJSON(),
            strategy: ol.loadingstrategy.bbox
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var vectorSource = new ol.source.Vector(olSourceConf);

        var loaderFn = function(extent) {
            var layerSource = this;
            vectorSource.dispatchEvent('vectorloadstart');

            var allFilters = LayerFactory.createCustomFilters(layerSource);

            var bboxFilter = BasiGX.util.WFS.getBboxFilter(
                mapPanel.olMap,
                geometryProperty,
                extent,
                'bbox'
            );

            allFilters.push(bboxFilter);

            // merge all filters to OGC compliant AND filter
            var filter = BasiGX.util.WFS.combineFilters(allFilters);
            var reqUrl = Ext.String.urlAppend(
                url, 'FILTER=' + encodeURIComponent(filter)
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
                    // check the request returns the same type as the vectorSource
                    var contentType = xhr.getResponseHeader('Content-Type');
                    var format = vectorSource.getFormat();

                    // on occasion a WFS response from MapServer is empty with no error
                    // but with HTTP status 200 (for unknown reasons)
                    // fail here to avoid OL parsing errors
                    if (xhr.responseText === '') {
                        onError();
                    } else {
                        if (contentType.indexOf('application/json') !== -1) {
                            var features = format.readFeatures(
                                xhr.responseText
                            );
                            vectorSource.addFeatures(features);
                            vectorSource.dispatchEvent('vectorloadend');
                        } else {
                            onError();
                        }
                    }
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

        var namespaceDefinitions = layerConf.namespaceDefinitions;
        if (namespaceDefinitions) {
            Ext.iterate(namespaceDefinitions, function (prefix, uri) {
                BasiGX.util.Namespace.namespaces[prefix] = uri;
            });
        }

        var olLayerConf = {
            name: layerConf.text,
            source: clusterSource ? clusterSource : vectorSource,
            toolTipConfig: layerConf.tooltipsConfig,
            isTimeDependent: !!layerConf.timeitem,
            dateFormat: layerConf.dateFormat,
            timeProperty: layerConf.timeitem,
            isWfs: true,
            filterable: layerConf.filterable,
            url: baseUrl,
            featureType: featureType,
            geomFieldName: layerConf.geomFieldName,
            // TODO docs
            // TODO wouldn't it make sense to have the actual field here
            //      instead of at the slider and globally for all layers?
            isNumericDependent: Ext.isDefined(layerConf.numericitem),
            styles: layerConf.styles,
            stylesBaseUrl: layerConf.stylesBaseUrl || '',
            sldUrl: layerConf.sldUrl,
            sldUrlLabel: layerConf.sldUrlLabel
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var wfsLayer = new ol.layer.Vector(olLayerConf);

        // derive SLD to style WFS: either directly set in sldUrl or we
        // we take the first of a possible SLD style list
        var sldUrl = layerConf.sldUrl;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            // check if first SLD style in list is an object (with SLD file
            // name and UI alias) or if the SLD file name is directly provided
            var firstStyle = layerConf.styles[0];
            var style = Ext.isObject(firstStyle) ? firstStyle.name : firstStyle;
            sldUrl = wfsLayer.get('stylesBaseUrl') + style;
            wfsLayer.set('activatedStyle', style);
        }

        if (sldUrl) {
            // load and parse style and apply it to layer
            LayerFactory.loadSld(wfsLayer, sldUrl);
        }

        if (layerConf.tooltipsConfig) {
            // create a custom toolitp for this layer
            LayerFactory.registerLayerTooltip(wfsLayer);
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
     * Creates a XYZ tile layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} XYZ tile layer
     */
    createXyz: function(layerConf) {
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {
            url: layerConf.url
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
     * Creates a XYZ based Vector Tile layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.VectorTile}  Vector Tile layer
     */
    createVectorTilesLayer: function (layerConf) {

        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        // check for correct OL format and use 'MVT' as fallback
        var format = layerConf.format;
        if (!ol.format[format]) {
            format = 'MVT';
            Ext.Logger.warn('Unsupported format for Vector Tiles layer "' +
                layerConf.text + '" given in config. Will use "MVT" ' +
                'as fallback.');
        }

        var olSourceConf = {
            format: new ol.format[format](),
            url: layerConf.url
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            declutter: true,
            source: new ol.source.VectorTile(olSourceConf),
            isVt: true,
            styles: layerConf.styles,
            stylesBaseUrl: layerConf.stylesBaseUrl || '',
            toolTipConfig: layerConf.tooltipsConfig,
            sldUrl: layerConf.sldUrl,
            sldUrlLabel: layerConf.sldUrlLabel
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var vtLayer = new ol.layer.VectorTile(olLayerConf);

        // derive SLD to style Vector Tiles:
        // we take the first of a possible SLD style list
        var sldUrl;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            // check if first SLD style in list is an object (with SLD file
            // name and UI alias) or if the SLD file name is directly provided
            var firstStyle = layerConf.styles[0];
            var style = Ext.isObject(firstStyle) ? firstStyle.name : firstStyle;
            sldUrl = vtLayer.get('stylesBaseUrl') + style;
            vtLayer.set('activatedStyle', style);
        }
        if (sldUrl) {
            // load and parse style and apply it to layer
            LayerFactory.loadSld(vtLayer, sldUrl);
        }

        if (layerConf.tooltipsConfig) {
            // enable map tooltips for this layer
            LayerFactory.registerLayerTooltip(vtLayer);
        }

        // workaround to apply an opacity for the vector tile layer
        // just setting 'opacity' to the layer does not work
        // seems related to https://github.com/openlayers/openlayers/issues/4758
        if (Ext.isNumber(layerConf.opacity)) {
            vtLayer.on('precompose', function(evt) {
                evt.context.globalAlpha = layerConf.opacity;
            });
        }

        return vtLayer;
    },

    /**
     * Creates a Vector Tile layer with the WMS facade of Mapserver
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.VectorTile}  Vector Tile layer
     */
    createVectorTilesWmsLayer: function (layerConf) {
        var vtLayer = LayerFactory.createVectorTilesLayer(layerConf);
        var source = vtLayer.getSource();

        // apply a custom tileUrlFunction in order to create a valid URL
        // to retrieve the Vector Tiles via WMS facade
        source.setTileUrlFunction(function(coord) {
            var filters = LayerFactory.createCustomFilters(source);
            var ogcFilter = null;

            // merge all filters to OGC compliant AND filter
            if (filters.length > 0) {
                ogcFilter = BasiGX.util.WFS.combineFilters(filters);
            }

            var bbox = source.getTileGrid().getTileCoordExtent(coord);
            var tileSize = source.getTileGrid().getTileSize(coord);
            var url = source.getUrls()[0]
                .replace('BBOX={bbox}', 'BBOX=' + bbox.toString())
                .replace('WIDTH={width}', 'WIDTH=' + tileSize)
                .replace('HEIGHT={height}', 'HEIGHT=' + tileSize);

            if (ogcFilter) {
                url = Ext.String.urlAppend(
                    url, 'FILTER=' + encodeURIComponent(ogcFilter)
                );
            }
            return url;
        });

        return vtLayer;
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
    },

    /**
     * Loads and parses the given SLD (by URL) and applies it to the given
     * vector layer.
     *
     * @param  {ol.layer.Vector} mapLayer The layer to apply the style to
     * @param  {String} sldUrl   The URL to the SLD
     */
    loadSld: function (mapLayer, sldUrl) {
        Ext.Ajax.request({
            url: sldUrl,
            method: 'GET',
            success: function(response) {
                var sldXml = response.responseText;
                var sldParser = new GeoStylerSLDParser.SldStyleParser();
                var olParser = new GeoStylerOpenlayersParser.OlStyleParser(ol);

                sldParser.readStyle(sldXml)
                    .then(function (gs) {

                        olParser.writeStyle(gs).then(function (olStyle) {
                            mapLayer.setStyle(olStyle);
                        });
                    }, function() {
                        // rejection
                        Ext.log.warn('Could not parse SLD ' + sldUrl +
                            '! Default OL style will be applied.');
                    });
            },
            failure: function() {
                Ext.log.warn('Could not load SLD ' + sldUrl +
                    '! Default OL style will be applied.');
            }
        });
    },

    /**
     * Registers and enables map tooltips for the given layer.
     * The layer needs a config property 'toolTipConfig' holding the tooltip
     * configuration object from the JSON layer config.
     *
     * @param  {ol.layer.Vector | ol.layer.VectorTile} layer The layer to enable map tooltips for
     */
    registerLayerTooltip: function (layer) {
        var mapPanel = CpsiMapview.view.main.Map.guess();
        // create a custom tooltip for this layer
        var toolTip = Ext.create('CpsiMapview.view.layer.ToolTip', {
            toolTipConfig: layer.get('toolTipConfig'),
            layer: layer
        });
        layer.toolTip = toolTip;

        // show / hide on appropriate events
        mapPanel.on('cmv-map-pointerrest', function(hoveredObjs, evt) {
            // show tooltip with feature attribute information
            Ext.each(hoveredObjs, function (hoveredObj) {
                if (hoveredObj.layer &&
                      hoveredObj.layer.id === layer.id &&
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
    },

    /**
     * Loops through all layers, identifies switch layers
     * and replaces them if required
     *
     * @param {ol.Object.Event} evt The event which contains the view.
     */
    handleSwitchLayerOnResolutionChange: function(evt) {
        var resolution = evt.target.getResolution();
        var layerCollection = BasiGX.util.Map.getMapComponent().getMap().getLayers();

        LayerFactory.checkSwitchLayersRecursively(layerCollection, resolution);
    },

    /**
     * Traverses layertree including subgroups and
     * changes switch layers if necessary
     * @param {*} overlayCollection the layers of the map
     * @param {*} resolution the current resolution of the map
     */
    checkSwitchLayersRecursively: function(overlayCollection, resolution) {

        overlayCollection.forEach(function (layerOrGroup, index){

            if(layerOrGroup instanceof ol.layer.Layer){

                var layer = layerOrGroup;

                var isSwitchLayer = layer.get('isSwitchLayer');
                var switchNecessary = false;

                if(isSwitchLayer){
                    switchNecessary = LayerFactory.isLayerSwitchNecessary(layer, resolution);
                }

                if(isSwitchLayer && switchNecessary){

                    var switchConfiguration = layer.get('switchConfiguration');
                    // restore current layer visibility
                    switchConfiguration.visibility = layer.getVisible();
                    // also apply current filter and selected style

                    var activeStyle = layer.get('activatedStyle');
                    var filters = layer.getSource().get('additionalFilters');

                    var newLayer = LayerFactory.createSwitchLayer(switchConfiguration);
                    var newLayerSource = newLayer.getSource();
                    // store filters for either layer type so they can be retrieved when switching
                    newLayerSource.set('additionalFilters', filters);

                    // add original tree config (from tree.json) to new layer
                    var origTreeNodeConf = newLayer.get('_origTreeConf');
                    if (!origTreeNodeConf) {
                        origTreeNodeConf = CpsiMapview.controller.LayerTreeController.getTreeNodeConf(newLayer.get('layerKey'));
                        newLayer.set('_origTreeConf', origTreeNodeConf);
                    }

                    if (newLayer.get('isWms')) {

                        activeStyle = LegendUtil.getWmsStyleFromSldFile(activeStyle);

                        // check if a label STYLES parameter was added --> keep this
                        // the STYLES value (SLD) for the labels
                        var labelClassName = newLayer.get('labelClassName');
                        if (newLayer.get('labelsActive') === true) {
                            activeStyle += ',' + labelClassName;
                        }

                        if (filters && filters.length > 0) {
                            newLayerSource.getParams().FILTER = GeoExt.util.OGCFilter.getOgcFilterFromExtJsFilter(filters, 'wms', 'and', '1.1.0');
                        }

                        // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
                        var wmsFilterUtil = CpsiMapview.util.WmsFilter;
                        var wmsFilterString = wmsFilterUtil.getWmsFilterString(newLayer);

                        // apply new style parameter and reload layer
                        var newParams = {
                            STYLES: activeStyle,
                            FILTER: wmsFilterString,
                            cacheBuster: Math.random()
                        };

                        newLayerSource.updateParams(newParams);

                    } else if (newLayer.get('isWfs') || newLayer.get('isVt')) {

                        var wmsLayerName = layer.getSource().getParams()['LAYERS'].split(',')[0];
                        activeStyle = LegendUtil.getSldFileFromWmsStyle(activeStyle, wmsLayerName);

                        // TODO following code duplicated in CpsiMapview.view.layer.StyleSwitcherRadioGroup
                        var sldUrl = newLayer.get('stylesBaseUrl') + activeStyle;
                        // transform filter values to numbers ('1' => 1)
                        // load and parse SLD and apply it to layer
                        LayerFactory.loadSld(newLayer, sldUrl);
                        newLayerSource.clear();
                        newLayerSource.refresh();

                    } else {
                        Ext.Logger.info('Layer type not supported in StyleSwitcherRadioGroup');
                    }

                    overlayCollection.setAt(index, newLayer);
                    newLayer.set('activatedStyle', activeStyle);

                    LayerFactory.updateLayerTreeForSwitchLayers();

                }
            }

            else if(layerOrGroup instanceof ol.layer.Group){
                var newOverlayCollection = layerOrGroup.getLayers();
                LayerFactory.checkSwitchLayersRecursively(newOverlayCollection, resolution);
            }
        });
    },

    /**
     * Checks if the switch layer has to be replaced
     *
     * @param {ol.layer.Base} layer the layer to check
     * @param {Number} resolution  the resolution of the map view
     */
    isLayerSwitchNecessary: function(layer, resolution) {
        var switchConfiguration = layer.get('switchConfiguration');
        // get precomputed switch resolution from layer config
        var switchResolution = switchConfiguration.switchResolution;

        // logic that checks when a switch layer needs to be replaced
        var mapviewBelowSwitchResolution = (resolution < switchResolution);
        var mapViewAboveSwitchResolution = !mapviewBelowSwitchResolution;

        var currentSwitchType = layer.get('currentSwitchType');

        var createCloseView = (mapviewBelowSwitchResolution && (currentSwitchType === 'above_switch_resolution'));
        var createFarAwayView = (mapViewAboveSwitchResolution && (currentSwitchType === 'below_switch_resolution'));

        return createCloseView || createFarAwayView;
    },


    /**
     * Updates the switch layer items of the layer tree. This is
     * necessary when switch layers get replaced.
     */
    updateLayerTreeForSwitchLayers: function() {
        var treePanel = Ext.ComponentQuery.query('treepanel')[0];
        var treeStore = treePanel.getStore();
        var treeNodes = treeStore.getData();

        Ext.each(treeNodes.items, function (node) {
            var switchConf = node.getOlLayer().get('switchConfiguration');

            // only change for switch layers
            if(switchConf) {
                // apply tree node text from tree config
                var origTreeNodeConf = node.getOlLayer().get('_origTreeConf');
                node.set('text', origTreeNodeConf.text);
                // trigger UI updates (e.g. tree node plugins)
                node.triggerUIUpdate();
            }
        });
    }
});
