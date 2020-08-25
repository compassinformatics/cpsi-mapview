/**
 * Util class for working with map layers
 *
 * @class CpsiMapview.util.Layer
 */
Ext.define('CpsiMapview.util.Layer', {
    alternateClassName: 'LayerUtil',
    requires: [
        'BasiGX.util.Object'
    ],

    singleton: true,

    /**
    * Executed when this menu item is clicked.
    * Forces redraw of the connected layer.
    */
    layerRefresh: function (layer) {

        var source = layer.getSource();

        // mostly WMS layers
        if (source.updateParams) {
            var params = source.getParams();
            params.noCache = new Date().getMilliseconds();
            source.updateParams(params);
            source.refresh();
        } else if (layer.get('isWfs') === true) {
            // for WFS trigger reload of source
            source.clear();
        } else {
            // only refresh for other layers and sources (to not loose data)
            source.refresh();
        }
    }
});
