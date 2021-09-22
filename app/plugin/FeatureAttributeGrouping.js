/**
 * A plugin that highlights features in a {ol.layer.Vector} which share
 * a property
 *
 * @class CpsiMapview.plugin.FeatureAttributeGrouping
 */
Ext.define('CpsiMapview.plugin.FeatureAttributeGrouping', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_feature_attribute_grouping',
    pluginId: 'cmv_feature_attribute_grouping',

    /**
     * can have the values 'move' or 'click'
     */
    startGroupingEvent: 'move',

    /**
     * can have the values 'move', 'click' or 'context'
     * @property {string}
     */
    endGroupingEvent: 'move',

    initGrouping: function (mapCmp, olMap) {
        var me = this;

        this.mapCmp = mapCmp;
        this.olMap = olMap;

        this.layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            map: olMap
        });

        var group = function (evt) {
            me.startGrouping(evt);
        };
        var ungroup = function () {
            me.endGrouping();
        };

        if (this.startGroupingEvent === 'move') {
            mapCmp.on('pointerrest', group);
        } else if (this.startGroupingEvent === 'click') {
            olMap.on('singleclick', group);
        }

        if (this.endGroupingEvent === 'move') {
            mapCmp.on('pointerrestout', ungroup);
            olMap.on('pointermove', ungroup);
        } else if (this.endGroupingEvent === 'click') {
            olMap.on('singleclick', ungroup);
        } else if (this.endGroupingEvent === 'context') {
            olMap.getViewport().addEventListener('contextmenu', function (e) {
                me.showContext(e);
            });
        }
    },

    startGrouping: function (evt) {
        var me = this;
        var map = this.olMap;

        // do not activate grouping if another tool is also active
        if (map.get('defaultClickEnabled') === false) {
            return;
        }

        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            me.endGrouping();

            var grouping = layer.get('grouping');

            me.layer.setStyle(me.getStyle(grouping));

            var features = layer.getSource().getFeatures()
                .filter(function (other) {
                    return other.get(grouping.attribute) === feature.get(grouping.attribute);
                });

            me.layer.getSource().addFeatures(features);
            me.groupingActive = true;
        }, {
            layerFilter: function (layer) {
                return layer.get('grouping');
            }
        });
    },

    endGrouping: function () {
        this.layer.getSource().clear();
        this.groupingActive = false;
    },

    getStyle: function (grouping) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                    color: grouping.strokeColor,
                    width: grouping.strokeWidth
                })
            }),
            stroke: new ol.style.Stroke({
                color: grouping.strokeColor,
                width: grouping.strokeWidth
            })
        });
    },

    showContext: function (evt) {
        var me = this;

        if (this.groupingActive) {
            evt.preventDefault();

            var menu = Ext.create('Ext.menu.Menu', {
                width: 160,
                plain: true,
                renderTo: Ext.getBody(),
                items: [{
                    text: 'Clear attribute grouping',
                    handler: function () {
                        me.endGrouping();
                    }
                }]
            });
            menu.showAt(evt.pageX, evt.pageY);
        }
    }
});
