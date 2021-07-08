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
            params.TIMESTAMP = Ext.Date.now();
            source.updateParams(params);
            source.refresh();
        } else if (layer.get('isWfs') === true) {
            if (source instanceof ol.source.Cluster) {
                // for clustered layers we need to get the original source - see #203
                source = source.getSource();
            }
            // for WFS trigger reload of source
            source.set('timestamp', Ext.Date.now())
            source.refresh();
        } else {
            // only refresh for other layers and sources (to not loose data)
            source.refresh();
        }
    }
});
