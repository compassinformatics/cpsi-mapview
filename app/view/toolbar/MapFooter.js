/**
 * A basic toolbar which serves as a container for other components.
 */
Ext.define('CpsiMapview.view.toolbar.MapFooter', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_mapfooter',

    requires: [
        'BasiGX.view.combo.ScaleCombo',
        'BasiGX.view.MapLoadingStatusBar',
        'CpsiMapview.view.form.Login'
    ],

    items: [{
        xtype: 'basigx-combo-scale'
    }, {
        xtype: 'basigx-panel-coordinatemouseposition',
        epsgCodeArray: ['EPSG:4326', 'EPSG:29902', 'EPSG:2157'],
        segmentedButtonLimit: 3
    },
    {
        xtype: 'basigx-maploadingstatusbar',
        width: 200
    }, '->',
    {
        xtype: 'button',
        text: 'Login',
        scope: this,
        handler: function () {
            var win = Ext.create('CpsiMapview.view.form.Login', {});
            win.show();
        }
    }]
});
