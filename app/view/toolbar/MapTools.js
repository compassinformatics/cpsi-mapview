/**
 * Toolbar offering map tools, like zoom or measure.
 */
Ext.define('CpsiMapview.view.toolbar.MapTools', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_maptools',
    requires: [
        'GeoExt.form.field.GeocoderComboBox',
        'BasiGX.view.button.Measure',
        'BasiGX.view.button.ZoomIn',
        'BasiGX.view.button.ZoomOut',
        'BasiGX.view.button.ZoomToExtent',
        'BasiGX.view.button.History',
        'CpsiMapview.view.button.DigitizeButton',
        'CpsiMapview.view.button.SpatialQueryButton',
        'CpsiMapview.model.button.MeasureButton',
        'CpsiMapview.controller.button.MeasureButtonController',
        'CpsiMapview.controller.MapController',
        'CpsiMapview.view.combo.Gazetteer',
        'CpsiMapview.view.button.StreetViewTool',
        'CpsiMapview.view.panel.TimeSlider',
        'CpsiMapview.view.panel.NumericAttributeSlider',
        'CpsiMapview.view.lineSliceGridExample.LineSliceGridButton'
    ],

    controller: 'cmv_map',

    dock: 'top',

    items: [
        {
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }, {
            xtype: 'basigx-button-zoomin',
            toggleGroup: 'zoom'
        }, {
            xtype: 'basigx-button-zoomout',
            toggleGroup: 'zoom',
            enableZoomOutWithBox: true
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'line',
            toggleGroup: 'measure-tools',
            viewModel: 'cmv_btn_measure',
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
            viewModel: 'cmv_btn_measure',
            controller: 'cmv_btn_measure',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }, {
            xtype: 'cmv_spatial_query_button',
            queryLayerName: 'GAS WFS',
            drawGeometryType: 'Polygon',
            spatialOperator: 'intersect',
            glyph: 'xf096@FontAwesome',
            listeners: {
                'cmv-spatial-query-success': function (featureCollection) {
                    var msg = 'WFS query returned ' + featureCollection.totalFeatures + ' feature(s)';
                    Ext.Msg.show({
                        title: 'Info',
                        message: msg,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                    });
                },
                'cmv-spatial-query-error': function () {
                    Ext.Msg.show({
                        title: 'Error',
                        message: 'WFS query not successful',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                    });
                }
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
            xtype: 'cmv_digitize_button',
            tooltip: 'Point',
            apiUrl: 'https://pmstipperarydev.compass.ie/pmspy/netsolver',
            groups: true,
            clearable: true,
            pointExtentBuffer: 50,
            listeners: {
                responseFeatures: function () {
                    this.getController().onResponseFeatures();
                }
            }
        }, {
            xtype: 'cmv_digitize_button',
            type: 'LineString',
            tooltip: 'Line'
        }, {
            xtype: 'cmv_digitize_button',
            type: 'Polygon',
            tooltip: 'Polygon',
            apiUrl: 'https://pmstipperarydev.compass.ie/WebServices/roadschedule/cutWithPolygon',
            clearable: true,
            clearDrawnFeature: false,
            listeners: {
                responseFeatures: function () {
                    this.getController().onResponseFeatures();
                }
            }
        }, {
            xtype: 'cmv_digitize_button',
            type: 'Circle',
            tooltip: 'Circle',
            clearable: true,
            apiUrl: 'https://pmstipperarydev.compass.ie/WebServices/roadschedule/cutWithPolygon',
            clearDrawnFeature: false,
            listeners: {
                responseFeatures: function () {
                    this.getController().onResponseFeatures();
                }
            }
        }, {
            xtype: 'cmv_streetview_tool'
        }, {
            xtype: 'cmv_timeslider',
            startDate: new Date(1946, 0, 1),
            endDate: new Date(2020, 11, 30)
        }, {
            xtype: 'cmv_numericattributeslider',
            // TODO might be better suited at the layer level
            numericField: 'Speed_Limit',
            minValue: 30,
            maxValue: 130,
            increment: 10,
            currLowerValue: 50,
            currUpperValue: 100
        }, {
            xtype: 'cmv_line_slice_grid_button'
        }
    ],

    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var map = BasiGX.util.Map.getMapComponent().map;

        // Nominatim based location search
        me.items.push({
            xtype: 'gx_geocoder_combo',
            map: map,
            listeners: {
                afterrender: function (gcCombo) {
                    gcCombo.locationLayer.set('displayInLayerSwitcher', false);
                }
            }
        });

        // custom CPSI gazetteer
        me.items.push({
            xtype: 'cmv_gazetteer_combo',
            url: 'https://pmstipperarydev.compass.ie/WebServices/townland/gazetteer/',
            proxyRootProperty: 'data',
            displayValueMapping: 'name',
            emptyText: 'Townland...',
            map: map
        });

        me.callParent();
    }
});
