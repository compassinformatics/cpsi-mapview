/**
 * Factory util class to generate OpenLayers layer instances according to a
 * JSON configuration.
 *
 * @class CpsiMapview.factory.Layer
 */
Ext.define('CpsiMapview.factory.Layer', {
    alternateClassName: 'LayerFactory',
    requires: [
        'CpsiMapview.util.Layer',
        'CpsiMapview.view.main.Map',
        'CpsiMapview.view.layer.ToolTip',
        'CpsiMapview.util.WmsFilter',
        'BasiGX.util.Layer',
        'BasiGX.util.Map',
        'BasiGX.util.WFS',
        'BasiGX.util.Namespace',
        'CpsiMapview.util.SwitchLayer',
        'CpsiMapview.util.Style'
    ],

    singleton: true,

    /**
     * Creates an OpenLayer layer object from a JSON config
     *
     * @param  {Object} layerConf  The configuration object
     * @return {ol.layer.Base} OL layer object
     */
    createLayer: function (layerConf) {

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
            // the preset filters for the grid
            mapLayer.set('gridFilters', layerConf.gridFilters);
            // if layer should show a feature info window
            mapLayer.set('featureInfoWindow', layerConf.featureInfoWindow);
            // attribute grouping config
            mapLayer.set('grouping', layerConf.grouping);
            // if layer has metadata
            mapLayer.set('hasMetadata', layerConf.hasMetadata);
            // if a layer has its own help page
            mapLayer.set('helpUrl', layerConf.helpUrl);
        }

        mapLayer.set('_origLayerConf', layerConf);

        return mapLayer;
    },

    /**
     * The handler when a virtual base layer changes its visibility. This method
     * ensures that only one of these virtual base layers is visible at a time.
     *
     * @param {ol.Object.Event} evt The event which contains the layer.
     */
    ensureOnlyOneBaseLayerVisible: function (evt) {
        var changedLayer = evt.target;
        if (changedLayer.get('isBaseLayer') && changedLayer.getVisible()) {
            var allLayers = BasiGX.util.Layer.getAllLayers();
            Ext.each(allLayers, function (layer) {
                if (!layer.get('isBaseLayer') || layer.id === changedLayer.id) {
                    return;
                }
                if (layer.getVisible()) {
                    layer.setVisible(false);
                }
            });
        }

    },

    createEmptyLayer: function (layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    /**
     * Creates a layer which renders a WMS for small scales and a WFS
     * for large scales as sub layer.
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Base}    The created sub layer
     */
    createSwitchLayer: function (layerConf) {
        // compute switch resolution when layer is
        // initialised the first time
        if (!layerConf.switchResolution) {

            // compute resolution from scale
            var unit = BasiGX.util.Map.getMapComponent().getView().getProjection().getUnits();
            var vectorFeaturesMinScale = layerConf.vectorFeaturesMinScale;
            var switchResolution = BasiGX.util.Map.getResolutionForScale(vectorFeaturesMinScale, unit);

            // add computed switch resolution to layerConf
            layerConf.switchResolution = switchResolution;
        }

        // create layer depending on the resolution
        var mapPanel = CpsiMapview.view.main.Map.guess();
        var resolution = mapPanel.olMap.getView().getResolution();

        var resultLayer;
        var olVisibility = { openLayers: { visibility: layerConf.visibility } };
        var switchLayerUtil = CpsiMapview.util.SwitchLayer;

        if (resolution < layerConf.switchResolution) {
            var confBelowSwitchResolution = layerConf.layers[1];
            // apply overall visibility to sub layer
            Ext.Object.merge(confBelowSwitchResolution, olVisibility);
            resultLayer = LayerFactory.createLayer(confBelowSwitchResolution);
            resultLayer.set(
                'currentSwitchType',
                switchLayerUtil.switchStates.BELOW_SWITCH_RESOLUTION
            );
        } else {
            var confAboveSwitchResolution = layerConf.layers[0];
            // apply overall visibility to sub layer
            Ext.Object.merge(confAboveSwitchResolution, olVisibility);
            resultLayer = LayerFactory.createLayer(confAboveSwitchResolution);
            resultLayer.set(
                'currentSwitchType',
                switchLayerUtil.switchStates.ABOVE_SWITCH_RESOLUTION
            );
        }

        // store the whole layer configuration
        resultLayer.set('switchConfiguration', layerConf);

        // for later identification
        resultLayer.set('isSwitchLayer', true);

        return resultLayer;
    },

    /**
     * An image load function that can be used to load WMS tiles using POST requests
     * rather than GET requests. When there are many attribute and spatial filters
     * the URL of a GET request gets too long so POST is required.
     * @param {any} image
     * @param {any} src
     */
    imageLoadFunction: function (image, src) {
        var img = image.getImage();
        if (typeof window.btoa === 'function') {
            // base64 encoding function is available in IE10+
            var urlArray = src.split('?');
            var url = urlArray[0];
            var params = urlArray[1];

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.status === 200) {

                    var type = xhr.getResponseHeader('content-type');
                    if (type.indexOf('image') === 0) {
                        var uInt8Array = new Uint8Array(this.response); //TODO Uint8Array is only available in IE10+
                        var i = uInt8Array.length;
                        var binaryString = new Array(i);
                        while (i--) {
                            binaryString[i] = String.fromCharCode(uInt8Array[i]);
                        }
                        var data = binaryString.join('');
                        img.src = 'data:' + type + ';base64,' + window.btoa(data);
                    } else {
                        // trigger an error so the loading bar is reset
                        // see https://github.com/openlayers/openlayers/issues/10868#issuecomment-608424234
                        image.state = 3; // ImageState.ERROR;
                        image.changed();

                        // MapServer returns errors as 'text/html'
                        if (type.indexOf('text/html') === 0) {
                            if ('TextDecoder' in window) {
                                Ext.Logger.warn(new TextDecoder('utf-8').decode(this.response));
                            }
                        }

                        if (type.indexOf('application/json') === 0) {
                            var result = JSON.parse(new TextDecoder('utf-8').decode(this.response));
                            if (result.success !== true) {
                                var app = Ext.getApplication();
                                switch (result.errorCode) {
                                    case app.errorCode.UserTokenExpired:
                                    case app.errorCode.CookieHeaderMissing:
                                    case app.errorCode.NoTokenProvided:
                                        // user must login again
                                        app.doLogin();
                                        break;
                                    default:
                                        Ext.Msg.alert('Error', result.message);
                                        break;
                                }
                            }
                        }
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.responseType = 'arraybuffer';
            xhr.send(params);
        } else {
            img.src = src;
        }
    },


    /**
     * Creates an OGC WMS layer
     *
     * @param  {Object} layerConf The configuration object for this layer
     * @return {ol.layer.Tile}    WMS layer
     */
    createWms: function (layerConf) {

        var me = this;
        var layer;
        var singleTile = layerConf.openLayers.singleTile;
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = me.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = me.ol2PropsToOlLayerProps(layerConf.openLayers);

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

        // by default WMS layers are requested using GET, but can be configured
        // to use POST to allow for filters that will not fit in the querystring

        var usePost = false;
        if (layerConf.requestMethod === 'POST') {
            usePost = true;
            olSourceConf.imageLoadFunction = me.imageLoadFunction;
        }

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
            activatedStyle: activatedStyle,
            url: layerConf.url,
            layers: olSourceConf.params.LAYERS
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        if (singleTile) {

            if (layerConf.debounce !== undefined) {
                var blankSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                var currentImgElement;
                var task = new Ext.util.DelayedTask();
                olSourceConf.imageLoadFunction = function (image, src) {
                    if (currentImgElement) {
                        currentImgElement.src = blankSrc;
                    }
                    currentImgElement = image.getImage();
                    if (task.id === null) {
                        // no pending task
                        if (usePost) {
                            me.imageLoadFunction(image, src);
                        } else {
                            currentImgElement.src = src;
                        }
                        currentImgElement = undefined;
                        task.delay(layerConf.debounce, function () { });
                    } else {
                        task.delay(layerConf.debounce, function () {
                            if (usePost) {
                                me.imageLoadFunction(image, src);
                            } else {
                                currentImgElement.src = src;
                            }
                            currentImgElement = undefined;
                        });
                    }
                };
            }

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
    createWfs: function (layerConf) {
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
        var geomFieldName = layerConf.geomFieldName ? layerConf.geomFieldName : 'geometry';
        var serverOptions = layerConf.serverOptions || {};

        var params = {
            SERVICE: 'WFS',
            REQUEST: 'GetFeature',
            VERSION: '1.1.0',
            OUTPUTFORMAT: 'application/json',
            TYPENAME: featureType,
            SRSNAME: srid
        };

        // merge serverOptions into params
        Ext.iterate(serverOptions, function (key, val) {
            key = (key + '').toUpperCase();
            if (key in params && val === null) {
                delete params[key];
            } else {
                params[key] = val;
            }
        });

        var olSourceConf = {
            format: new ol.format.GeoJSON(),
            strategy: ol.loadingstrategy.bbox
        };
        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        var vectorSource = new ol.source.Vector(olSourceConf);

        // Dynamically generate the propertyNames to request based on initial propertyname config and props referenced in tooltipsConfig
        // But only if serverOptions.propertyname has been set
        var parsedPropertyNames = Ext.Array.clean((serverOptions.propertyname || '').split(','));
        if (parsedPropertyNames.length) {
            var propertyNames = LayerFactory.buildRequiredPropertyNames(parsedPropertyNames, layerConf.tooltipsConfig);
            vectorSource.set('propertyNames', propertyNames);
            // keep track of property names defined in the original config and always add them to the request
            // to ensure scenarios where those properties are needed outside of the style and tooltip that they are present
            vectorSource.set('originalPropertyNames', parsedPropertyNames);
        } else {
            // serverOptions.propertyname not set / is empty
            // empty arrays ensure no PROPERTYNAME param is sent in the request below
            vectorSource.set('propertyNames', []);
            vectorSource.set('originalPropertyNames', []);
        }

        var loaderFn = function (extent) {
            var layerSource = this;
            vectorSource.dispatchEvent('vectorloadstart');
            // Get propertyNames and build the propertyNameParamObject. Omit the PROPERTYNAME key if propertyNames is empty
            // so that request will not have the PROPERTYNAME param meaning all fields will be returned
            var propertyNameParamObject = {};
            var propertyNames = Ext.Array.merge(vectorSource.get('propertyNames'), vectorSource.get('originalPropertyNames'));
            if (propertyNames.length) {
                propertyNameParamObject['PROPERTYNAME'] = propertyNames.join(',');
            }
            var baseUrlWithParams = Ext.String.urlAppend(baseUrl, Ext.Object.toQueryString(Ext.merge({}, params, propertyNameParamObject)));

            var allFilters = CpsiMapview.util.Layer.filterVectorSource(layerSource);

            var bboxFilter = Ext.String.format(
                GeoExt.util.OGCFilter.spatialFilterBBoxTpl,
                geomFieldName,
                params.SRSNAME,
                extent[0],
                extent[1],
                extent[2],
                extent[3]
            );

            allFilters.push(bboxFilter);

            // merge all filters to OGC compliant AND filter
            var filter = GeoExt.util.OGCFilter.combineFilters(allFilters, 'And', false, params.VERSION);
            var reqUrl = Ext.String.urlAppend(
                baseUrlWithParams, 'FILTER=' + encodeURIComponent(filter)
            );

            // add a timestamp parameter to the URL is set on the source
            // so that we can bypass the browser cache if required
            var ts = vectorSource.get('timestamp');
            if (ts) {
                reqUrl = Ext.String.urlAppend(
                    reqUrl, 'TIMESTAMP=' + ts
                );
            }
            // once the url is built we need to isolate the parameters element
            // so we can send as request body and send as POST,
            // otherwise the request url is too long.
            var urlArray = reqUrl.split('?');
            var urlpost = urlArray[0];
            var queryParams = urlArray[1];

            var xhr = new XMLHttpRequest();
            xhr.open('POST', urlpost);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            var onError = function () {
                vectorSource.removeLoadedExtent(extent);
                vectorSource.dispatchEvent('vectorloaderror');
            };
            xhr.onerror = onError;
            xhr.onload = function () {
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
            vectorSource.set('xhr', xhr);
            xhr.send(queryParams);
        };

        vectorSource.setLoader(loaderFn);

        // by default use clustering, however we may want to deactivate this for
        // line features
        var noCluster = layerConf.noCluster || false;
        var clusterSource;
        if (!noCluster) {
            var clusterSourceConf = {
                distance: 5,
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

        var styleConfigs = this.createStyleConfigs(layerConf);

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
            geomFieldName: geomFieldName,
            // TODO wouldn't it make sense to have the actual field here
            //      instead of at the slider and globally for all layers?
            isNumericDependent: Ext.isDefined(layerConf.numericitem),
            styles: styleConfigs,
            idProperty: layerConf.idProperty
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);
        var wfsLayer = new ol.layer.Vector(olLayerConf);

        if (!Ext.isEmpty(styleConfigs)) {
            wfsLayer.set('activatedStyle', styleConfigs[0].name);
        }

        // load and parse style and apply it to layer
        vectorSource.once(
            'vectorloadstart', function () {
                LayerFactory.loadSld(wfsLayer);
            }
        );

        if (layerConf.tooltipsConfig) {
            // create a custom tooltip for this layer
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
    createBing: function (layerConf, type) {
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
     * There are several different methods used to create style
     * configurations. This function ensures no matter which config approach
     * is used, an array of consistent style config objects is created on a layer
     */
    createStyleConfigs: function (layerConf) {

        var styleConfigs = [];

        // if an array of style objects is not set then we create an array
        // with a single entry
        if (!Ext.isArray(layerConf.styles) && layerConf.sldUrl) {
            styleConfigs.push({
                name: 'Default',
                title: 'Default',
                sldUrl: layerConf.sldUrl
            });
            return styleConfigs;
        }

        // GetStyles returns all styles in the service for a featureType
        // so this URL is identical for all styles in a WFS
        // vector tiles have a WMS-style URL with placeholders so we need to contruct the GetStyles
        // request differently
        var layerUrl;
        if (layerConf.layerType === 'vtwms') {
            layerUrl = layerConf.baseurl + 'version=1.3.0&request=GetStyles&service=WMS&layers=' + layerConf.layerIdentificationName;
        } else {
            layerUrl = layerConf.url + 'version=1.3.0&request=GetStyles&service=WMS&layers=' + layerConf.featureType;
        }


        // styleCfg can be a string (with a name) or an object
        Ext.Array.each(layerConf.styles, function (styleCfg) {

            var styleName, labelRule;
            if (Ext.isObject(styleCfg)) {
                styleName = styleCfg.name;
                labelRule = styleCfg.labelRule ? styleCfg.labelRule : '';
            } else {
                styleName = styleCfg;
                labelRule = '';
            }
            styleConfigs.push({
                name: styleName,
                sldUrl: styleCfg.sldUrl ? styleCfg.sldUrl : layerUrl,
                title: styleCfg.title ? styleCfg.title : styleName,
                labelRule: labelRule
            });
        });

        return styleConfigs;
    },

    /**
     * Creates a XYZ tile layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile} XYZ tile layer
     */
    createXyz: function (layerConf) {
        // transform OL2 properties to current ones supported by OL >=v3
        var olSourceProps = this.ol2PropsToOlSourceProps(layerConf.openLayers);
        var olLayerProps = this.ol2PropsToOlLayerProps(layerConf.openLayers);

        var olSourceConf = {
            url: layerConf.url
        };

        olSourceConf = Ext.apply(olSourceConf, olSourceProps);

        if (olSourceConf.tileGrid) {
            olSourceConf.tileGrid = new ol.tilegrid.TileGrid(olSourceConf.tileGrid);
        }

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
    createOsm: function (layerConf) {
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

    createGoogle: function (layerConf, layerType) {

        Ext.log.info('Not implemented yet', layerConf, layerType);
    },

    /**
     * Creates a World Wind (BlueMarble-200412) layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile}     World Wind (BlueMarble-200412) layer
     */
    createNasa: function (layerConf) {
        var nasaWms = this.createWms({
            url: 'https://worldwind25.arc.nasa.gov/wms?',
            serverOptions: {
                layers: 'BlueMarble-200412'
            },
            openLayers: layerConf.openLayers
        });

        return nasaWms;
    },

    createOs: function (layerConf) {
        Ext.log.info('Not implemented yet', layerConf);
    },

    createArcGisCache: function (layerConf) {
        // Maybe this helps: https://stackoverflow.com/a/41608464
        Ext.log.info('Not implemented yet', layerConf);
    },

    /**
     * Creates an ArcGIS REST layer
     *
     * @param  {Object} layerConf  The configuration object for this layer
     * @return {ol.layer.Tile}     ArcGIS REST layer
     */
    createArcGisRest: function (layerConf) {
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

    createServerArray: function (path) {
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
        var styleConfigs = this.createStyleConfigs(layerConf);
        var vectorSource = new ol.source.VectorTile(olSourceConf);

        var olLayerConf = {
            name: layerConf.text,
            declutter: true,
            source: vectorSource,
            isVt: true,
            styles: styleConfigs,
            toolTipConfig: layerConf.tooltipsConfig,
            baseurl: layerConf.baseurl,
            layerIdentificationName: layerConf.layerIdentificationName
        };
        olLayerConf = Ext.apply(olLayerConf, olLayerProps);

        var vtLayer = new ol.layer.VectorTile(olLayerConf);

        // derive SLD to style Vector Tiles:
        // we take the first of a possible SLD style list

        if (!Ext.isEmpty(styleConfigs)) {
            vtLayer.set('activatedStyle', styleConfigs[0].name);
        }

        // load and parse style and apply it to layer
        vectorSource.once(
            'tileloadstart', function () {
                LayerFactory.loadSld(vtLayer);
            }
        );

        if (layerConf.tooltipsConfig) {
            // enable map tooltips for this layer
            LayerFactory.registerLayerTooltip(vtLayer);
        }

        // workaround to apply an opacity for the vector tile layer
        // just setting 'opacity' to the layer does not work
        // seems related to https://github.com/openlayers/openlayers/issues/4758
        if (Ext.isNumber(layerConf.opacity)) {
            vtLayer.on('prerender', function (evt) {
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
        source.setTileUrlFunction(function (coord) {
            var filters = CpsiMapview.util.Layer.filterVectorSource(source);
            var ogcFilter = null;

            // merge all filters to OGC compliant AND filter
            if (filters.length > 0) {
                ogcFilter = GeoExt.util.OGCFilter.combineFilters(filters, 'And', false, '2.0.0');
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
            extent: ol2Conf.extent, // undefined if not set
            maxResolution: maxRes,
            minResolution: minRes
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
            gutter: ol2Conf.gutter,
            tileGrid: ol2Conf.tileGrid,
            tileSize: ol2Conf.tileSize
        };

        return olSourceProps;
    },

    /**
     * GeoStyler does not retain UserStyle names once parsed, we need to manually
     * remove the UserStyles from the XML doc we don't want before parsing
     */
    removeUnusedUserStyleNodes: function (sldXmlDoc, style, labelsActive) {

        var userStyles = Ext.DomQuery.select('UserStyle', sldXmlDoc);
        var labelRuleFound = false;

        Ext.Array.each(userStyles, function (userStyle) {

            var userStyleName = '';

            // Get the immediate child nodes named <se:Name>
            var childNodes = Array.prototype.slice.call(userStyle.children);
            var nameNodes = childNodes.filter(function (child) {
                return child.nodeName === 'se:Name';
            });

            if (nameNodes.length > 0) {
                userStyleName = nameNodes[0].textContent;
            }

            var keepNode = false;

            // if no UserStyle name is set then it will be displayed
            if (userStyleName === style.name || !userStyleName) {
                keepNode = true;
            }

            if (labelsActive === true && userStyleName === style.labelRule) {
                keepNode = true;
                labelRuleFound = true;
            }

            if (!keepNode) {
                userStyle.parentNode.removeChild(userStyle);
            }
        });

        if (labelsActive && !labelRuleFound) {
            //<debug>
            Ext.log.warn('Labels are set on the layer but the label UserStyle ' + style.labelRule + ' was not found');
            //</debug>
        }

        return sldXmlDoc;
    },

    applySldToLayer: function (mapLayer, sldXmlDoc, style) {

        var me = this;
        var labelsActive = mapLayer.get('labelsActive');
        sldXmlDoc = me.removeUnusedUserStyleNodes(sldXmlDoc, style, labelsActive);
        var sldXmlString = new XMLSerializer().serializeToString(sldXmlDoc);

        // assume SLD 1.1.0 until https://github.com/geostyler/geostyler-sld-parser/issues/696 is implemented
        var sldParser = new GeoStylerSLDParser.SldStyleParser({ sldVersion: '1.1.0' });
        var olParser = new GeoStylerOpenlayersParser.OlStyleParser(ol);
        sldParser.readStyle(sldXmlString)
            .then(function (gs) {
                if (gs.errors) {
                    Ext.log.warn('Errors parsing the SLD file "' + style.sldUrl + '". ' + gs.errors);
                    return;
                }

                olParser.writeStyle(gs.output).then(function (olStyleFunc) {

                    if (olStyleFunc.errors) {
                        Ext.log.warn('Errors writing the OpenLayers style "' + style.sldUrl + '". ' + olStyleFunc.errors);
                        return;
                    }

                    var source = mapLayer.getSource();
                    if (source instanceof ol.source.Cluster) {
                        // for clustered features add an additional style
                        // for any grouped features

                        var styleCache = {}; // cache styles per featCount
                        var styleFuncWrapper = function (feature, resolution) {
                            var featCount = feature.get('features').length;
                            var style;

                            if (featCount === 1) {
                                // call the standard style function
                                var feat = feature.get('features')[0];

                                if (typeof olStyleFunc.output === 'function') {
                                    style = olStyleFunc.output(feat, resolution);
                                } else {
                                    //<debug>
                                    // if there is one rule then an ol.style.Style is returned
                                    // rather than a function
                                    Ext.Assert.truthy(typeof olStyleFunc.output === 'object');
                                    //</debug>
                                    style = olStyleFunc.output;
                                }
                            } else {
                                // use a clustered style
                                style = styleCache[featCount];
                                if (!style) {
                                    style = CpsiMapview.util.Style.createClusterStyle(featCount);
                                    styleCache[featCount] = style;
                                }
                            }
                            return style;
                        };
                        mapLayer.setStyle(styleFuncWrapper);
                    } else {
                        mapLayer.setStyle(olStyleFunc.output);
                    }

                    // now force an update of the layer to apply new styling
                    source.set('timestamp', Ext.Date.now());
                    source.dispatchEvent('sldapplied');

                    if (!source.get('originalPropertyNames')) {
                        // is not a type of layer on which originalPropertyNames has not been defined
                        // refresh as per previous implementation
                        source.refresh();
                        return;
                    }

                    if (!source.get('originalPropertyNames').length) {
                        // originalPropertyNames is empty. This mean no PROPERTYNAME param was
                        // send meaning all fields are already available
                        return;
                    }

                    var currentPropertyNames = Ext.Array.merge(source.get('propertyNames'), source.get('originalPropertyNames'));
                    var stylePropertyNames = LayerFactory.getPropertyNamesInSLD(sldXmlDoc);
                    var hasStyleExtraPropertyNames = Ext.Array.some(stylePropertyNames, function (prop) {
                        return currentPropertyNames.indexOf(prop) === -1;
                    });

                    if (hasStyleExtraPropertyNames) {
                        var propertyNames = LayerFactory.buildRequiredPropertyNames(stylePropertyNames, mapLayer.get('toolTipConfig'));
                        var xhr = source.get('xhr');

                        source.set('propertyNames', propertyNames);

                        // abort an existing xhr for this source if there is one and it is in progress
                        // to prevent race conditions where the initial request for data would
                        // finish after the subsequent request with extra fields, rendering features
                        // without the required data, meaning styles would not apply in certain cases
                        if (xhr && xhr.readyState !== 4) {
                            // ensure the loading bar is hidden
                            source.dispatchEvent('vectorloadend');
                            xhr.abort();
                        }

                        source.refresh();
                    }
                });
            }, function () {
                // rejection
                Ext.log.warn('Could not parse SLD ' + style.sldUrl +
                    '! Default OL style will be applied.');
            });
    },

    /**
     * Loads and parses the given SLD (by URL) and applies it to the given
     * vector layer.
     *
     * @param  {ol.layer.Vector} mapLayer The layer to apply the style to
     * @param  {String} sldUrl   The URL to the SLD
     */
    loadSld: function (mapLayer) {

        var me = this;
        var styles = mapLayer.get('styles');
        if (Ext.isEmpty(styles)) {
            // no styles set on the layer
            return;
        }

        // if there is no activated style we display all styles in the SLD file
        // this will be the case where there is only a single style for a layer
        var activatedStyle = mapLayer.get('activatedStyle');

        if (!activatedStyle) {
            //<debug>
            Ext.log.warn('No activatedStyle set on layer with multiple styles: ' + mapLayer.get('layerKey'));
            //</debug>
            return;
        }

        var style = styles.find(function (style) {
            return style.name === activatedStyle;
        });

        var sldUrl = style.sldUrl;

        Ext.Ajax.request({
            url: sldUrl,
            method: 'GET',
            disableCaching: false,
            success: function (response) {
                var sldXmlDoc = response.responseXML;
                me.applySldToLayer(mapLayer, sldXmlDoc, style);
            },
            failure: function () {
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
        mapPanel.on('cmv-map-pointerrest', function (hoveredObjs, evt) {
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
     * Takes an array of currentPropertyNames (Inital defind propertyNames or propertyNames extracted from an SLD)
     * with tooltipsConfig object and creates an array of unique propertyNames used in both arguments
     *
     * @param  {string[]} currentPropertyNames Array of property names
     * @param  {Object} tooltipsConfig tooltipsConfig object
     */
    buildRequiredPropertyNames: function (currentPropertyNames, tooltipsConfig) {
        var props = Ext.Array.clean(currentPropertyNames);

        // add properties defined in tooltip config to the props array
        Ext.each(tooltipsConfig || [], function (config) {
            props.push(config.property);
        });

        // return the props array with duplicates removed, as a comma separated string
        return Ext.Array.unique(Ext.Array.clean(props));
    },

    /**
     * Extracts unique PropertyNames referenced in an XML document
     *
     * @param  {Document} xmlDoc Parsed SLD XML
     */
    getPropertyNamesInSLD: function (xmlDoc) {
        var nameSpacedPropertyNameNodes = Ext.DomQuery.select('ogc\\:PropertyName', xmlDoc);
        var propertyNameNodes = Ext.DomQuery.select('PropertyName', xmlDoc);
        var props = Ext.Array.merge(
            Ext.Array.pluck(nameSpacedPropertyNameNodes, 'textContent'),
            Ext.Array.pluck(propertyNameNodes, 'textContent')
        );
        return Ext.Array.clean(props);
    }

});
