
Ext.define('CpsiMapview.view.layer.StyleSwitcherRadioGroup', {
    extend: 'Ext.form.RadioGroup',
    xtype: 'cmv_layer_styleswitcher_radiogroup',
    requires: [
    ],

    simpleValue: true,

    defaultType: 'radiofield',
    defaults: {
        flex: 1
    },
    layout: 'vbox',


    style: {
        paddingLeft: '75px'
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        var items = [];
        var layerStyles = me.layer.get('styles');
        var salt = Math.random();
        Ext.each(layerStyles, function (layerStyle) {
            items.push({
                name: 'sldstyle' + salt,
                boxLabel: me.getLayerStyleLabel(layerStyle),
                inputValue: layerStyle,
                checked: me.getCheckedState(layerStyle),
                listeners: {
                    change: me.onStyleChange,
                    scope: me
                }
            });
        });

        me.items = items;

        me.callParent();
    },

    getLayerStyleLabel: function (layerStyle) {
        if (this.layer.get('isWfs')) {
            // remove _ and the .xml file ending
            return layerStyle.replace(/_/g, ' ').replace('.xml', '');
        } else {
            return layerStyle;
        }
    },

    getCheckedState: function (sldStyle) {
        var me = this;
        var layerStyles = me.layer.get('styles');
        if (me.layer.get('activatedStyle') && me.layer.get('activatedStyle') === sldStyle) {
            return true;

        } else if (layerStyles[0] === sldStyle) {
            return true;
        } else {
            return false;
        }
    },

    onStyleChange: function (radioBtn, newVal) {
        var me = this;

        if (newVal === true) {
            var newStyle = radioBtn.inputValue;

            if (me.layer.get('isWms')) {

                var newParams = {
                    STYLES: newStyle
                };
                me.layer.getSource().updateParams(newParams);

            } else if (me.layer.get('isWfs')) {

                var sldUrl = me.layer.get('stylesBaseUrl') + newStyle;
                // load and parse SLD and apply it to layer
                LayerFactory.loadSld(me.layer, sldUrl);

            } else {
                Ext.Logger.info('Layer type not supported in StyleSwitcherRadioGroup');
            }
        }
    }
});
