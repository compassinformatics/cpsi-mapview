/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_map',

    requires: [
        'GeoExt.component.Map',

        'CpsiMapview.model.button.MeasureButton',
        'CpsiMapview.controller.button.MeasureButtonController',

        'CpsiMapview.view.toolbar.MapFooter',

        'BasiGX.view.button.Measure',
        'BasiGX.view.button.ZoomToExtent',
        'BasiGX.util.Projection'
    ],

    layout: 'fit',

    controller: 'cmv_map',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'line',
            toggleGroup: 'measure-tools',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            glyph: 'xf068@FontAwesome',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'polygon',
            toggleGroup: 'measure-tools',
            glyph: 'xf044@FontAwesome',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }]
    }, {
        xtype: 'cmv_mapfooter',
        dock: 'bottom'
    }],

    items: [{
        xtype: 'gx_map',
        map: new ol.Map({
            // layers will be created from config in initComponent
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8, 53.5] ),
                zoom: 8
            })
        }),
        listeners: {
            afterrender: 'afterMapRender'
        }
    }],

    /**
     * Enables a click handler on the map which fires an event
     * 'cmv-mapclick' with all clicked vector features and their corresponding
     * layers.
     * @config {Boolean}
     */
    enableMapClick: true,

    /**
     * Flag that to add a scale bar to the map or not
     * @config {Boolean}
     */
    addScaleBarToMap: true,

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

        Ext.GlobalEvents.fireEvent('cmv-mapready', me);
    }
});
