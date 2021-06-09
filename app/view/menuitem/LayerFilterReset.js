/**
 * Resets the all applied filters.
 * Aftwards applies predefined filters in case they exist.
 *
 * @class CpsiMapview.view.menuitem.LayerFilterReset
 */
Ext.define('CpsiMapview.view.menuitem.LayerFilterReset', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layerfilterreset',

    requires: [
        'CpsiMapview.util.Grid'
    ],

    /**
     * The connected layer for this item
     *
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Text shown in this MenuItem
     * @cfg {String}
     */
    text: 'Reset Filters',

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.handler = me.handlerFunc;

        me.callParent();

        me.setHidden(!me.shallMenuItemBeShown());
    },

    /**
     * Executed when this menu item is clicked.
     */
    handlerFunc: function () {
        var me = this;
        var gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);

        var grid = gridWindow.down('grid');
        grid.fireEvent('clearfilters');
        grid.fireEvent('applypresetfilters');
    },

    /**
     * Checks if menu item should be shown.
     *
     * @returns {Boolean} If menu item should be shown
     */
    shallMenuItemBeShown: function(){
        var me = this;

        // the menu can only be shown for layers that have a grid
        if (!me.layer.get('gridXType')) {
            return false;
        }

        // check preset filters
        var hasPresetFilters = false;
        if (me.layer.get('gridFilters')) {
            hasPresetFilters = true;
        }

        // if the layer has preset filters, we always show the menu item
        // otherwise we only show it there are currently any preset filters
        return hasPresetFilters || me.isLayerCurrentlyFiltered();
    },

    /**
     * Checks if the grid is currently filtered.
     *
     * @returns {Boolean} If grid is currently filtered
     */
    isLayerCurrentlyFiltered: function() {
        var me = this;

        // retrieve store to check if it is filtered
        var gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);
        var grid = gridWindow.down('grid');
        var store = grid.getStore();
        if (!store) {
            return false;
        }

        // check if common Ext filters (string, number, list, ...) are set
        var filters = store.getFilters();
        var hasGridFilters = false;
        if (filters) {
            hasGridFilters = (filters.length > 0);
        }

        // spatial filters can only be detected by a property in the controller
        var spatialFilter = grid.getController().spatialFilter;
        var hasSpatialFilter = false;
        if (spatialFilter) {
            hasSpatialFilter = true;
        }

        return hasGridFilters || hasSpatialFilter;
    }
});
