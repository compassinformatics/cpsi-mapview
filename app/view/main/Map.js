/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_map',

    requires: [
        'GeoExt.component.Map',

        'BasiGX.view.button.ZoomToExtent'
    ],

    layout: 'fit',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }]
    }, {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            text: 'Docked to the bottom'
        }]
    }],

    items: [{
        xtype: 'gx_map',
        pointerRest: true,
        pointerRestInterval: 500,
        map: new ol.Map({
            // layers will be created from config in initComponent
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8, 53.5] ),
                zoom: 8
            })
        })
    }],

    /**
     * Enables a click handler on the map which fires an event
     * 'cmv-mapclick' with all clicked vector features and their corresponding
     * layers.
     * @config {Boolean}
     */
    enableMapClick: true,

    /**
     * Enables a 'pointerrest' handler on the map which fires an event
     * 'cmv-map-pointerrest' with all hovered vector features and their
     * corresponding layers.
     * @config {Boolean}
     */
    enableMapHover: true,

    /**
     * @event cmv-mapclick
     * Fires when the OL map is clicked.
     * @param {CpsiMapview.view.main.Map} this
     * @param {Object[]} clickInfo The clicked features and the corresponding layers, like `[{feature: aFeat, layer: aLayer}, ...]`
     * @param {ol.MapBrowserEvent)} evt The original 'singleclick' event of OpenLayers
     */

    inheritableStatics: {
        /**
         * Tries to detect the first occurance of this map panel.
         * @return {CpsiMapview.view.main.Map} The map panel, which is at least
         *     a GeoExt.component.Map and possibly an instance of this class.
         */
        guess: function() {
            return BasiGX.util.Map.getMapComponent(this.xtype);
        }
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // Load layer JSON configuration
        Ext.Ajax.request({
            url: 'resources/data/layers/default.json',
            success: function (response) {
                var layerJson = Ext.decode(response.responseText);

                Ext.each(layerJson.layers, function (layerConf) {
                    var layer = LayerFactory.createLayer(layerConf);
                    if (layer) {
                        me.olMap.addLayer(layer);
                    }
                });
            }
        });

        me.callParent(arguments);

        // make sub components accessible as members
        me.mapCmp = me.down('gx_map');
        me.olMap = me.mapCmp.map;

        if (me.enableMapClick) {
            me.olMap.on('singleclick', function(evt) {
                var clickedFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function(feature, layer) {
                        // collect all clicked features and their layers
                        clickedFeatures.push({feature: feature, layer: layer});
                    }
                );

                // fire event to forward click info to subscribers
                me.fireEvent('cmv-mapclick', clickedFeatures, evt);
            });
        }

        if (me.enableMapHover) {
            me.mapCmp.on('pointerrest', function(evt) {
                var hoveredFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function(feature, layer) {
                        // collect all clicked features and their layers
                        hoveredFeatures.push({feature: feature, layer: layer});
                    }
                );

                // fire event to forward hover info to subscribers
                me.fireEvent('cmv-map-pointerrest', hoveredFeatures, evt);
            });

            me.mapCmp.on('pointerrestout', function () {
                me.fireEvent('cmv-map-pointerrestout');
            });
        }

        Ext.GlobalEvents.fireEvent('cmv-mapready', me);
    }
});
