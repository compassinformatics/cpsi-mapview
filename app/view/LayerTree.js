/**
 * A Layertree which autoconnects to the map of the application.
 */
Ext.define('CpsiMapview.view.LayerTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'cmv_layertree',
    requires: [
        'GeoExt.data.store.LayersTree',
        'CpsiMapview.plugin.BasicTreeColumnLegends',
        'CpsiMapview.plugin.TreeColumnContextMenu',
        'CpsiMapview.view.menuitem.LayerRefresh',
        'CpsiMapview.view.menuitem.LayerLabels',
        'CpsiMapview.view.menuitem.LayerOpacity',
        'CpsiMapview.view.menuitem.LayerGrid',
        'CpsiMapview.plugin.TreeColumnStyleSwitcher',
        'CpsiMapview.controller.LayerTreeController'
    ],

    controller: 'cmv_layertree',

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
    header: {
        dock: 'bottom'
    },
    tools: [{
        xtype: 'button',
        text: 'Add external WMS',
        listeners: {
            click: 'onAddWmsClick'
        }
    }],
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
     * Updates the layer node UI for the given layer.
     *
     * @param  {ol.layer.Base} layer The layer to update in the tree
     */
    updateLayerNodeUi: function (layer) {
        var node = this.getNodeForLayer(layer);
        node.triggerUIUpdate();
    },

    /**
     * Gets the layer node UI for the given layer.
     *
     * @param  {ol.layer.Base} layer The layer to update in the tree
     */
    getNodeForLayer: function (layer) {
        var me = this;
        var treeStore = me.getView().getStore();

        var foundNode = undefined;

        treeStore.each(function (node) {
            if (node.getOlLayer() && node.getOlLayer().get('name') === layer.get('name')) {
                foundNode = node;
                return false;
            }
        });

        return foundNode;
    }
});
