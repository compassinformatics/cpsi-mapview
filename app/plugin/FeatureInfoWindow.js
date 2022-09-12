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
        'BasiGX.view.grid.FeaturePropertyGrid',
        'BasiGX.util.Map'
    ],

    /**
     * A source containing a feature that highlights the click on the map.
     * @property {ol.source.Vector}
     */
    highlightSource: null,

    init: function () {
        var me = this;
        var cmp = me.getCmp();

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
        var me = this;

        var layers = [];
        var mapView = me.map.getView();

        var resolution = mapView.getResolution();
        var projection = mapView.getProjection();
        var format = new ol.format.GeoJSON();

        me.highlightClick(evt);

        me.map.forEachLayerAtPixel(evt.pixel, function (layer) {
            var params = layer.getSource().getParams();

            // Map layers combining multiple WMS layers e.g. roads,rivers
            // will cause errors in the back-end MapServer as the JSON properties
            // will be different for different layers
            // Split the layers and create temporary layers for the GetFeatureInfo requests

            var layerNames = params.LAYERS.split(',');
            if (layerNames.length > 0) {

                Ext.Array.each(layerNames, function (layerName) {

                    var newParams = Ext.clone(params);
                    newParams.LAYERS = layerName;

                    var wmsLayer = new ol.layer.Image({
                        name: layerName,
                        source: new ol.source.ImageWMS({
                            url: layer.getSource().getUrl(),
                            params: newParams
                        })
                    });
                    layers.push(wmsLayer);
                });
            } else {
                layers.push(layer);
            }
        }, {
            layerFilter: function (layer) {
                return layer.get('featureInfoWindow');
            }
        });

        var win = me.openFeatureInfoWindow();

        if (layers.length <= 1) {
            win.getLayout().setConfig({
                hideCollapseTool: true
            });
        } else {
            win.getLayout().setConfig({
                hideCollapseTool: false
            });
        }

        if (layers.length === 0) {
            win.add(Ext.create('Ext.panel.Panel', {
                title: 'No results found'
            }));
        } else {
            layers.forEach(function (layer) {
                var url = layer.getSource().getFeatureInfoUrl(evt.coordinate, resolution, projection, {
                    INFO_FORMAT: 'geojson'
                });

                Ext.Ajax.request({
                    url: url
                }).then(function (response) {
                    var features = format.readFeatures(response.responseText);
                    win.add(me.createFeaturePanels(layer, features));
                }).then(undefined, function (error) {
                    Ext.log.error(error);
                });
            });
        }
    },

    /**
     * This method highlights the clicked point on the map.
     * @param {ol.MapBrowserEvent} evt
     */
    highlightClick: function (evt) {

        var me = this;

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

        var feature = new ol.Feature(new ol.geom.Point(evt.coordinate));
        this.highlightSource.addFeature(feature);
    },

    /**
     * This method opens a window to display the results in.
     * @returns {CpsiMapview.view.window.MinimizableWindow}
     */
    openFeatureInfoWindow: function () {
        var me = this;

        // set the initial height of the window to 80% of the viewport height
        // a user is then free to resize as they wish
        var height = Ext.getBody().getViewSize().height * 0.8;

        if (this.window) {
            this.window.removeAll(true);
        } else {
            this.window = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
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
            });

            this.window.on('close', function () {
                me.highlightSource.clear();
            });
        }

        this.window.show();

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
    },
});
