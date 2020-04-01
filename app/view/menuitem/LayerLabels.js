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
        'CpsiMapview.util.Legend'
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
     * Is true if all single style properties
     * are given for labeling (sldUrl, sldUrlLabel).
     * False otherwise.
     * @property{Boolean}
     * @readonly
     */
    hasSingleStyle: null,

    /**
     * Is true if all multi style properties
     * are given for labeling (styles, styles.label, stylesBaseUrl).
     * False otherwise.
     * @property{Boolean}
     * @readonly
     */
    hasMultiStyle: null,

    /**
     * Switch if the style should be applied
     * client sided or not
     * @property{Boolean}
     * @private
     */
    clientSideStyle: null,

    /**
     * Switch if values in filter should be
     * cast to numeric values.
     * @property{Boolean}
     * @readonly
     */
    forceNumericFilterVals: null,

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.clientSideStyle = (me.layer && (
            me.layer.getSource() instanceof ol.source.VectorTile
            || me.layer.getSource() instanceof ol.source.Vector
        ));
        // try to detect the 'labelClassName' property of a WMS layer
        if (me.layer && (me.layer.getSource() instanceof ol.source.TileWMS ||
            me.layer.getSource() instanceof ol.source.ImageWMS)) {
            me.labelClassName = me.layer.get('labelClassName');
        } else if (me.clientSideStyle) {
            // set required properties for client side labeling
            me.forceNumericFilterVals = me.layer.get('stylesForceNumericFilterVals');
        }

        me.callParent();

        if (me.clientSideStyle) {
            me.hasSingleStyle = !Ext.isEmpty(me.layer.get('sldUrl')) && !Ext.isEmpty(me.layer.get('sldUrlLabel'));
            me.hasMultiStyle = (
                !Ext.isEmpty(me.layer.get('stylesBaseUrl'))
                && !Ext.isEmpty(me.layer.get('styles'))
                && CpsiMapview.util.Legend.hasLabels(me.layer.get('styles'))
            );
            // if neither sldUrlLabel nor styles[x].label are defined, labeling is not enabled
            me.setHidden(!me.hasSingleStyle && !me.hasMultiStyle);
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
        var activeLabelStyle = me.layer.get('activeLabelStyle');

        if (!me.hasSingleStyle && !me.hasMultiStyle) {
            return;
        }

        var labelStyleUrls = me.getLabelStyleUrls();
        if (labelStyleUrls.indexOf(activeLabelStyle) !== -1) {
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
        var forceNumericFilterVals = me.forceNumericFilterVals;
        var activatedStyle = layer.get('activatedStyle');

        var url;
        if (addLabel) {

            url = layer.get('sldUrlLabel');
            if (!Ext.isEmpty(activatedStyle)) {
                url = me.getLabelStyleUrl(activatedStyle);
            }

            if (url) {
                layer.set('activeLabelStyle', url);
                layer.set('labelsActive', true);
                LayerFactory.loadSld(layer, url, forceNumericFilterVals);
            }

        } else {

            url = layer.get('sldUrl');

            if (!Ext.isEmpty(activatedStyle)) {
                url = layer.get('stylesBaseUrl') + activatedStyle;
            }

            if (url) {
                layer.set('activeLabelStyle', undefined);
                layer.set('labelsActive', false);
                LayerFactory.loadSld(layer, url, forceNumericFilterVals);
            }

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

        var newParams = {
            LAYERS: layerList.join(','),
            STYLES: stylesList.join(',')
        };

        wmsSource.updateParams(newParams);
    },

    /**
     * Helper function to build and get all urls that refer
     * to label styles.
     */
    getLabelStyleUrls: function () {
        var me = this;
        var layer = me.layer;
        var sldUrlLabel = layer.get('sldUrlLabel');
        var styles = layer.get('styles');
        var stylesBaseUrl = layer.get('stylesBaseUrl');

        if (me.hasSingleStyle) {
            return [sldUrlLabel];
        }
        if (me.hasMultiStyle) {
            var labelStyleUrls = [];
            Ext.each(styles, function(style) {
                if (!Ext.isEmpty(style.label)) {
                    labelStyleUrls.push(stylesBaseUrl + style.label);
                }
            });
            return labelStyleUrls;
        }
    },

    /**
     * Helper function to get the label style url that
     * matches the currently activated style.
     *
     * @param {String} activatedStyle Name of the currently activated style
     */
    getLabelStyleUrl: function (activatedStyle) {
        var me = this;
        var stylesBaseUrl = me.layer.get('stylesBaseUrl');
        var styles = me.layer.get('styles');

        var labelStyle;
        if (!me.hasMultiStyle) {
            return;
        }

        labelStyle = styles.find(function (style) {
            return style.name === activatedStyle;
        });

        if (!labelStyle) {
            return;
        }

        if (Ext.isEmpty(labelStyle.label)) {
            return;
        }

        return stylesBaseUrl + labelStyle.label;
    }

});
