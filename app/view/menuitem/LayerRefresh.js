/**
 * MenuItem to force redraw of a layer.
 *
 * @class CpsiMapview.view.menuitem.LayerRefresh
 */
Ext.define('CpsiMapview.view.menuitem.LayerRefresh', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layerrefresh',
    requires: [
        'CpsiMapview.util.Layer'
    ],

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
        var layer = me.layer;
        var layerUtil = CpsiMapview.util.Layer;
        layerUtil.layerRefresh(layer);
    }
});
