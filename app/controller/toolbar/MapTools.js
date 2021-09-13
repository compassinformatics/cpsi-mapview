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
    },

    /**
    * Limit a gazetteer to only return results within a certain extent
    * This sets viewbox and bounded parameters for a Nominatim search
    * @param {any} cmb
    */
    setGazetteerExtent: function (cmb) {

        var map = BasiGX.util.Map.getMapComponent().map;

        var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
        var initialExtent = app.initialExtent;

        var mv = map.getView();
        cmb.addMapExtentParams(initialExtent, mv.getProjection());
    },

    init: function () {

        // update the loggedIn property on the viewmodel so any role-restricted
        // buttons or menus are activated
        var me = this;
        Ext.GlobalEvents.on('login', function () {
            me.getViewModel().set('loggedIn', true);
        });

        // as gx_geocoder_combo does not allow binding of the map property
        // set this when the view is created
        // TODO add late-binding of the map to gx_geocoder_combo
        var map = BasiGX.util.Map.getMapComponent().map;
        var gazetteers = me.getView().query('gx_geocoder_combo');

        Ext.each(gazetteers, function (cmb) {
            cmb.map = map;
            cmb.map.addLayer(cmb.locationLayer);
        });
    }
});
