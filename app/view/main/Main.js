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
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'CpsiMapview.controller.MainController',
        'CpsiMapview.model.MainModel',
        'CpsiMapview.view.main.Map',
        'CpsiMapview.view.header.Panel',
        'CpsiMapview.view.LayerTree'
    ],

    controller: 'cmv_main',
    viewModel: 'cmv_main',

    layout: 'border',

    items: [{
        xtype: 'cmv_map',
        region: 'center'
    }, {
        title: 'Tools',
        region: 'west',
        width: 300,
        collapsible: true,
        items: {
            xtype: 'cmv_layertree'
        }
    }, {
        xtype: 'cmv_header'
    }]
});
