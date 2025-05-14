/**
 * RadioGroup showing a radio button for each style connected to a layer.
 */
Ext.define('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    xtype: 'cmv_layer_styleswitcher_radiogroup',
    requires: [
        'Ext.form.field.Radio',
        'CpsiMapview.util.Legend',
        'CpsiMapview.util.Style'
    ],

    /** @private */
    simpleValue: true,

    /** @private */
    defaultType: 'radiofield',

    /** @private */
    defaults: {
        flex: 1
    },

    /** @private */
    layout: 'vbox',

    /** @private */
    style: {
        paddingLeft: '75px'
    },

    /**
     * Flag indicating if this radio group is directly rendered below the
     * corresponding layer tree node (`true`) or within the context menu
     * (`false`).
     * @cfg
     */
    renderedBelowTreeNode: true,

    /**
     * @private
     */
    initComponent: function () {
        const me = this;
        const radioButtons = [];
        const layerStyles = me.layer.get('styles');
        const salt = Math.random();

        // create a 'radiofield' for each style connected to the layer
        Ext.each(layerStyles, function (layerStyle) {
            const layerTitle = layerStyle['title'];
            const layerName = layerStyle['name'];

            radioButtons.push({
                name: 'sldstyle' + salt,
                boxLabel: layerTitle,
                inputValue: layerName,
                checked: me.getCheckedState(layerName),
                listeners: {
                    change: me.onStyleChange,
                    scope: me
                }
            });
        });

        me.items = radioButtons;

        me.callParent();

        if (me.renderedBelowTreeNode === false) {
            // adjust layout for usage in menu item
            me.setStyle('paddingLeft', '5px');
        }
    },

    /**
     * Detects the checked state of the given style name based on the layer's
     * current active style (property 'activatedStyle').
     *
     * @param  {String} sldStyle The style name to get the checked state for
     * @return {Boolean}         Checked state
     */
    getCheckedState: function (sldStyle) {
        const me = this;
        if (
            me.layer.get('activatedStyle') &&
            me.layer.get('activatedStyle') === sldStyle
        ) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Handles the 'change' event of the radiogroup.
     * Applies the new style (by newly checked radio button) to the connected
     * layer (WMS / or WFS).
     *
     * @param  {Ext.form.field.Radio } radioBtn The changed radio button
     * @param  {Boolean} newVal   [description] The new value of the changed radio button
     */
    onStyleChange: function (radioBtn, newVal) {
        const me = this;
        const styleUtil = CpsiMapview.util.Style;

        if (newVal === true) {
            const layer = me.layer;
            let newStyle = radioBtn.inputValue;
            const layerTreePanel = Ext.ComponentQuery.query('cmv_layertree')[0];

            // preserve active style as lookup
            layer.set('activatedStyle', newStyle);

            if (layer.get('isWms')) {
                // check if a label STYLES parameter was added --> keep this
                // the STYLES value (SLD) for the labels
                const labelClassName = layer.get('labelClassName');
                if (layer.get('labelsActive') === true) {
                    newStyle += ',' + labelClassName;
                }

                // apply new style parameter and reload layer
                const newParams = {
                    STYLES: newStyle
                };
                layer.getSource().updateParams(newParams);

                if (layerTreePanel) {
                    // force update of corresponding layer node UI (e.g. legend)
                    layerTreePanel.updateLayerNodeUi(layer);
                }
            } else if (layer.get('isWfs') || layer.get('isVt')) {
                // load and parse SLD and apply it to layer
                LayerFactory.loadSld(layer);

                if (layerTreePanel) {
                    // force update of corresponding layer node UI (e.g. legend)
                    layerTreePanel.updateLayerNodeUi(layer);
                }
            } else {
                Ext.Logger.info(
                    'Layer type not supported in StyleSwitcherRadioGroup'
                );
            }

            const styleTitle = styleUtil.getLayerStyleTitle(newStyle, layer);
            me.fireEvent(
                'cmv-layer-style-change',
                me,
                newStyle,
                styleTitle,
                layer
            );
        }
    }
});
