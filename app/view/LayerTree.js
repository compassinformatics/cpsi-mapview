/**
 * A Layertree which autoconnects to the map of the application.
 */
Ext.define('CpsiMapview.view.LayerTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'cmv_layertree',
    requires: [
        'BasiGX.util.Map',
        'GeoExt.data.store.LayersTree'
    ],

    // So that instanciation works without errors, might be changed during
    // instanciation of the LayerTree.
    store: {},
    rootVisible: false,
    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },

    /**
     * Constructor which either directly assigns a GeoExt.data.store.LayersTree
     * or sets up a listener which does this as soon as the application itself
     * fires the `mapready`-event.
     *
     * @param  {Object} cfg The configuration of the tree which we may change.
     */
    constructor: function(cfg) {
        var me = this;
        var mapComp = BasiGX.util.Map.getMapComponent();
        var map = mapComp && mapComp.getMap();
        if (map) {
            cfg.store = me.makeLayerStore(map);
        } else {
            CpsiMapview.getApplication().on('mapready', me.autoConnectToMap);
        }
        me.callParent([cfg]);
    },

    /**
     * Guesses the mapcomponent and assigns the appropriate layers store, if one
     * could be guessed. This is bound as listener to the mapready event of the
     * application.
     *
     * TODO this may change to use the passed map view from the mapready event.
     */
    autoConnectToMap: function() {
        var me = this;
        var mapComp = BasiGX.util.Map.getMapComponent();
        var map = mapComp && mapComp.getMap();
        if (map) {
            var store = me.makeLayerStore(map);
            me.setStore(store);
        }
    },

    /**
     * Given a `ol.Map` this method will return an instance of the GeoExt class
     * GeoExt.data.store.LayersTree, which will work on the topmost layergroup.
     *
     * @param  {ol.Map} map The map to create the store from.
     * @return {GeoExt.data.store.LayersTree} The created store.
     */
    makeLayerStore: function(map) {
        return Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: map.getLayerGroup()
        });
    }
});
