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
        'CpsiMapview.view.menuitem.LayerHelp',
        'CpsiMapview.view.menuitem.LayerStyleSwitcher',
        'CpsiMapview.view.menuitem.LayerMetadata',
        'CpsiMapview.view.menuitem.LayerFilterReset',
        'CpsiMapview.plugin.TreeColumnStyleSwitcher',
        'CpsiMapview.controller.LayerTreeController',
        'CpsiMapview.view.window.MinimizableWindow',
        'CpsiMapview.view.addWms.AddWmsForm',
        'CpsiMapview.view.addArcGISRest.AddArcGISRestForm'
    ],

    controller: 'cmv_layertree',

    statics: {
        legendImgLookup: {}
    },

    listeners: {
        'cmv-init-layertree': 'filterLayersByRole',
        'afteritemexpand': 'updateExpandedItemChildNodesUI',
    },

    // So that instantiation works without errors, might be changed during
    // instantiation of the LayerTree.
    store: {},
    rootVisible: false,
    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },
    config: {
        /**
        * The window configuration used for the Add WMS button
        * Any xtypes used should be added to the requires property
        */
        addWmsWindowConfig: {
            xtype: 'cmv_minimizable_window',
            title: 'Add External Map Layer',
            closeAction: 'hide',
            items: [{
                xtype: 'cmv_add_wms_form'
            }]
        },

        /**
         * The window configuration used for the Add ArcGISRest button
         * Any xtypes used should be added to the requires property
         */
        addArcGISRestWindowConfig: {
            xtype: 'cmv_minimizable_window',
            title: 'Add ArcGIS REST Map Layer',
            layout: 'anchor',
            closeAction: 'hide',
            items: [{
                xtype: 'cmv_add_arcgisrest_form'
            }]
        },

        /**
         * Steers if the style switcher radio groups are directly rendered under
         * the corresponding layer tree node (`true`) or if they are provided in
         * the context menu (`false`).
         * @cfg
         */
        styleSwitcherBelowNode: false
    },
    hideHeaders: true,
    lines: false,
    flex: 1,
    header: {
        dock: 'bottom'
    },
    tools: [{
        xtype: 'button',
        text: 'Add External Map Layer',
        enableToggle: true,
        listeners: {
            toggle: 'onAddWmsToggle'
        }
    }, {
        xtype: 'button',
        text: 'Add ArcGIS REST Layer',
        enableToggle: true,
        listeners: {
            toggle: 'onAddArcGISRestToggle'
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
                    ptype: 'cmv_tree_column_context_menu',
                    menuItems: [
                        'cmv_menuitem_layerrefresh',
                        'cmv_menuitem_layerlabels',
                        'cmv_menuitem_layeropacity',
                        'cmv_menuitem_layergrid',
                        'cmv_menuitem_layermetadata',
                        'cmv_menuitem_layerfilterreset',
                        'cmv_menuitem_layerhelp'
                    ]
                }, {
                    ptype: 'cmv_tree_inresolutionrange'
                }]
            }
        ]
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // decide where to render style switcher radio groups
        if (me.styleSwitcherBelowNode) {
            // add plugin to render style switcher permanently below tree nodes
            me.columns.items[0].plugins.push({ ptype: 'cmv_tree_column_style_switcher' });
        } else {
            // add context menu item showing the style switcher
            Ext.each(me.columns.items[0].plugins, function (plugin) {
                if (plugin.ptype === 'cmv_tree_column_context_menu') {
                    plugin.menuItems.push('cmv_menuitem_layer_styleswitcher');
                }
            });
        }

        me.callParent(arguments);
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
     * Refreshes the rendering of the layer tree node text for the given layer.
     *
     * @param {ol.layer.Base} layer The layer to update the node text
     */
    refreshLayerNodeText: function (layer) {
        var node = this.getNodeForLayer(layer);
        node.set('text', node.get('text'));
    },

    /**
     * Gets the layer node UI for the given layer. Any group layers are ignored
     * to avoid cases where a child node has the same name as the group layer name
     *
     * @param  {ol.layer.Base} layer The layer to update in the tree
     */
    getNodeForLayer: function (layer) {
        var me = this;
        var treeStore = me.getView().getStore();
        var foundNode = undefined;

        treeStore.each(function (node) {
            if (node.getOlLayer() && node.getOlLayer().get('layerKey') === layer.get('layerKey')) {
                foundNode = node;
                return false;
            }
        });

        return foundNode;
    }
});
