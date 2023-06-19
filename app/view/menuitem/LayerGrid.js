/**
 * MenuItem to open an associated grid for a layer.
 *
 * @class CpsiMapview.view.menuitem.LayerGrid
 */
Ext.define('CpsiMapview.view.menuitem.LayerGrid', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layergrid',
    requires: [
        'CpsiMapview.view.window.MinimizableWindow',
        'CpsiMapview.util.Grid'
    ],
    /**
     * The connected layer for this item.
     *
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * If set, the gridWindow title will be set to this value
     *
     * @cfg {String}
     */
    titleOverride: null,

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

        me.handler = me.handlerFunc;

        me.callParent();

        // check if layer has a grid
        var hasGrid = false;
        if (me.layer.get('gridXType')) {
            hasGrid = true;
        }
        me.setHidden(!hasGrid);
    },

    /**
     * Executed when this menu item is clicked.
     * Opens a window with a grid for the connected layer.
     * If there is already an instance of the grid then
     * find its parent window and show this, otherwise
     * create a new grid and associated window.
     *
     * Applies the preset filters to the grid.
     */
    handlerFunc: function () {
        var me = this;
        var gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);

        if (me.titleOverride) {
            gridWindow.setTitle(me.titleOverride);
        }

        var grid = gridWindow.down('grid');
        grid.fireEvent('applypresetfilters');

        gridWindow.show();
    }
});
