/**
 * MenuItem showing a checkbox in the layer context menu that allows
 * a separate label layer to be displayed alongside the feature layer.
 *
 * Also supports a `labels` config array, similar to `styles`:
 *
 *     "labels": [
 *         { "name": "LabelsName", "title": "Names" },
 *         { "name": "LabelsCode", "title": "Codes" }
 *     ]
 *
 * This configuration creates a submenu with a radio-style choice.
 * @class CpsiMapview.view.menuitem.LayerLabels
 */
Ext.define('CpsiMapview.view.menuitem.LayerLabels', {
    extend: 'Ext.menu.CheckItem',
    xtype: 'cmv_menuitem_layerlabels',
    requires: ['CpsiMapview.util.WmsFilter'],

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
     * The style name for the labels layer. Used for the single labels.
     * @property {String}
     * @readonly
     */
    labelClassName: null,

    /**
     * Configured label style options read from the layer's `labels` config array.
     * @property {Object[]}
     * @readonly
     */
    labelOptions: null,

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
        const me = this;
        if (me.layer && !(me.layer instanceof ol.layer.Group)) {
            me.clientSideStyle =
                me.layer.getSource() instanceof ol.source.VectorTile ||
                me.layer.getSource() instanceof ol.source.Vector;

            // try to detect the label configuration of a WMS layer
            if (
                me.layer.getSource() instanceof ol.source.TileWMS ||
                me.layer.getSource() instanceof ol.source.ImageWMS
            ) {
                const labelsCfg = me.layer.get('labels');
                if (Ext.isArray(labelsCfg) && labelsCfg.length > 0) {
                    me.labelOptions = labelsCfg;
                    if (labelsCfg.length === 1) {
                        // a single configured option behaves like the
                        // single label menu item
                        me.labelClassName = labelsCfg[0].name;
                    }
                } else {
                    me.labelClassName = me.layer.get('labelClassName');
                }
            }
        }

        // build the submenu
        if (
            !me.clientSideStyle &&
            Ext.isArray(me.labelOptions) &&
            me.labelOptions.length > 1
        ) {
            me.menu = me.buildLabelOptionsMenuCfg();
        }

        me.callParent();

        if (me.clientSideStyle) {
            // for vector layers display the labels feature if
            // at least one style has a labelRule
            let hideLabelsCheckbox = true;
            const styles = me.layer.get('styles');
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
            const hasLabelOptions =
                Ext.isArray(me.labelOptions) && me.labelOptions.length > 0;
            me.setHidden(Ext.isEmpty(me.labelClassName) && !hasLabelOptions);
        }

        me.on('afterrender', me.onAfterrender);
        me.on('checkchange', me.onCheckChange);
    },

    /**
     * Builds the config for the submenu of selectable label styles
     * ("None" + one radio-button for each label option).
     *
     * @return {Object} Config object for an Ext.menu.Menu
     * @private
     */
    buildLabelOptionsMenuCfg: function () {
        const me = this;
        // the group name only needs to be unique within this submenu instance
        const groupName = 'cmv-labels-group-' + Ext.id();

        const items = [
            {
                xtype: 'menucheckitem',
                text: 'None',
                group: groupName,
                labelName: null,
                checked: true,
                checkHandler: me.onLabelOptionCheckChange,
                scope: me
            }
        ];

        Ext.Array.each(me.labelOptions, function (labelCfg) {
            items.push({
                xtype: 'menucheckitem',
                text: labelCfg.title || labelCfg.name,
                group: groupName,
                labelName: labelCfg.name,
                checked: false,
                checkHandler: me.onLabelOptionCheckChange,
                scope: me
            });
        });

        return {
            xtype: 'menu',
            items: items
        };
    },

    /**
     * Handles the 'checkchange' event of a submenu radio button.
     *
     * @param  {Ext.menu.CheckItem} checkItem The submenu item itself
     * @param  {Boolean}            checked   Current checked state
     * @private
     */
    onLabelOptionCheckChange: function (checkItem, checked) {
        const me = this;
        if (!checked) {
            return;
        }
        const labelName = checkItem.labelName;
        me.addStyleParameters(!!labelName, labelName);
        // update checked property without re-triggering onCheckChange
        const suppressEvents = true;
        me.setChecked(!!labelName, suppressEvents);
    },

    /**
     * Keeps the submenu's radio items in sync with the active
     * label name (e.g. after the parent checkbox is toggled directly,
     * or after detecting the initial state on render).
     *
     * @param  {String} activeLabelName Currently active label name, or
     *                                  null if none is active
     * @private
     */
    syncLabelOptionsMenu: function (activeLabelName) {
        const me = this;
        if (!me.menu) {
            return;
        }
        me.menu.items.each(function (item) {
            const suppressEvents = true;
            item.setChecked(item.labelName === activeLabelName, suppressEvents);
        });
    },

    /**
     * Handles the 'afterrender' event of this menu item.
     * Checks / unchecks box dependent on if labels are displayed.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     */
    onAfterrender: function (checkItem) {
        const me = this;

        if (!me.layer || me.layer instanceof ol.layer.Group) {
            return;
        }

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
        const me = this;
        const activatedStyle = me.layer.get('activatedStyle');

        const styles = me.layer.get('styles');
        const selectedStyle = styles.find(function (style) {
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
     * Checks / unchecks box dependent on if labels are displayed, and
     * (when multiple label options are configured) syncs the submenu
     * to whichever configured label style is currently active.
     *
     * @param  {Ext.menu.CheckItem} checkItem The menu item itself
     */
    onAfterrenderServerSide: function (checkItem) {
        const me = this;

        if (!me.layer.getSource || !me.layer.getSource().getParams) {
            // not a WMS layer
            return;
        }

        const wmsSource = me.layer.getSource();
        const wmsParams = wmsSource.getParams();

        // set the checkbox value, but no need to call onCheckChange again
        const suppressEvents = true;

        if (Ext.isArray(me.labelOptions) && me.labelOptions.length > 1) {
            let activeLabelName = null;
            if (wmsParams && !Ext.isEmpty(wmsParams.STYLES)) {
                const activeEntry = Ext.Array.findBy(
                    me.labelOptions,
                    function (labelCfg) {
                        return wmsParams.STYLES.indexOf(labelCfg.name) !== -1;
                    }
                );
                activeLabelName = activeEntry ? activeEntry.name : null;
            }
            me.layer.set('activeLabelName', activeLabelName);
            me.layer.set('labelsActive', !!activeLabelName);
            checkItem.setChecked(!!activeLabelName, suppressEvents);
            me.syncLabelOptionsMenu(activeLabelName);
            return;
        }

        if (Ext.isEmpty(me.labelClassName)) {
            return;
        }

        if (
            wmsParams &&
            !Ext.isEmpty(wmsParams.STYLES) &&
            wmsParams.STYLES.indexOf(me.labelClassName) !== -1
        ) {
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
        const me = this;
        if (me.clientSideStyle) {
            me.addLabelStyle(checked);
        } else if (Ext.isArray(me.labelOptions) && me.labelOptions.length > 1) {
            // the top-level menu was toggled directly
            // turning it off means "None"; turning it on
            // uses the previously active option or the first configured option
            const labelName = checked
                ? me.layer.get('activeLabelName') || me.labelOptions[0].name
                : null;
            me.addStyleParameters(checked, labelName);
            me.syncLabelOptionsMenu(labelName);
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
        const me = this;
        const layer = me.layer;

        const originalValue = layer.get('labelsActive');

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
     * @param  {String}  [labelClassNameOverride] Label style name
     *                   to use instead of `me.labelClassName`. Used when
     *                   multiple `labels` options are configured.
     */
    addStyleParameters: function (addLabel, labelClassNameOverride) {
        const me = this;
        const layer = me.layer;
        const labelClassName = labelClassNameOverride || me.labelClassName;
        const wmsSource = layer.getSource();
        const wmsParams = wmsSource.getParams();
        const layers = wmsParams.LAYERS || [];
        const styles = wmsParams.STYLES || '';
        let layerList = Ext.isArray(layers) ? layers : layers.split(',');
        const stylesList = Ext.isArray(styles) ? styles : styles.split(',');

        // if a label style is currently active, remove it first
        if (layer.get('labelsActive')) {
            const previousLabelClassName =
                layer.get('activeLabelName') || me.labelClassName;
            layerList = Ext.Array.unique(layerList);
            Ext.Array.remove(stylesList, previousLabelClassName);
        }

        if (addLabel && labelClassName) {
            // add a duplicate of the layer
            layerList.push(layerList[0]);
            // apply the label style on the duplicated layer
            stylesList.push(labelClassName);

            // mark layer that labels are active, and which style is used
            layer.set('labelsActive', true);
            layer.set('activeLabelName', labelClassName);
        } else {
            // mark layer that labels are inactive
            layer.set('labelsActive', false);
            layer.set('activeLabelName', null);
        }

        wmsSource.getParams().LAYERS = layerList.join(',');

        // once the LAYERS parameter has been updated
        // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
        const wmsFilterUtil = CpsiMapview.util.WmsFilter;
        const wmsFilterString = wmsFilterUtil.getWmsFilterString(
            wmsSource.getParams()
        );

        const newParams = {
            FILTER: wmsFilterString,
            STYLES: stylesList.join(',')
        };

        wmsSource.updateParams(newParams);
    }
});
