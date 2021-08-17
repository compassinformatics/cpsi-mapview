/**
 * A mixin to handle hiding and showing layers associated with an edit model
 *
 * @class CpsiMapview.form.RightInfoField
 */
Ext.define('CpsiMapview.form.RightInfoField', {
    xtype: 'cmv_rightinfofield',
    extend: 'Ext.form.FieldContainer',

    requires: [
        'Ext.tip.QuickTipManager'
    ],

    /**
     * Setter method for the infoIconTooltip property
     * @param {any} tooltip
     */
    setInfoIconTooltip: function (tooltip) {
        var me = this;
        me.toolTip = tooltip;
        me.updateTooltip();
    },

    /**
     * Update the tooltip text
     */
    updateTooltip: function () {

        var me = this;

        if (Ext.tip.QuickTipManager.isEnabled() === true) {
            Ext.tip.QuickTipManager.unregister(me.iconPanel);

            Ext.tip.QuickTipManager.register({
                target: me.iconPanel.getId(),
                text: me.toolTip,
                autoHide: false
            });
        } else {
            Ext.log.warn('Ext.tip.QuickTipManager is not enabled');
        }

    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        // as field is an object in the config we want to make sure
        // settings are applied to field if set in the containing component
        if (config.defaults) {
            Ext.applyIf(config.field, config.defaults.field);
        }

        me.toolTip = config.field.infoIconTooltip || '&nbsp;'; // set to a space if no tt is provided

        Ext.applyIf(config.field, {
            labelAlign: 'left',
            labelWidth: 140,
            width: 320
        });

        me.iconPanel = Ext.create('Ext.container.Container', {
            cls: 'icon-gtk-info_16x16',
            width: 16,
            height: 16,
            margin: '0 6 0 2',
            listeners: {
                afterrender: me.updateTooltip, // run this afterrender or the tooltips don't appear on first hover
                scope: me
            }
        });

        me.setLayout({
            type: 'hbox',
            align: 'middle'
        });

        // add the components
        me.add(config.field);
        me.add(me.iconPanel);
    }
});
