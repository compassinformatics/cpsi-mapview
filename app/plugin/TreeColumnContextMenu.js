/**
 * Plugin in order to show a ContextMenu for a layer in the LayerTree.
 * ContextMenu is opened on right-clicking a layer in the tree and shows all
 * configured menu items / tools.
 *
 * @class CpsiMapview.plugin.TreeColumnContextMenu
 */
Ext.define('CpsiMapview.plugin.TreeColumnContextMenu', {
    extend: 'GeoExt.plugin.layertreenode.ContextMenu',
    alias: 'plugin.cmv_tree_column_context_menu',
    pluginId: 'cmv_tree_column_context_menu',

    /**
     * The 'xtypes' of the items, which will be shown in this context menu.
     *
     * @cfg {String[]}
     */
    menuItems: [],

    /**
     * @private
     */
    init: function () {
        this.callParent(arguments);
    },

    /**
     * Implements the abstract #createContextUi of the father class in order to
     * create a menu with all items accordinng to the corresponding layer
     * properties, e.g. 'refreshLayerOption' to show an item to refresh / redraw
     * the layer.
     *
     * @param  {GeoExt.data.model.LayerTreeNode} layerTreeNode
     *     The LayerTreeNode of the right-clicked layer
     * @return {Ext.menu.Menu} The menu holding all configured items / tools
     */
    createContextUi: function (layerTreeNode) {
        const me = this;
        const menuItems = [];

        // create all menu items / tools
        Ext.each(me.menuItems, function (menuItem) {
            menuItems.push({
                xtype: menuItem,
                layer: layerTreeNode.getOlLayer()
            });
        });

        // create the menu and hide if empty
        const emptyMenu = menuItems.length === 0;
        const menu = Ext.create('Ext.menu.Menu', {
            items: menuItems,
            hidden: emptyMenu
        });

        return menu;
    }
});
