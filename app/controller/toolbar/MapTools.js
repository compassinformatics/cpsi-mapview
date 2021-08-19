/**
 * This class is the controller for the map toolbar of cpsi mapview
 *
 */
Ext.define('CpsiMapview.controller.toolbar.MapTools', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_maptools',

    /**
     * Initialize measure buttons
     * @param {Ext.button.Button} btn The measure button
     */
    initializeMeasureBtn: function (btn) {

        // avoid showing "null" in IE11 by setting to an empty string
        btn.getViewModel().set('clickToDrawText', '');

        btn.setBind({
            text: '{measureTooltext}',
            tooltip: btn.measureType === 'line' ? '{lineMeasureTooltip}' :
                '{polygonMeasureAreaTooltip}'
        });
        var tTipStr = btn.measureType === 'line' ?
            btn.getViewModel().get('lineMeasureTooltip') :
            btn.getViewModel().get('polygonMeasureAreaTooltip');
        btn.tooltipStr = tTipStr;
    }
});
