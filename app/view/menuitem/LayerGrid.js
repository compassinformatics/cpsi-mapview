/**
 * MenuItem to open an associated grid for a layer.
 *
 * @class CpsiMapview.view.menuitem.LayerGrid
 */
Ext.define('CpsiMapview.view.menuitem.LayerGrid', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layergrid',
    /**
     * The connected layer for this item.
     *
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Text shown in this MenuItem
     * @cfg {String}
     */
    text: 'Open Data Grid',

    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var hasGrid = false;

        if (me.layer) {
            hasGrid = me.layer.get('gridXType');
        }

        me.handler = me.handlerFunc;

        me.callParent();

        me.setHidden(!hasGrid);
    },

    /**
     * Executed when this menu item is clicked.
     * Opens a window with a grid for the connected layer.
     * If there is already an instance of the grid then
     * find its parent window and show this, otherwise
     * create a new grid and associated window.
     */
    handlerFunc: function () {
        var me = this;

        var gridXType = me.layer.get('gridXType');
        var title = me.layer.get('name');

        // we can't keep a reference to the window in this class
        // as a new Ext.menu.Item is created each time the menu is
        // opened - use Ext.ComponentQuery instead

        var existingGrids = Ext.ComponentQuery.query(gridXType);
        var gridWindow;

        if (existingGrids.length > 0) {
            // get the parent window of the grid
            gridWindow = existingGrids[0].up('.window');
        } else {
            gridWindow = Ext.create('Ext.window.Window', {
                height: 600,
                title: title,
                layout: 'fit',
                maximizable: true,
                closeAction: 'hide', // don't destroy the window when closed
                items: [{
                    xtype: gridXType
                }]
            });
        }
        gridWindow.show();
    }
});
