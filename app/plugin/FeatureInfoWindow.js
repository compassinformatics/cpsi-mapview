Ext.define('CpsiMapview.plugin.FeatureInfoWindow', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_feature_info_window',
    pluginId: 'cmv_feature_info_window',

    requires: [
        'Ext.Component',
        'CpsiMapview.view.window.MinimizableWindow',
        'BasiGX.view.grid.FeaturePropertyGrid',
        'BasiGX.util.Map'
    ],

    init: function () {
        var me = this;

        var mapComp = BasiGX.util.Map.getMapComponent();
        var map = mapComp.getMap();

        map.on('singleclick', function (evt) {
            if (map.get('defaultClickEnabled')) {
                me.requestFeatureInfos(mapComp, evt);
            }
        });
    },

    requestFeatureInfos: function (mapComp, evt) {
        var me = this;

        var map = mapComp.getMap();

        var layers = [];
        var resolution = map.getView().getResolution();
        var projection = map.getView().getProjection();

        var format = new ol.format.GeoJSON();

        map.forEachLayerAtPixel(evt.pixel, function (layer) {
            layers.push(layer);
        }, undefined, function (layer) {
            return layer.get('featureInfoWindow');
        });

        var win = me.openFeatureInfoWindow(map, evt);

        if (layers.length <= 1) {
            win.setLayout('fit');
        } else {
            win.setLayout({
                type: 'accordion',
                titleCollapse: false,
                animate: true
            });
        }

        if (layers.length === 0) {
            win.add(Ext.create('Ext.Component', {
                html: '<span>No results found</span>'
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
                    win.add(me.createFeaturePanels(mapComp, layer, features));
                }).then(undefined, function (error) {
                    Ext.log(error);
                    console.error(error);
                });
            });
        }
    },

    openFeatureInfoWindow: function (map, evt) {
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
                map: map
            });
        } else {
            this.highlightSource.clear();
        }

        var feature = new ol.Feature(new ol.geom.Point(evt.coordinate));
        this.highlightSource.addFeature(feature);

        if (this.window) {
            this.window.removeAll(true);
        } else {
            this.window = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
                title: 'Feature Information',
                width: 400,
                layout: {
                    type: 'accordion'
                }
            });

            this.window.on('close', function () {
                me.window = null;
                me.highlightSource.clear();
            });
        }

        this.window.show();

        return this.window;
    },

    createFeaturePanels: function (mapComp, layer, features) {
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
