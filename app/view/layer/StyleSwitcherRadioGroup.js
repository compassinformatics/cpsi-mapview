/**
 * RadioGroup showing a radio button for each style connected to a layer.
 */
Ext.define('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    xtype: 'cmv_layer_styleswitcher_radiogroup',
    requires: [
        'Ext.form.field.Radio',
        'CpsiMapview.util.Legend'
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
     * @private
     */
    initComponent: function () {
        var me = this;
        var radioButtons = [];
        var layerStyles = me.layer.get('styles');
        var salt = Math.random();

        // create a 'radiofield' for each style connected to the layer
        Ext.each(layerStyles, function (layerStyle) {

            var layerTitle;
            var layerName;

            // check if style has title property
            if(layerStyle['title'] && layerStyle['name']){
                // has title property
                layerTitle = layerStyle['title'];
                layerName = layerStyle['name'];
            } else{
                // does not have title property
                // title generated from stlye name
                layerTitle = me.getLayerStyleLabel(layerStyle);
                layerName = layerStyle;
            }

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
        }
        );

        me.items = radioButtons;

        me.callParent();
    },

    /**
     * Returns the human readable label for the given style.
     * If WFS or VT we remove the '_' and the .xml file ending. For other layer types
     * we return the input value.
     *
     * @param  {String} layerStyle The style name to get the label for
     * @return {String}            Human readable label
     */
    getLayerStyleLabel: function (layerStyle) {
        if (this.layer.get('isWfs') || this.layer.get('isVt')) {
            // remove _ and the .xml file ending
            var legendUtil = CpsiMapview.util.Legend;
            return legendUtil.getWmsStyleFromSldFile(layerStyle);
        } else {
            return layerStyle;
        }
    },

    /**
     * Detects the checked state of the given style name based on the layer's
     * current acive style (property 'activatedStyle').
     *
     * @param  {String} sldStyle The style name to get the checked state for
     * @return {Boolean}         Checked state
     */
    getCheckedState: function (sldStyle) {
        var me = this;

        if (me.layer.get('activatedStyle') && me.layer.get('activatedStyle') === sldStyle) {
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
        var me = this;

        if (newVal === true) {
            var layer = me.layer;
            var newStyle = radioBtn.inputValue;
            var layerTreePanel = Ext.ComponentQuery.query('cmv_layertree')[0];

            // preserve active style as lookup
            layer.set('activatedStyle', newStyle);

            if (layer.get('isWms')) {

                // check if a label STYLES parameter was added --> keep this
                // the STYLES value (SLD) for the labels
                var labelClassName = layer.get('labelClassName');
                if (layer.get('labelsActive') === true) {
                    newStyle += ',' + labelClassName;
                }

                // apply new style parameter and reload layer
                var newParams = {
                    STYLES: newStyle
                };
                layer.getSource().updateParams(newParams);

                if (layerTreePanel) {
                    // force update of corresponding layer node UI (e.g. legend)
                    layerTreePanel.updateLayerNodeUi(layer);
                }

            } else if (layer.get('isWfs') || layer.get('isVt')) {

                var sldUrl = layer.get('stylesBaseUrl') + newStyle;
                // transform filter values to numbers ('1' => 1)
                var forceNumericFilterVals = layer.get('stylesForceNumericFilterVals');
                // load and parse SLD and apply it to layer
                LayerFactory.loadSld(layer, sldUrl, forceNumericFilterVals);

                if ((layer.get('isWfs') || layer.get('isVt')) && layerTreePanel) {
                    // force update of corresponding layer node UI (e.g. legend)
                    layerTreePanel.updateLayerNodeUi(layer);
                }

            } else {
                Ext.Logger.info('Layer type not supported in StyleSwitcherRadioGroup');
            }
        }
    }
});
