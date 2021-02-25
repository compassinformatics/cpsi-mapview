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

        var mapComp = me.getCmp();
        var map = mapComp.getMap();

        map.on('singleclick', function (evt) {
            if (map.get('defaultClickEnabled')) {
                me.requestFeatureInfos(evt);
            }
        });
    },

    /**
     * This method queries all configured layers for feature information. It calls the methods to highlight the click,
     * open a window and display the information
     * @param {ol.MapBrowserEvent} evt
     */
    requestFeatureInfos: function (evt) {
        var me = this;

        var mapComp = me.getCmp();
        var map = mapComp.getMap();

        var layers = [];
        var resolution = map.getView().getResolution();
        var projection = map.getView().getProjection();
        var format = new ol.format.GeoJSON();

        this.highlightClick(evt);

        map.forEachLayerAtPixel(evt.pixel, function (layer) {
            layers.push(layer);
        }, undefined, function (layer) {
            return layer.get('featureInfoWindow');
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
                var url = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
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
        var map = me.getCmp().getMap();

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
                map: map
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

        // fix the maxHeight of the window to 80% of the viewport height
        var maxHeight = Ext.getBody().getViewSize().height * 0.8;

        if (this.window) {
            this.window.removeAll(true);
        } else {
            this.window = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
                title: 'Feature Information',
                closeAction: 'hide', // reuse the window for all requests so a user can fix the position
                scollable: true,
                maxHeight: maxHeight,
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
    createFeaturePanels: function ( layer, features) {
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
