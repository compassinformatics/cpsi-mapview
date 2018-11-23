/**
 * Toolbar offering map tools, like zoom or measure.
 */
Ext.define('CpsiMapview.view.toolbar.MapTools', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_maptools',
    requires: [
        'BasiGX.view.button.Measure',
        'BasiGX.view.button.ZoomIn',
        'BasiGX.view.button.ZoomOut',
        'BasiGX.view.button.ZoomToExtent',
        'BasiGX.view.button.History',

        'CpsiMapview.model.button.MeasureButton',
        'CpsiMapview.controller.button.MeasureButtonController',
        'CpsiMapview.controller.MapController'
    ],

    controller: 'cmv_map',

    dock: 'top',

    items: [
        {
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }, {
            xtype: 'basigx-button-zoomin'
        }, {
            xtype: 'basigx-button-zoomout'
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'line',
            toggleGroup: 'measure-tools',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            glyph: 'xf068@FontAwesome',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'polygon',
            toggleGroup: 'measure-tools',
            glyph: 'xf044@FontAwesome',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }, {
            xtype: 'basigx-button-history',
            direction: 'BACK',
            glyph: 'xf104@FontAwesome'
        }, {
            xtype: 'basigx-button-history',
            direction: 'FORWARD',
            glyph: 'xf105@FontAwesome'
        }, {
            xtype: 'cmv_timeslider',
            startDate: new Date(1900, 0, 1),
            endDate: new Date(2040, 11, 30)
        }
    ]
});
