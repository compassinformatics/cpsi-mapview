/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('CpsiMapview.model.button.MeasureButton', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cmv_btn_measure',

    data: {
        measureTooltext: null, // don't show text
        lineMeasureTooltip: 'Measure a distance',
        textline: 'Measure distance',
        tooltipLine: 'Measure distance',
        continueLineMsg: 'Click to measure a distance',
        textpoly: 'Measure area',
        tooltipPoly: 'Measure area',
        polygonMeasureAreaTooltip: 'Measure an area',
        continuePolygonMsg: 'Click to measure an area'
    }
});
