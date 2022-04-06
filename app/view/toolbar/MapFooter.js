/**
 * A basic toolbar which serves as a container for other components.
 */
Ext.define('CpsiMapview.view.toolbar.MapFooter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_mapfooter',

    requires: [
        'BasiGX.view.combo.ScaleCombo',
        'BasiGX.view.MapLoadingStatusBar',
        'BasiGX.view.panel.CoordinateMousePositionPanel',
        'CpsiMapview.view.button.LoginButton',
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
            width: 200,
            waitConf: {
                interval: 200,
                increment: 15,
                duration: 3000 // hide the status bar after 30 seconds to avoid hanging
            }
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
            xtype: 'cmv_login_button'
        }
    ]
});
