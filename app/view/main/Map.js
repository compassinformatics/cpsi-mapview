/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainlist',

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
            zoom: 2,
            center: [0, 0],
            extent: [-1800244, 6503873, 138198, 7485936]
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
        map: new ol.Map({
            // layers will be created from config in initComponent
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8.751278, 40.611368] ),
                zoom: 12
            })
        })
    }],

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // Load layer JSON configuration
        Ext.Ajax.request({
            url: 'data/layers/default.json',
            success: function (response) {
                var layerJson = Ext.decode(response.responseText);

                Ext.each(layerJson.layers, function (layerConf) {
                    var layer = LayerFactory.createLayer(layerConf);
                    if (layer) {
                        me.olMap.addLayer(layer);
                        // me.olMap.getLayers().insertAt(0, layer);
                    }
                });
            }
        });

        me.callParent(arguments);

        // make sub components accessible as members
        me.mapCmp = me.down('gx_map');
        me.olMap = me.mapCmp.map;

        CpsiMapview.getApplication().fireEvent('mapready', me);
    }
});
