/**
 * This is a plugin for the `GeoExt.component.Map` component. It provides a window that opens on a singleclick on the map.
 * All WMS that have the property `featureInfoWindow` set to true will be queried for feature info in format `geojson`.
 * The resulting informations will be shown in property grids.
 */
Ext.define('CpsiMapview.plugin.FeatureInfoWindow', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_feature_info_window',
    pluginId: 'cmv_feature_info_window',

    requires: [
        'Ext.panel.Panel',
        'CpsiMapview.view.window.MinimizableWindow',
        'CpsiMapview.util.WmsFilter',
        'BasiGX.view.grid.FeaturePropertyGrid',
        'BasiGX.util.Map'
    ],

    /**
     * A source containing a feature that highlights the click on the map.
     * @property {ol.source.Vector}
     */
    highlightSource: null,

    /**
     * Feature Window height as a percentage of the viewport
     * @param {number} percentage as decimal
     */
    percentageHeight: 0.8,

    /**
     * @method
     *
     * Template function called before doing the GetFeatureInfo request
     * Return false if you don't want to make the GetFeatureInfo request.
     *
     * @param {Object} layer
     */
    onBeforeRequest: Ext.emptyFn,

    init: function () {
        const me = this;
        const cmp = me.getCmp();

        me.map = cmp.map ? cmp.map : BasiGX.util.Map.getMapComponent().map;

        cmp.on('cmv-mapclick', function (clickedFeatures, evt) {
            if (me.map.get('defaultClickEnabled')) {
                me.requestFeatureInfos(clickedFeatures, evt);
            }
        });
    },

    /**
     * This method queries all configured layers for feature information. It calls the methods to highlight the click,
     * open a window and display the information
     * @param {ol.MapBrowserEvent} evt
     */
    requestFeatureInfos: function (clickedFeatures, evt) {
        const me = this;

        const mapView = me.map.getView();

        const resolution = mapView.getResolution();
        const projection = mapView.getProjection();
        const format = new ol.format.GeoJSON();

        me.highlightClick(evt);

        const pixel = evt.pixel;
        const layers = [];

        const infoLayers = BasiGX.util.Layer.getLayersBy(
            'featureInfoWindow',
            true
        );

        infoLayers.forEach((layer) => {
            if (layer.getVisible()) {
                const data = layer.getData(pixel);
                if (data) {
                    // Ensure there's data at the pixel
                    const params = layer.getSource().getParams();

                    // Map layers combining multiple WMS layers e.g. roads,rivers
                    // will cause errors in the back-end MapServer as the JSON properties
                    // will be different for different layers
                    // Split the layers and create temporary layers for the GetFeatureInfo requests

                    // We only check for unique layer names - if labels are used then duplicate layer names
                    // are used in requests, but we only want one set of FeatureInfo results
                    const layerNames = Ext.Array.unique(
                        params.LAYERS.split(',')
                    );

                    if (layerNames.length > 1) {
                        // If there are multiple layers then attempt to also split out styles and filters
                        let idx = 0;
                        let styleNames = [];

                        if (params.STYLES) {
                            styleNames = params.STYLES.split(',');
                        }

                        const wmsFilterUtil = CpsiMapview.util.WmsFilter;
                        const filters = wmsFilterUtil.getWmsFilters(params);

                        Ext.Array.each(layerNames, function (layerName) {
                            const newParams = Ext.clone(params);
                            newParams.LAYERS = layerName;
                            newParams.STYLES = styleNames[idx]
                                ? styleNames[idx]
                                : '';
                            newParams.FILTER = filters[idx] ? filters[idx] : '';

                            const wmsLayer = new ol.layer.Image({
                                name: layerName,
                                source: new ol.source.ImageWMS({
                                    url: layer.getSource().getUrl(),
                                    params: newParams
                                })
                            });
                            layers.push(wmsLayer);
                            idx += 1;
                        });
                    } else {
                        layers.push(layer);
                    }
                }
            }
        });

        const win = me.openFeatureInfoWindow();

        if (!layers.length) {
            // If no layers are enabled close the window so the close event
            // is fired and the highlight is removed from the map
            win.close();
            // fire event so client can show custom ui, pass through the instance so
            // that the window might be re-opened and custom content inserted
            Ext.GlobalEvents.fireEvent(
                'cmv-featureinfowindow-no-layers-enabled',
                me
            );
            return;
        }

        if (layers.length <= 1) {
            win.getLayout().setConfig({
                hideCollapseTool: true
            });
        } else {
            win.getLayout().setConfig({
                hideCollapseTool: false
            });
        }

        const requests = [];
        let hasContent = false;
        layers.forEach(function (layer) {
            const infoFormat = 'geojson';
            const url = layer
                .getSource()
                .getFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    INFO_FORMAT: infoFormat
                });

            // call the template function onBeforeRequest to
            // see if this layer should be queried
            if (Ext.isFunction(me.onBeforeRequest)) {
                const ret = me.onBeforeRequest(layer);
                if (ret === false) {
                    // skip to next layer
                    return;
                }
            }

            const promise = Ext.Ajax.request({
                url: url
            })
                .then(function (response) {
                    const responseType = response.responseType
                        ? response.responseType
                        : response.getResponseHeader
                          ? response.getResponseHeader('content-type')
                          : null;

                    // check if the response is geojson as expected, if not then the server
                    // may have returned an error as XML
                    if (responseType.toLowerCase().indexOf(infoFormat) !== -1) {
                        const features = format.readFeatures(
                            response.responseText
                        );
                        if (features.length) {
                            // at least one layer has features found
                            hasContent = true;
                            // ensure window is show, it may not be if
                            // showFeatureInfoWindowOnlyIfContent is true
                            // calling show multiple times is no issue
                            win.show();
                            win.add(me.createFeaturePanels(layer, features));
                        }
                    } else {
                        //<debug>
                        Ext.log.warn(response.responseText);
                        //</debug>
                    }
                })
                .then(undefined, function (error) {
                    Ext.log.error(error);
                });

            requests.push(promise);
        });

        // When all requests have been performed, and no features are found
        // for any layer, close the window so that the highlight is removed from the map
        // Also handles the case where the window was previously open because features were found
        // But a new click has found no features, so the window is auto closed
        // This second case behaviour could be changed by checking for win.getHidden()
        Ext.Promise.all(requests).then(function () {
            if (!hasContent) {
                win.close();
                // fire event so client can show custom ui, pass through the instance so
                // that the window might be re-opened and custom content inserted
                Ext.GlobalEvents.fireEvent(
                    'cmv-featureinfowindow-no-features-found',
                    me
                );
            }
        });
    },

    /**
     * This method highlights the clicked point on the map.
     * @param {ol.MapBrowserEvent} evt
     */
    highlightClick: function (evt) {
        const me = this;

        if (!this.highlightSource) {
            this.highlightSource = new ol.source.Vector();
            new ol.layer.Vector({
                source: this.highlightSource,
                style: new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 2
                        })
                    })
                }),
                map: me.map
            });
        } else {
            this.highlightSource.clear();
        }

        const feature = new ol.Feature(new ol.geom.Point(evt.coordinate));
        this.highlightSource.addFeature(feature);
    },

    /**
     * This method opens a window to display the results in.
     * @returns {CpsiMapview.view.window.MinimizableWindow}
     */
    openFeatureInfoWindow: function () {
        const me = this;

        // set the initial height of the window to 80% of the viewport height
        // a user is then free to resize as they wish
        const height = Ext.getBody().getViewSize().height * me.percentageHeight;

        if (this.window) {
            this.window.removeAll(true);
        } else {
            this.window = Ext.create(
                'CpsiMapview.view.window.MinimizableWindow',
                {
                    title: 'Feature Information',
                    closeAction: 'hide', // reuse the window for all requests so a user can fix the position
                    scollable: true,
                    height: height,
                    width: 400,
                    layout: {
                        type: 'accordion',
                        titleCollapse: false,
                        animate: true
                    }
                }
            );

            this.window.on('close', function () {
                me.highlightSource.clear();
            });
        }

        //this.window.show();

        return this.window;
    },

    /**
     * This method returns a property grid for every feature given.
     * @param {ol.layer.Layer} layer
     * @param {ol.Feature[]} features
     * @returns {BasiGX.view.grid.FeaturePropertyGrid[]}
     */
    createFeaturePanels: function (layer, features) {
        return features.map(function (feature) {
            return Ext.create('BasiGX.view.grid.FeaturePropertyGrid', {
                title: layer.get('name'),
                olFeature: feature,
                propertyWhiteList: Object.keys(feature.getProperties()),
                scrollable: true,
                nameColumnWidth: 150,
                viewConfig: {
                    enableTextSelection: true,
                    // the following is needed to make `enableTextSelection` work. See https://stackoverflow.com/questions/42760943
                    getRowClass: function () {
                        return this.enableTextSelection ? 'x-selectable' : '';
                    }
                }
            });
        });
    }
});
