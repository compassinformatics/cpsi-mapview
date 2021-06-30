/**
 * A mixin to handle hiding and showing layers associated with an edit model
 *
 * @class CpsiMapview.form.RightInfoField
 */
Ext.define('CpsiMapview.form.RightInfoField', {
    xtype: 'cmv_rightinfofield',
    extend: 'Ext.form.FieldContainer',

    /**
     * Setter method for the infoIconTooltip property
     * @param {any} tooltip
     */
    setInfoIconTooltip: function (tooltip) {
        var me = this;
        me.toolTip = tooltip;
        me.updateTooltip();
    },

    updateTooltip: function () {

        var me = this;
        Ext.tip.QuickTipManager.unregister(me.iconPanel);

        Ext.tip.QuickTipManager.register({
            target: me.iconPanel.getId(),
            text: me.toolTip,
            autoHide: false
        });

    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        // as field is an object in the config we want to make sure
        // settings are applied to field if set in the containing component
        if (config.defaults) {
            Ext.applyIf(config.field, config.defaults.field);
        }

        me.toolTip = config.field.infoIconTooltip || '&nbsp;';

        Ext.applyIf(config.field, {
            labelAlign: 'left',
            labelWidth: 140,
            width: 320
        });

        me.iconPanel = Ext.create('Ext.panel.Panel', {
            cls: 'icon-gtk-info_16x16',
            width: 16,
            height: 16,
            margin: '0 6 0 2',
            bodyStyle: {
                background: 'none !important',
                border: 'none !important'
            },
            listeners: {
                afterrender: me.updateTooltip, // run this afterrender or the tooltips don't appear on first hover
                scope: me
            }
        });

        me.setLayout({
            type: 'hbox',
            align: 'middle'
        });

        me.add(config.field);
        me.add(me.iconPanel);
    }
});
