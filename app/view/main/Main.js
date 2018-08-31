/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('CpsiMapview.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'CpsiMapview.controller.MainController',
        'CpsiMapview.model.MainModel',
        'CpsiMapview.view.main.Map'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: 'border',

    items: [{
        xtype: 'mainlist',
        region: 'center'
    }, {
        title: 'Tools',
        region: 'west',
        width: 300,
        collapsible: true,
        bind: {
            html: '{loremIpsum}'
        }
    }, {
        // title: 'Groups',
        region: 'north',
        height: 100,
        bind: {
            html: '{loremIpsum}'
        }
    }]
});
