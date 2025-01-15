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
        'CpsiMapview.model.toolbar.MapToolsModel',
        'CpsiMapview.view.combo.Gazetteer',
        'CpsiMapview.view.button.PermalinkButton',
        'CpsiMapview.view.button.StreetViewTool',
        'CpsiMapview.view.panel.TimeSlider',
        'CpsiMapview.view.panel.NumericAttributeSlider',
        'CpsiMapview.view.lineSliceGridExample.LineSliceGridButton',
        'CpsiMapview.view.snappingExample.EdgeButton',
        'CpsiMapview.view.window.ParallelLineWindow'
    ],

    controller: 'cmv_maptools',
    viewModel: 'cmv_maptools',

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
                    extent: [-1210762, 6688545, -600489, 7490828],
                    iconCls: 'x-fa fa-arrows-alt',
                    glyph: null,
                    viewModel: {
                        data: {
                            tooltip: 'Zoom to Full Extent'
                        }
                    }
                }, {
                    xtype: 'button',
                    toggleGroup: 'map',
                    name: 'pan',
                    tooltip: 'Pan the map',
                    iconCls: 'x-far fa-hand-paper'
                }, {
                    xtype: 'button',
                    toggleGroup: 'map',
                    iconCls: 'x-fa fa-search-plus',
                    viewModel: {
                        data: {
                            tooltip: 'Zoom In'
                        }
                    }
                }, {
                    xtype: 'basigx-button-zoomout',
                    toggleGroup: 'map',
                    enableZoomOutWithBox: true,
                    iconCls: 'x-fa fa-search-minus',
                    viewModel: {
                        data: {
                            tooltip: 'Zoom Out'
                        }
                    }
                }, {
                    xtype: 'basigx-button-measure',
                    toggleGroup: 'map',
                    measureType: 'line',
                    viewModel: 'cmv_btn_measure',
                    controller: 'cmv_btn_measure',
                    iconCls: 'fg-measure-line',
                    listeners: {
                        afterrender: 'initializeMeasureBtn'
                    }
                }, {
                    xtype: 'basigx-button-measure',
                    toggleGroup: 'map',
                    measureType: 'polygon',
                    iconCls: 'fg-measure-area',
                    viewModel: 'cmv_btn_measure',
                    controller: 'cmv_btn_measure',
                    listeners: {
                        afterrender: 'initializeMeasureBtn'
                    }
                }, {
                    xtype: 'basigx-button-history',
                    direction: 'BACK',
                    iconCls: 'x-fa fa-angle-left'
                }, {
                    xtype: 'basigx-button-history',
                    direction: 'FORWARD',
                    iconCls: 'x-fa fa-angle-right'
                }]
        },
        {
            xtype: 'buttongroup',
            title: 'Advanced Tools',
            items: [{
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                tooltip: 'Point',
                iconCls: 'fg-multipoint',
                apiUrl: '/pmspy/netsolver',
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
                iconCls: 'fg-polyline-pt',
                tooltip: 'Line'
            },
            {
                xtype: 'cmv_digitize_button',
                toggleGroup: 'map',
                type: 'Polygon',
                tooltip: 'Polygon',
                iconCls: 'fg-polygon-pt',
                apiUrl: '/WebServices/roadschedule/cutWithPolygon',
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
                apiUrl: '/WebServices/roadschedule/cutWithPolygon',
                listeners: {
                    responseFeatures: function () {
                        this.getController().onResponseFeatures();
                    }
                }
            }, {
                xtype: 'cmv_permalink_button',
                dialogWidth: 500
            }, {
                xtype: 'cmv_streetview_tool',
                toggleGroup: 'map',
            }, {
                xtype: 'cmv_line_slice_grid_button',
                text: '',
                tooltip: 'Linear Reference demo',
                iconCls: 'fg-split-line'
            }, {
                xtype: 'cmv_edgebutton',
                tooltip: 'Snapping demo',
                iconCls: 'fg-snap'
            }, {
                iconCls: 'fg-copy-line',
                tooltip: 'Draw Parallel Lines',
                toggleGroup: 'map',
                listeners: {
                    toggle: function (btn, toggled) {
                        var parallelLineWindow;
                        if (toggled) {
                            parallelLineWindow = Ext.create({
                                xtype: 'cmv_parallel_line_window',
                            });
                            parallelLineWindow.show();
                        } else {
                            parallelLineWindow = Ext.ComponentQuery.query(
                                'cmv_parallel_line_window')[0];
                            if (parallelLineWindow) {
                                parallelLineWindow.destroy();
                            }
                        }
                    }
                }
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
                url: '/WebServices/townland/gazetteer/',
                proxyRootProperty: 'data',
                displayValueMapping: 'name',
                emptyText: 'Townland...'
            }]
        }
    ]
});
