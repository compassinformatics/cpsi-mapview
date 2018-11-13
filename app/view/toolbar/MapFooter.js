/**
 * A basic toolbar which serves as a container for other components.
 */
Ext.define('CpsiMapview.view.toolbar.MapFooter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_mapfooter',

    requires: [
        'BasiGX.view.combo.ScaleCombo'
    ],

    items: [
        {
            xtype: 'basigx-combo-scale'
        }
    ]
});
