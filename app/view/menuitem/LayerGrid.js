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
     * A Ext.window.Window configuration object
     * @cfg {Object}
     */
    windowConfig: {
        minHeight: 600,
        constrain: true,
        layout: 'fit',
        maximizable: true,
        closeAction: 'hide' // don't destroy the window when closed
    },

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
        var windowConfig = me.windowConfig;

        if (existingGrids.length > 0) {
            // get the parent window of the grid
            gridWindow = existingGrids[0].up('window');
        } else {

            Ext.apply(windowConfig, {
                title: title,
                layout: 'fit',
                items: [{
                    xtype: gridXType
                }],
                listeners: {
                    minimize: Ext.emptyFn,
                    close: function () {
                        // hide the spatial tool only when closed rather than when
                        // minimising the window
                        var me = this;
                        var queryButton = me.down('cmv_spatial_query_button');
                        if (queryButton !== null) {
                            queryButton.fireEvent('hideAssociatedPermanentLayer');
                            queryButton.toggle(false);
                        }
                        // hide the layer with the grid (to hide selections)
                        var grid = me.down('grid');
                        grid.fireEvent('hide');
                    },
                    show: function () {
                        var me = this;
                        var queryButton = me.down('cmv_spatial_query_button');
                        if (queryButton !== null) {
                            queryButton.fireEvent('showAssociatedPermanentLayer');
                        }

                        var grid = me.down('grid');
                        grid.fireEvent('show');
                    }
                }
            });
            gridWindow = Ext.create('CpsiMapview.view.window.MinimizableWindow', windowConfig);

            // copy any ViewModel properties from the grid on to its containing window
            // this allows helpUrl to be set at the grid level
            var gridViewModelData = gridWindow.down(gridXType).getViewModel().getData();
            // use apply rather than applyIf otherwise the default empty helpUrl is not overwritten
            Ext.apply(gridWindow.getViewModel().getData(), gridViewModelData);
        }
        gridWindow.show();
    }
});
