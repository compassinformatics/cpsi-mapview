/**
 * Toolbar offering map tools, like zoom or measure.
 */
Ext.define('CpsiMapview.view.toolbar.MapTools', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_maptools',
    requires: [
        'Ext.container.ButtonGroup',
        'GeoExt.form.field.GeocoderComboBox',
        'BasiGX.view.button.Measure',
        'BasiGX.view.button.ZoomIn',
        'BasiGX.view.button.ZoomOut',
        'BasiGX.view.button.ZoomToExtent',
        'BasiGX.view.button.History',
        'CpsiMapview.view.button.DigitizeButton',
        'CpsiMapview.model.button.MeasureButton',
        'CpsiMapview.controller.button.MeasureButtonController',
        'CpsiMapview.controller.toolbar.MapTools',
        'CpsiMapview.view.combo.Gazetteer',
        'CpsiMapview.view.button.StreetViewTool',
        'CpsiMapview.view.panel.TimeSlider',
        'CpsiMapview.view.panel.NumericAttributeSlider',
        'CpsiMapview.view.lineSliceGridExample.LineSliceGridButton'
    ],

    controller: 'cmv_maptools',

    dock: 'top',

    /**
     * These would typically be overridden in a client application
     **/
    items: [
        {
            xtype: 'buttongroup',
            title: 'Basic Tools',
            items: [
                {
                    xtype: 'basigx-button-zoomtoextent',
                    extent: [-1210762, 6688545, -600489, 7490828]
                }, {
                    xtype: 'basigx-button-zoomin',
                    toggleGroup: 'map'
                }, {
                    xtype: 'basigx-button-zoomout',
                    toggleGroup: 'map',
                    enableZoomOutWithBox: true
                }, {
                    xtype: 'basigx-button-measure',
                    toggleGroup: 'map',
                    measureType: 'line',
                    viewModel: 'cmv_btn_measure',
                    controller: 'cmv_btn_measure',
                    glyph: 'ea13@font-gis',
                    listeners: {
                        afterrender: 'initializeMeasureBtn'
                    }
                }, {
                    xtype: 'basigx-button-measure',
                    toggleGroup: 'map',
                    measureType: 'polygon',
                    glyph: 'ea14@font-gis',
                    viewModel: 'cmv_btn_measure',
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
                }]
        },
        {
            xtype: 'buttongroup',
            title: 'Advanced Tools',
            items: [{
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                tooltip: 'Point',
                glyph: 'ea52@font-gis',
                apiUrl: 'https://pmstipperarydev.compass.ie/pmspy/netsolver',
                groups: true,
                pointExtentBuffer: 50,
                listeners: {
                    responseFeatures: function () {
                        this.getController().onResponseFeatures();
                    }
                }
            },
            {
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                type: 'LineString',
                glyph: 'ea02@font-gis',
                tooltip: 'Line'
            },
            {
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                type: 'Polygon',
                tooltip: 'Polygon',
                glyph: 'ea03@font-gis',
                apiUrl: 'https://pmstipperarydev.compass.ie/WebServices/roadschedule/cutWithPolygon',
                listeners: {
                    responseFeatures: function () {
                        this.getController().onResponseFeatures();
                    }
                }
            },
            {
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                type: 'Circle',
                tooltip: 'Circle',
                apiUrl: 'https://pmstipperarydev.compass.ie/WebServices/roadschedule/cutWithPolygon',
                listeners: {
                    responseFeatures: function () {
                        this.getController().onResponseFeatures();
                    }
                }
            }, {
                xtype: 'cmv_streetview_tool',
                toggleGroup: 'map',
            }, {
                xtype: 'cmv_line_slice_grid_button',
                text: '',
                tooltip: 'Linear Reference demo',
                glyph: 'ea78@font-gis',
            }]
        },
        '->',
        {
            xtype: 'buttongroup',
            title: 'Global Timeslider',
            items: [{
                xtype: 'cmv_timeslider',
                startDate: new Date(1946, 0, 1),
                endDate: new Date(2020, 11, 30)
            }]
        }, {
            xtype: 'buttongroup',
            title: 'Gazetteers',
            items: [{
                xtype: 'gx_geocoder_combo'
            }, {
                xtype: 'cmv_gazetteer_combo', // custom CPSI gazetteer
                url: 'https://pmstipperarydev.compass.ie/WebServices/townland/gazetteer/',
                proxyRootProperty: 'data',
                displayValueMapping: 'name',
                emptyText: 'Townland...'
            }]
        }
    ]
});
