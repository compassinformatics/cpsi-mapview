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
     * Get the parameters to be sent to the server as a JS object
     * Supports getting parameters from WMS layers or vector tile
     * layers which store WMS parameters in a URL template
     * @param {any} layer
     */
    getWmsParams: function (layer) {
        let wmsParams;
        const wmsSource = layer.getSource();

        if (layer.get('isVt') === true) {
            const urlParts = wmsSource.getUrls()[0].split('?');
            wmsParams = Ext.Object.fromQueryString(urlParts[1]);
        } else {
            wmsParams = wmsSource.getParams();
        }

        return wmsParams;
    },

    /**
     * Return an array of filter objects from a WMS Params object
     * @param {any} wmsParams
     */
    getWmsFilters: function (wmsParams) {
        const filters = wmsParams.FILTER || [];
        // split the list based on filters in brackets e.g. (filter1)(filter2)
        return Ext.isArray(filters)
            ? filters
            : filters.split(/(\(.*?\))/).filter(Boolean);
    },

    /**
     * Executed when this menu item is clicked.
     * Forces redraw of the connected layer.
     */
    getWmsFilterString: function (wmsParams) {
        const layers = wmsParams.LAYERS || [];
        const layerList = Ext.isArray(layers) ? layers : layers.split(',');

        const wmsFilterUtil = CpsiMapview.util.WmsFilter;
        const originalFilters = wmsFilterUtil.getWmsFilters(wmsParams);

        // every layer item requires a filter - duplicate the first filter
        // for the layer labels
        let firstFilter;
        const finalFilters = [];

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

        const wmsFilterString = finalFilters
            .map(function (filter) {
                // wrap each filter in brackets
                if (
                    Ext.String.startsWith(filter, '(') === false &&
                    Ext.String.endsWith(filter, ')') === false
                ) {
                    filter = '(' + filter + ')';
                }
                return filter;
            })
            .join('');

        return wmsFilterString;
    }
});
