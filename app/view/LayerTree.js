/**
 * A Layertree which autoconnects to the map of the application.
 */
Ext.define('CpsiMapview.view.LayerTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'cmv_layertree',
    requires: [
        'BasiGX.util.Map',
        'GeoExt.data.store.LayersTree',
        'CpsiMapview.plugin.BasicTreeColumnLegends',
        'CpsiMapview.plugin.TreeColumnContextMenu',
        'CpsiMapview.view.menuitem.LayerRefresh',
        'CpsiMapview.view.menuitem.LayerLabels',
        'CpsiMapview.plugin.TreeColumnStyleSwitcher'
    ],

    viewModel: {
        data: {
            baseLayerGroupText: 'Base Layers',
            overlayGroupText: 'Layers',
        }
    },

    // So that instanciation works without errors, might be changed during
    // instanciation of the LayerTree.
    store: {},
    rootVisible: false,
    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },
    hideHeaders: true,
    lines: false,
    flex: 1,
    columns: {
        header: false,
        items: [
            {
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                plugins: [{
                    ptype: 'cmv_basic_tree_column_legend'
                }, {
                    ptype: 'cmv_tree_column_style_switcher'
                }, {
                    ptype: 'cmv_tree_column_context_menu',
                    menuItems: [
                        'cmv_menuitem_layerrefresh',
                        'cmv_menuitem_layerlabels'
                    ]
                }]
            }
        ]
    },

    /**
     * Mode in order to steer how the layers in tree will be structured.
     * At the moment 'BASELAYER_OVERLAY' will divide the layers in 2 folders
     * 'Base Layers' and 'Overlays' (depending on their property 'isBaseLayer').
     * All other settings will result in a flat layer list.
     *
     * @cfg {String}
     */
    structureMode: null,

    /**
     * Shows if the event 'cmv-init-layersadded' has been fired or not.
     *
     * @property {Boolean}
     * @private
     */
    initLayersAdded: false,

    /**
     * Constructor which either directly assigns a GeoExt.data.store.LayersTree
     * or sets up a listener which does this as soon as the application itself
     * fires the `mapready`-event.
     *
     * @param  {Object} cfg The configuration of the tree which we may change.
     */
    constructor: function(cfg) {
        var me = this;

        me.callParent([cfg]);

        var mapComp = BasiGX.util.Map.getMapComponent();
        var map = mapComp && mapComp.getMap();
        if (map) {
            me.setStore(me.makeLayerStore(map));
        } else {
            Ext.GlobalEvents.on('cmv-mapready', me.autoConnectToMap);
        }
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var mapPanel = CpsiMapview.view.main.Map.guess();

        mapPanel.on('cmv-init-layersadded', function () {
            me.initLayersAdded = true;
        });

        me.callParent();
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
     * In case this store is configured with `this.structureMode ===
     * 'BASELAYER_OVERLAY'` the layers of the `ol.Map` are restructured and
     * divided into two groups ('Base Layer' and 'Overlays'). This assures that
     * the layers will appear in two folders in a connected TreePanel.
     *
     * @param  {ol.Map} map The map to create the store from.
     * @return {GeoExt.data.store.LayersTree} The created store.
     */
    makeLayerStore: function(map) {
        var me = this;
        var mapPanel = CpsiMapview.view.main.Map.guess();
        var store;

        // filter function for LayerTreeStore to hide unwanted layers in tree
        var layerFilter = function (layerRec) {
            var layer = layerRec.getOlLayer();
            if (layer) {
                // neither displayInLayerSwitcher=false (our flag) nor
                // bp_displayInLayerSwitcher=false (flag of BasiGX)
                return layer.get('displayInLayerSwitcher') !== false &&
                    layer.get('bp_displayInLayerSwitcher') !== false;
            }
        };

        if (me.structureMode === 'BASELAYER_OVERLAY') {
            // re-groups the map layers by divding them between base layers and
            // overlays. Then recreates the LayerStore and applies it to this
            // tree.
            var regroupLayerStore = function () {
                // create group layers
                var finalLayerGroup = me.getGroupedLayers(map);
                map.setLayerGroup(finalLayerGroup);
                // create a new LayerStore from the grouped layers
                var groupedStore = Ext.create('GeoExt.data.store.LayersTree', {
                    layerGroup: map.getLayerGroup(),
                    filters: layerFilter
                });
                me.setStore(groupedStore);

                // expand all folders in this tree
                me.expandAll();
            };

            // check if all layers have been loaded already
            if (!me.initLayersAdded) {
                mapPanel.on('cmv-init-layersadded', function () {
                    regroupLayerStore();
                });
            } else {
                regroupLayerStore();
            }
        } else {
            store = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup: map.getLayerGroup(),
                filters: layerFilter
            });
        }

        return store;
    },

    /**
     * Re-groups the layers of the given map, so they are divided between base
     * layers and overlays.
     * For each type an OL layer group is created and aggregated in a
     * root layer group.
     *
     * @param  {ol.Map} allLayers The map to get the grouped layers for
     * @return {ol.layer.Group}   Root layer group holding groups for base layers and overlays
     */
    getGroupedLayers: function (map) {
        var me = this;
        var allLayers = map.getLayerGroup().getLayers().getArray();
        var baseLayers = [];
        var overlays = [];

        // iterate over all layers and divide between base layers and overlays
        Ext.each(allLayers, function (layer) {
            if (layer.get('isBaseLayer') === true) {
                baseLayers.push(layer);
            } else {
                overlays.push(layer);
            }
        });

        var baseLayerGroup = new ol.layer.Group({
            name: me.getViewModel().get('baseLayerGroupText'),
            layers: baseLayers,
            expanded: true
        });
        var overlayGroup = new ol.layer.Group({
            name: me.getViewModel().get('overlayGroupText'),
            layers: overlays
        });
        var rootLayerGroup = new ol.layer.Group({
            layers: [baseLayerGroup, overlayGroup],
            visible: true
        });

        return rootLayerGroup;
    }
});
