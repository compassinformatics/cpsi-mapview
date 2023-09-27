/**
 * MenuItem showing a checkbox in the layer context menu that allows
 * a separate label layer to be displayed alongside the feature layer.
 *
 * @class CpsiMapview.view.menuitem.LayerLabels
 */
Ext.define('CpsiMapview.view.menuitem.LayerLabels', {
    extend: 'Ext.menu.CheckItem',
    xtype: 'cmv_menuitem_layerlabels',
    requires: [
        'CpsiMapview.util.WmsFilter'
    ],

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
     * Switch if the style should be applied
     * client sided or not
     * @property{Boolean}
     * @private
     */
    clientSideStyle: null,

    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        if (me.layer && !(me.layer instanceof ol.layer.Group)) {
            me.clientSideStyle = (
                me.layer.getSource() instanceof ol.source.VectorTile
                || me.layer.getSource() instanceof ol.source.Vector
            );
            // try to detect the 'labelClassName' property of a WMS layer
            if (me.layer.getSource() instanceof ol.source.TileWMS ||
                me.layer.getSource() instanceof ol.source.ImageWMS) {
                me.labelClassName = me.layer.get('labelClassName');
            }
        }
        me.callParent();

        if (me.clientSideStyle) {
            // for vector layers display the labels feature if
            // at least one style has a labelRule
            var hideLabelsCheckbox = true;
            var styles = me.layer.get('styles');
            if (Ext.isEmpty(styles) === false) {
                Ext.Array.each(styles, function (style) {
                    if (style.labelRule) {
                        hideLabelsCheckbox = false;
                        return;
                    }
                });
            }
            me.setHidden(hideLabelsCheckbox);
        } else {
            me.setHidden(Ext.isEmpty(me.labelClassName));
        }

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
        if (me.clientSideStyle) {
            me.onAfterrenderClientSide(checkItem);
        } else {
            me.onAfterrenderServerSide(checkItem);
        }
    },

    /**
     * Handles the 'afterrender' event of this menu item for client
     * side labeling.
     * Checks / unchecks box dependent on if labels are displayed.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     */
    onAfterrenderClientSide: function (checkItem) {
        var me = this;
        var activatedStyle = me.layer.get('activatedStyle');

        var styles = me.layer.get('styles');
        var selectedStyle = styles.find(function (style) {
            return style.name === activatedStyle;
        });

        if (selectedStyle && me.layer.get('labelsActive')) {
            checkItem.setChecked(true);
        } else {
            checkItem.setChecked(false);
        }
    },

    /**
     * Handles the 'afterrender' event of this menu item for server
     * side labeling.
     * Checks / unchecks box dependent on if labels are displayed.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     */
    onAfterrenderServerSide: function (checkItem) {
        var me = this;
        if (Ext.isEmpty(me.labelClassName)) {
            return;
        }
        var wmsSource = me.layer.getSource();
        var wmsParams = wmsSource.getParams();

        // set the checkbox value, but no need to call onCheckChange again
        var suppressEvents = true;

        if (wmsParams && !Ext.isEmpty(wmsParams.STYLES) &&
            wmsParams.STYLES.indexOf(me.labelClassName) !== -1) {
            checkItem.setChecked(true, suppressEvents);
        } else {
            checkItem.setChecked(false, suppressEvents);
        }
    },

    /**
     * Handles the 'checkchange' event of this menu item.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     * @param  {Boolean}            checked   Current checked state
     */
    onCheckChange: function (checkItem, checked) {
        var me = this;
        if (me.clientSideStyle) {
            me.addLabelStyle(checked);
        } else {
            me.addStyleParameters(checked);
        }
    },

    /**
     * Add label style to the layer on the map by loading the specified
     * SLD in the layer configuration.
     *
     * @param  {Boolean} addLabel Add or remove the label layer
     */
    addLabelStyle: function (addLabel) {
        var me = this;
        var layer = me.layer;

        var originalValue = layer.get('labelsActive');

        // reload the SLD if the label values are changed
        if (originalValue !== addLabel) {
            layer.set('labelsActive', addLabel);
            LayerFactory.loadSld(layer);
        }
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

        wmsSource.getParams().LAYERS = layerList.join(',');

        // once the LAYERS parameter has been updated
        // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
        var wmsFilterUtil = CpsiMapview.util.WmsFilter;
        var wmsFilterString = wmsFilterUtil.getWmsFilterString(wmsSource.getParams());

        var newParams = {
            FILTER: wmsFilterString,
            STYLES: stylesList.join(',')
        };

        wmsSource.updateParams(newParams);

    }
});
