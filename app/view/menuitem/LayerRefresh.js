/**
 * MenuItem to force redraw of a layer.
 *
 * @class CpsiMapview.view.menuitem.LayerRefresh
 */
Ext.define('CpsiMapview.view.menuitem.LayerRefresh', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layerrefresh',
    requires: [],

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
    text: 'Refresh',


    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var allowRefresh = false;

        if (me.layer) {
            allowRefresh = me.layer.get('refreshLayerOption');
        }

        me.handler = me.handlerFunc;

        me.callParent();

        me.setHidden(!allowRefresh);
    },

    /**
     * Executed when this menu item is clicked.
     * Forces redraw of the connected layer.
     */
    handlerFunc: function () {
        var me = this;
        var source = me.layer.getSource();

        // mostly WMS layers
        if (source.updateParams) {
            var params = source.getParams();
            params.noCache = new Date().getMilliseconds();
            source.updateParams(params);
            source.refresh();
        } else if (me.layer.get('isWfs') === true) {
            // for WFS trigger reload of source
            source.clear();
        } else {
            // only refresh for other layers and sources (to not loose data)
            source.refresh();
        }
    }
});
