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

            // this gets transformed to qtip on the layer tree node
            mapLayer.set('description', layerConf.qtip);
            // changes the icon in the layer tree leaf
            mapLayer.set('iconCls', layerConf.iconCls);
            // indicator if a refresh option is offered in layer context menu
            var allowRefresh = layerConf.refreshLayerOption !== false;
            mapLayer.set('refreshLayerOption', allowRefresh);
            // indicator if a label option is drawn in layer context menu
            mapLayer.set('labelClassName', layerConf.labelClassName);
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

        // derive STYLES parameter: either directly set in serverOptions or we
        // we take the first of a possible SLD style list
        var styles = layerConf.serverOptions.styles;
        var activatedStyle;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            styles = layerConf.styles[0];
            activatedStyle = layerConf.styles[0];
        }

        var olSourceConf = {
            url: layerConf.url,
            params: {
                'LAYERS': layerConf.serverOptions.layers,
                'STYLES': styles,
                'TRANSPARENT': true,
                'TILED': !singleTile
            },
            ratio: singleTile ? 1 : undefined,
            crossOrigin: 'anonymous'
        };
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
            vectorSource.dispatchEvent('vectorloadstart');

            var allFilters = [];
            var bboxFilter = BasiGX.util.WFS.getBboxFilter(
                mapPanel.olMap,
                geometryProperty,
                extent,
                'bbox'
            );
            // this within the function is bound to the vector source it's
            // called from.
            var timeFilters = this.get('timeFilters');
            if (!Ext.isEmpty(timeFilters)) {
                allFilters = Ext.Array.merge(allFilters, timeFilters);
            }
            var numericFilters = this.get('numericFilters'); // TODO docs
            if (!Ext.isEmpty(numericFilters)) {
                numericFilters = BasiGX.util.WFS.unwrapFilter(numericFilters);
                allFilters = Ext.Array.merge(allFilters, numericFilters);
            }

            allFilters.push(bboxFilter);

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
            var additionalFilters = this.get('additionalFilters');

            if (additionalFilters) {
                Ext.each(additionalFilters, function(addFilter) {
                    var ogcUtil = GeoExt.util.OGCFilter;
                    var serializedFilter =
                        ogcUtil.getOgcFilterBodyFromExtJsFilterObject(addFilter, '2.0.0');
                    allFilters.push(serializedFilter);
                });
            }

            // merge all filters to OGC complain AND filter
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

                    if (contentType.indexOf('application/json') !== -1) {
                        var features = format.readFeatures(
                            xhr.responseText
                        );
                        vectorSource.addFeatures(features);
                        vectorSource.dispatchEvent('vectorloadend');
                    } else {
                        onError();
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

        var olLayerConf = {
            name: layerConf.text,
            source: clusterSource ? clusterSource : vectorSource,
            toolTipConfig: layerConf.tooltipsConfig,
            isTimeDependent: !!layerConf.timeitem,
            dateFormat: layerConf.dateFormat,
            timeProperty: layerConf.timeitem,
            isWfs: true,
            // TODO docs
            // TODO wouldn't it make sense to have the actual field here
            //      instead of at the slider and globally for all layers?
            isNumericDependent: Ext.isDefined(layerConf.numericitem),
            styles: layerConf.styles,
            stylesBaseUrl: layerConf.stylesBaseUrl || '',
            stylesForceNumericFilterVals: layerConf.stylesForceNumericFilterVals
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var wfsLayer = new ol.layer.Vector(olLayerConf);

        // derive SLD to style WFS: either directly set in sldUrl or we
        // we take the first of a possible SLD style list
        var sldUrl = layerConf.sldUrl;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            sldUrl = wfsLayer.get('stylesBaseUrl') + layerConf.styles[0];
            wfsLayer.set('activatedStyle', layerConf.styles[0]);
        }

        if (sldUrl) {
            // load and parse style and apply it to layer
            LayerFactory.loadSld(wfsLayer, sldUrl, layerConf.stylesForceNumericFilterVals);
        }

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

        var olSourceConf = {
            format: new ol.format[layerConf.format](),
            url: layerConf.url
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var olLayerConf = {
            name: layerConf.text,
            declutter: true,
            source: new ol.source.VectorTile(olSourceConf),
            styles: layerConf.styles,
            stylesBaseUrl: layerConf.stylesBaseUrl || '',
            stylesForceNumericFilterVals: layerConf.stylesForceNumericFilterVals
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var vtLayer = new ol.layer.VectorTile(olLayerConf);

        // derive SLD to style Vector Tiles:
        // we take the first of a possible SLD style list
        var sldUrl;
        if (Ext.isArray(layerConf.styles) && layerConf.styles.length) {
            sldUrl = vtLayer.get('stylesBaseUrl') + layerConf.styles[0];
            vtLayer.set('activatedStyle', layerConf.styles[0]);
        }
        if (sldUrl) {
            // load and parse style and apply it to layer
            LayerFactory.loadSld(vtLayer, sldUrl, layerConf.stylesForceNumericFilterVals);
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
            var bbox = source.getTileGrid().getTileCoordExtent(coord);
            var tileSize = source.getTileGrid().getTileSize(coord);
            var url = source.getUrls()[0]
                .replace('BBOX={bbox}', 'BBOX=' + bbox.toString())
                .replace('WIDTH={width}', 'WIDTH=' + tileSize)
                .replace('HEIGHT={height}', 'HEIGHT=' + tileSize);

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
    loadSld: function (mapLayer, sldUrl, forceNumericFilterVals) {
        Ext.Ajax.request({
            url: sldUrl,
            method: 'GET',
            success: function(response) {
                var sldXml = response.responseText;
                var sldParser = new GeoStylerSLDParser.SldStyleParser();
                var olParser = new GeoStylerOpenlayersParser.OlStyleParser(ol);

                sldParser.readStyle(sldXml)
                    .then(function (gs) {

                        if (forceNumericFilterVals) {
                            // transform filter values to numbers ('1' => 1)
                            gs = LayerFactory.forceNumericFilterValues(gs);
                        }

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
     * Transforms the filter values in the given GeoStyler style object to
     * a number (if numeric).
     *
     * @param  {Object} gsStyle GeoStyler style object
     * @return {Object}         GeoStyler style object with numeric filter vals
     */
    forceNumericFilterValues: function (gsStyle) {
        Ext.each(gsStyle.rules, function (rule) {
            var filterVal = rule.filter[2];
            if (Ext.isNumeric(filterVal)) {
                rule.filter[2] = parseFloat(filterVal);
            }
        });

        return gsStyle;
    }

});
