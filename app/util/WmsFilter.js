/**
 * Util class for working with WMS filters.
 * These are a vendor-specific parameter for WMS supported by MapServer
 * under https://mapserver.org/development/rfc/ms-rfc-118.html
 * It also relies on https://github.com/MapServer/MapServer/pull/6139 to
 * correctly implement duplicated layer names in a WMS request with filters
 *
 * @class CpsiMapview.util.WmsFilter
 */
Ext.define('CpsiMapview.util.WmsFilter', {
    alternateClassName: 'WmsFilterUtil',

    singleton: true,

    /**
    * Executed when this menu item is clicked.
    * Forces redraw of the connected layer.
    */
    getWmsFilterString: function (layer) {

        var wmsSource = layer.getSource();
        var wmsParams = wmsSource.getParams();

        var layers = wmsParams.LAYERS || [];
        var originalFilters = wmsParams.FILTER || [];

        var layerList = Ext.isArray(layers) ? layers : layers.split(',');

        // split the list based on filters in brackets e.g. (filter1)(filter2)
        originalFilters = Ext.isArray(originalFilters) ? originalFilters : originalFilters.split(/(\(.*?\))/).filter(Boolean);

        // every layer item requires a filter - duplicate the first filter
        // for the layer labels
        var firstFilter;
        var finalFilters = [];

        if (originalFilters.length > 0) {
            firstFilter = originalFilters[0];
            layerList.forEach(function () {
                finalFilters.push(firstFilter);
            });
        }

        //<debug>
        // number of filters must match number of layers for a MapServer WMS request
        if (finalFilters.length > 0) {
            Ext.Assert.truthy(finalFilters.length === layerList.length);
        }

        // currently we only allow a single layer and label layer - max 2
        Ext.Assert.truthy(layerList.length <= 2);
        Ext.Assert.truthy(finalFilters.length <= 2);
        //</debug>

        var wmsFilterString = finalFilters.map(function (filter) {
            // wrap each filter in brackets
            return '(' + filter + ')';
        }).join('');

        return wmsFilterString;
    }
});
