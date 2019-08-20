
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
                boxLabel: layerStyle,
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
            console.log('Perform a new WMS Request with style '+
                newStyle + ' f. ' + me.layer.get('name'));

            var newParams = {
                // LAYERS: layerList.join(','),
                STYLES: newStyle
            };

            me.layer.getSource().updateParams(newParams);
        }
    }
});
