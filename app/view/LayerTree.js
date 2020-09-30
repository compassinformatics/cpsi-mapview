/**
 * A Layertree which autoconnects to the map of the application.
 */
Ext.define('CpsiMapview.view.LayerTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'cmv_layertree',
    requires: [
        'BasiGX.util.Map',
        'BasiGX.util.Layer',
        'GeoExt.data.store.LayersTree',
        'CpsiMapview.plugin.BasicTreeColumnLegends',
        'CpsiMapview.plugin.TreeColumnContextMenu',
        'CpsiMapview.view.menuitem.LayerRefresh',
        'CpsiMapview.view.menuitem.LayerLabels',
        'CpsiMapview.view.menuitem.LayerOpacity',
        'CpsiMapview.view.menuitem.LayerGrid',
        'CpsiMapview.plugin.TreeColumnStyleSwitcher'
    ],

    statics: {
        legendImgLookup: {}
    },

    // So that instantiation works without errors, might be changed during
    // instantiation of the LayerTree.
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
                        'cmv_menuitem_layerlabels',
                        'cmv_menuitem_layeropacity',
                        'cmv_menuitem_layergrid'
                    ]
                }, {
                    ptype: 'cmv_tree_inresolutionrange'
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
     * Constructor for the custom layer tree component
     *
     * @param  {Object} cfg The configuration of the tree which we may change.
     */
    constructor: function (cfg) {
        var me = this;
        me.callParent([cfg]);
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var mapPanel = CpsiMapview.view.main.Map.guess();

        mapPanel.on('cmv-init-layersadded', function () {
            me.initLayersAdded = true;
            me.autoConnectToMap(); // connect after all the layers have been loaded to the map
        });

        me.callParent();
    },

    /**
     * Guesses the mapcomponent and assigns the appropriate layers store, if one
     * could be guessed.
     */
    autoConnectToMap: function () {

        var me = this;

        var mapComp = BasiGX.util.Map.getMapComponent();
        me.map = mapComp && mapComp.getMap();

        if (me.map) {
            var store = me.makeLayerStore();
            me.setStore(store);
        }
    },

    /**
     * This method will return an instance of the GeoExt class
     * `GeoExt.data.store.LayersTree` based on the connected OL #map. The layers
     * of the `ol.Map` are restructured and divided into groups based on the
     * JSON tree structure loaded in #loadTreeStructure. This assures that
     * the layers will appear in different folders in this TreePanel
     * (as defined in the tree structure JSON).
     *
     * @return {GeoExt.data.store.LayersTree} The created store.
     */
    makeLayerStore: function () {
        var me = this;

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

        var treeJsonPromise = me.loadTreeStructure();
        treeJsonPromise.then(function (treeJson) {
            // get the root layer group holding the grouped map layers
            var rootLayerGroup = me.getGroupedLayers(treeJson);

            me.map.setLayerGroup(rootLayerGroup);
            // create a new LayerStore from the grouped layers
            var groupedLayerTreeStore = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup: me.map.getLayerGroup(),
                filters: layerFilter
            });
            me.setStore(groupedLayerTreeStore);

            me.getRootNode().cascade(function (node) {
                var data = node.getData();
                if (data.leaf && data.get('isBaseLayer')) {
                    node.addCls('cpsi-tree-node-baselayer');
                }
            });

            // expand all folders in this tree
            me.expandAll();

            // inform subscribers that LayerTree is ready
            me.fireEvent('cmv-init-layertree', me);
        });

        // fallback in case loading the JSON tree structure failed:
        // create a flat store holding all map layers at one hierarchy
        treeJsonPromise.catch(function () {
            Ext.Logger.warn('Loading of JSON structure for LayerTree failed' +
                '- creating flat layer hierarchy as fallback');

            var layerTreeStore = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup: me.map.getLayerGroup(),
                filters: layerFilter
            });

            me.setStore(layerTreeStore);

            // inform subscribers that LayerTree is ready
            me.fireEvent('cmv-init-layertree', me);
        });
    },

    /**
     * Loads the JSON tree structure from 'resources/data/layers/tree.json'.
     *
     * @return {Ext.Promise} Promise resolving once the JSON is loaded
     */
    loadTreeStructure: function () {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: 'resources/data/layers/tree.json',
                method: 'GET',
                success: function (response) {
                    var respJson = Ext.decode(response.responseText);
                    resolve(respJson);
                },
                failure: function (response) {
                    reject(response.status);
                }
            });
        });
    },

    /**
     * Re-groups the layers of the #map, so they are put into a folder hierarchy
     * based on the given tree structure loaded in #loadTreeStructure.
     * For each folder an OL layer group is created and gets aggregated in a
     * root layer group.
     *
     * @param  {Object} treeJson LayerTree structure
     * @return {ol.layer.Group}  Root layer group
     */
    getGroupedLayers: function (treeJson) {
        var me = this;

        // wrapping all under the 'root' node aggregating all together
        var rootLayerGroup = new ol.layer.Group({
            name: 'root',
            layers: []
        });
        // recursively create the OL layer group by the given tree structure
        me.createOlLayerGroups(treeJson.children, rootLayerGroup);

        return rootLayerGroup;
    },

    /**
     * Creates recursively the OL layer groups for the given tree structure and
     * puts them all together in the given parent group so they get folders in the LayerTree.
     * Layers are directly put to the given parent group so they appear as "leafs" in the LayerTree.
     *
     * @param  {Object} treeNodesJson Child section of the LayerTree structure
     * @param  {ol.layer.Group} parentGroup The parent group to put children (another groups / layers) into
     */
    createOlLayerGroups: function (treeNodeChilds, parentGroup) {
        var me = this;
        // go over all passed in tree childs nodes
        Ext.each(treeNodeChilds, function (child) {
            // layer groups --> folders in tree
            if (child.isLeaf !== true) {
                // create empty layer group for this level
                var layerGroup = new ol.layer.Group({
                    name: child.title,
                    layers: [],
                });

                var parentLayers = parentGroup.getLayers();
                parentLayers.insertAt(0, layerGroup);

                // recursion
                me.createOlLayerGroups(child.children, layerGroup);
            } else {
                // layers --> leafs in tree
                var mapLyr = BasiGX.util.Layer.getLayerBy('layerKey', child.id);
                if (mapLyr) {
                    parentGroup.getLayers().insertAt(0, mapLyr);
                } else {
                    Ext.Logger.warn('Layer with layerKey ' + child.id + ' not found in map layers');
                }
            }
        });
    },

    /**
     * Updates the layer node UI for the given layer.
     *
     * @param  {ol.layer.Base} layer The layer to update in the tree
     */
    updateLayerNodeUi: function (layer) {
        var me = this;
        var treeStore = me.getStore();

        treeStore.each(function (node) {
            if (node.getOlLayer().get('name') === layer.get('name')) {
                node.triggerUIUpdate();
            }
        });
    }
});
