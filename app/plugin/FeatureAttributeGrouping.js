Ext.define('CpsiMapview.plugin.FeatureAttributeGrouping', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_feature_attribute_grouping',
    pluginId: 'cmv_feature_attribute_grouping',

    initGrouping: function (mapCmp, olMap) {
        var me = this;

        var groupingLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            map: olMap
        });

        function clearSource() {
            groupingLayer.getSource().clear();
        }

        mapCmp.on('pointerrest', function (evt) {
            olMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                var grouping = layer.get('grouping');

                clearSource();
                groupingLayer.setStyle(me.getStyle(grouping.color));

                var features = layer.getSource().getFeatures()
                    .filter(function (other) {
                        return other.get(grouping.attribute) === feature.get(grouping.attribute);
                    });

                groupingLayer.getSource().addFeatures(features);
            }, {
                layerFilter: function (layer) {
                    return layer.get('grouping');
                }
            });
        });

        mapCmp.on('pointerrestout', clearSource);
        olMap.on('pointermove', clearSource);
    },

    getStyle: function (color) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                    color: color,
                    width: 2
                })
            })
        });
    }
});
