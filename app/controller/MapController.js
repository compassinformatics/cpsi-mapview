/**
 * This class is the controller for the map view of cpsi mapview
 *
 */
Ext.define('CpsiMapview.controller.MapController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_map',

    /**
     * Function called after render of map component
     */
    afterMapRender: function () {
        var me = this;
        var mapPanel = me.getView();

        if (mapPanel.addScaleBarToMap) {
            var removeCtrls = [];
            // Cleanup existing controls first
            mapPanel.olMap.getControls().forEach(function(ctrl) {
                if (ctrl instanceof ol.control.ScaleLine) {
                    removeCtrls.push(ctrl);
                }
            });
            Ext.each(removeCtrls, function(removeCtrl) {
                mapPanel.olMap.removeControl(removeCtrl);
            });

            var sbTarget = (mapPanel.body && mapPanel.body.dom) ?
                mapPanel.body.dom :
                mapPanel.getEl().dom;
            var scaleLineCtrl = new ol.control.ScaleLine({
                target: sbTarget
            });
            mapPanel.olMap.addControl(scaleLineCtrl);
        }
    },

    /**
     * Initialize measure buttons
     * @param {Ext.button.Button} btn The measure button
     */
    initializeMeasureBtn: function (btn) {
        btn.setBind({
            text: '{measureTooltext}',
            tooltip: btn.measureType === 'line' ? '{lineMeasureTooltip}' :
                '{polygonMeasureAreaTooltip}'
        });
        var tTipStr = btn.measureType === 'line' ?
            btn.getViewModel().get('lineMeasureTooltip') :
            btn.getViewModel().get('polygonMeasureAreaTooltip');
        btn.tooltipStr = tTipStr;
    },
});
