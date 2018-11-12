/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('CpsiMapview.model.button.MeasureButton', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.cmw_btn_measure',

    data: {
        measureTooltext: null, // don't show text
        lineMeasureTooltip: 'Measure a distance',
        polygonMeasureAreaTooltip: 'Measure an area',
        textline: 'Measure distance',
        textpoly: 'Measure area',
        tooltipLine: 'Measure distance',
        tooltipPoly: 'Measure area',
        continuePolygonMsg: 'Click to measure a distance',
        continueLineMsg: 'Click to measure an area'
    }
});
