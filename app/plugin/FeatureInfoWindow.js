Ext.define('CpsiMapview.plugin.FeatureInfoWindow', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_feature_info_window',
    pluginId: 'cmv_feature_info_window',

    requires: [
        'Ext.window.Window',
        'BasiGX.util.Map'
    ],

    init: function () {
        var me = this;

        var mapComp = BasiGX.util.Map.getMapComponent();
        var map = mapComp.getMap();

        map.on('singleclick', function (evt) {
            var layers = [];
            var resolution = map.getView().getResolution();
            var projection = map.getView().getProjection();
            map.forEachLayerAtPixel(evt.pixel, function (layer) {
                layers.push(layer);
            }, undefined, function (layer) {
                return layer.get('featureInfoWindow');
            });

            if (layers.length) {
                var window = me.showFeatureInfo(map, evt);

                layers.forEach(function (layer) {
                    var url = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {
                        INFO_FORMAT: 'geojson'
                    });

                    Ext.Ajax.request({
                        url: url
                    }).then(function (response) {
                        var featureCollection = JSON.parse(response.responseText);
                        window.add(me.createFeatureCollectionPanel(featureCollection));
                    });
                });
            } else {
                if (me.highlightSource) {
                    me.highlightSource.clear();
                }
                if (me.window) {
                    me.window.destroy();
                }
            }
        });
    },

    showFeatureInfo: function (map, evt) {
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
            this.window.destroy();
        }

        this.window = Ext.create('Ext.window.Window', {
            layout: {
                type: 'accordion',
                titleCollapse: false,
                animate: true
            },
            width: 300
        });
        this.window.show();

        this.window.on('close', function () {
            me.highlightSource.clear();
        });

        return this.window;
    },

    createFeatureCollectionPanel: function (featureCollection) {
        var me = this;

        return Ext.create('Ext.panel.Panel', {
            title: featureCollection.name,
            items: featureCollection.features.map(function (geojsonFeature) {
                return me.createFeatureGrid(geojsonFeature);
            })
        });
    },

    createFeatureGrid: function (geoJsonFeature) {
        var props = geoJsonFeature.properties;

        var data = Object.keys(props)
            .filter(function (key) {
                return key !== 'geometry';
            })
            .map(function (key) {
                return {
                    key: key,
                    value: props[key]
                };
            });

        var store = Ext.create('Ext.data.Store', {
            data: data
        });

        return Ext.create('Ext.grid.Panel', {
            store: store,
            columns: [
                {
                    dataIndex: 'key'
                },
                {
                    dataIndex: 'value'
                }
            ],
            scrollable: true,
            layout: 'fit'
        });
    }
});
