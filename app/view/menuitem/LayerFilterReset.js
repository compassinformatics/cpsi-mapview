/**
 * Resets the all applied filters.
 * Aftwards applies predefined filters in case they exist.
 *
 * @class CpsiMapview.view.menuitem.LayerFilterReset
 */
Ext.define('CpsiMapview.view.menuitem.LayerFilterReset', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layerfilterreset',

    requires: ['CpsiMapview.util.Grid'],

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
        const me = this;

        me.handler = me.handlerFunc;

        me.callParent();

        me.setHidden(!me.shallMenuItemBeShown());
    },

    /**
     * Executed when this menu item is clicked.
     */
    handlerFunc: function () {
        const me = this;
        const gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);

        const grid = gridWindow.down('grid');
        grid.fireEvent('clearfilters');
        grid.fireEvent('applypresetfilters');
    },

    /**
     * Checks if menu item should be shown.
     *
     * @returns {Boolean} If menu item should be shown
     */
    shallMenuItemBeShown: function () {
        const me = this;

        // the menu can only be shown for layers that have a grid
        if (!me.layer.get('gridXType')) {
            return false;
        }

        // check preset filters
        let hasPresetFilters = false;
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
    isLayerCurrentlyFiltered: function () {
        const me = this;

        // retrieve store to check if it is filtered
        const gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);
        const grid = gridWindow.down('grid');
        const store = grid.getStore();
        if (!store) {
            return false;
        }

        // check if common Ext filters (string, number, list, ...) are set
        const filters = store.getFilters();
        let hasGridFilters = false;
        if (filters) {
            hasGridFilters = filters.length > 0;
        }

        // spatial filters can only be detected by a property in the controller
        const spatialFilter = grid.getController().spatialFilter;
        let hasSpatialFilter = false;
        if (spatialFilter) {
            hasSpatialFilter = true;
        }

        return hasGridFilters || hasSpatialFilter;
    }
});
