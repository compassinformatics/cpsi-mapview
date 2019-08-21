/**
 * MenuItem showing a checkbox in the layer context menu that allows
 * a separate label layer to be displayed alongside the feature layer.
 *
 * @class CpsiMapview.view.menuitem.LayerLabels
 */
Ext.define('CpsiMapview.view.menuitem.LayerLabels', {
    extend: 'Ext.menu.CheckItem',
    xtype: 'cmv_menuitem_layerlabels',
    requires: [],

    /**
     * The connected layer for this item.
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Text shown in this MenuItem.
     * @cfg {String}
     */
    text: 'Labels',

    /**
     * The style name for the labels layer.
     * @property {String}
     * @readonly
     */
    labelClassName: null,


    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // try to detect the 'labelClassName' property of a WMS layer
        if (me.layer && (me.layer.getSource() instanceof ol.source.TileWMS ||
            me.layer.getSource() instanceof ol.source.ImageWMS)) {
            me.labelClassName = me.layer.get('labelClassName');
        }

        me.callParent();

        me.setHidden(Ext.isEmpty(me.labelClassName));

        me.on('afterrender', me.onAfterrender);
        me.on('checkchange', me.onCheckChange);
    },

    /**
     * Handles the 'afterrender' event of this menu item.
     * Checks / unchecks box dependent on if labels are displayed.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     */
    onAfterrender: function (checkItem) {
        var me = this;
        if (Ext.isEmpty(me.labelClassName)) {
            return;
        }
        var wmsSource = me.layer.getSource();
        var wmsParams = wmsSource.getParams();

        if (wmsParams && !Ext.isEmpty(wmsParams.STYLES) &&
            wmsParams.STYLES.indexOf(me.labelClassName) !== -1) {
            checkItem.setChecked(true);
        } else {
            checkItem.setChecked(false);
        }
    },

    /**
     * Handles the 'checkchange' event of this menu item.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     * @param  {Boolean}            checked   Current checked state
     */
    onCheckChange: function (checkItem, checked) {
        this.addStyleParameters(checked);
    },

    /**
     * Add label styles to the layer on the map by adding a separate layer in
     * WMS LAYERS param with custom style.
     *
     * @param  {Boolean} addLabel Add or remove the label layer
     */
    addStyleParameters: function (addLabel) {
        var me = this;
        var layer = me.layer;
        var labelClassName = me.labelClassName;
        var wmsSource = layer.getSource();
        var wmsParams = wmsSource.getParams();
        var layers = wmsParams.LAYERS || [];
        var styles = wmsParams.STYLES || '';
        var layerList = Ext.isArray(layers) ? layers : layers.split(',');
        var stylesList = Ext.isArray(styles) ? styles : styles.split(',');

        if (addLabel) {
            if (layerList.length === 1) {
                // add a duplicate of the layer
                layerList.push(layerList[0]);
                // apply the label style on the duplicated layer
                stylesList.push(labelClassName);

                // mark layer that labels are active
                layer.set('labelsActive', true);
            }
        } else {
            // remove any duplicate layer names created by adding labels
            layerList = Ext.Array.unique(layerList);
            // remove any label styles
            Ext.Array.remove(stylesList, labelClassName);

            // mark layer that labels are inactive
            layer.set('labelsActive', false);
        }

        var newParams = {
            LAYERS: layerList.join(','),
            STYLES: stylesList.join(',')
        };

        wmsSource.updateParams(newParams);
    }
});
