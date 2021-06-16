/**
 * A basic toolbar which serves as a container for other components.
 */
Ext.define('CpsiMapview.view.toolbar.MapFooter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_mapfooter',

    requires: [
        'BasiGX.view.combo.ScaleCombo',
        'BasiGX.view.MapLoadingStatusBar',
        'CpsiMapview.view.form.Login',
        'CpsiMapview.view.button.MinimizeAllButton'
    ],

    items: [
        {
            xtype: 'cmv_minimize_all_button'
        },
        {
            xtype: 'basigx-combo-scale'
        }, {
            xtype: 'basigx-panel-coordinatemouseposition',
            epsgCodeArray: ['EPSG:4326', 'EPSG:29902', 'EPSG:2157'],
            activeEpsgCode: 'EPSG:29902',
            segmentedButtonLimit: 3
        },
        {
            xtype: 'basigx-maploadingstatusbar',
            width: 200
        },
        {
            xtype: 'cmv_numericattributeslider',
            // TODO might be better suited at the layer level
            numericField: 'Speed_Limit',
            minValue: 30,
            maxValue: 130,
            increment: 10,
            currLowerValue: 50,
            currUpperValue: 100
        }, '->',
        {
            xtype: 'button',
            text: 'Login',
            scope: this,
            handler: function () {
                var win = Ext.create('CpsiMapview.view.form.Login', {});
                win.show();
            }
        }
    ]
});
