/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('CpsiMapview.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_main',

    requires: [
        'Ext.layout.container.Border',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'CpsiMapview.view.main.Map',
        'CpsiMapview.view.header.Panel',
        'CpsiMapview.view.LayerTree',
        'CpsiMapview.view.grid.ExampleGrid',
        'CpsiMapview.view.grid.GridFiltersExample',
        'CpsiMapview.view.form.LayerTreeFilter'
    ],

    layout: 'border',

    items: [{
        xtype: 'cmv_map',
        region: 'center'
    }, {
        title: 'Tools',
        region: 'west',
        width: 300,
        collapsible: true,
        resizable: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [
            {
                xtype: 'cmv_layertreefilter'
            },
            {
                xtype: 'cmv_layertree',
                structureMode: 'BASELAYER_OVERLAY'
            }
        ]
    }, {
        xtype: 'cmv_header'
    }]
});
