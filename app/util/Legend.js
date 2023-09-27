/**
 * Util class for legends related functions.
 *
 * @class CpsiMapview.util.Legend
 */
Ext.define('CpsiMapview.util.Legend', {
    alternateClassName: 'LegendUtil',
    requires: [
        'BasiGX.util.Object',
        'CpsiMapview.util.Html'
    ],

    singleton: true,

    /**
     * Creates a WMS getLegendGraphic request URL for the given OL layer.
     * For WMS it uses the standard WMS mechanism / information.
     * For WFS the assumption is that MapServer uses the same configuration for
     * WMS and WFS so we can create the getLegendGraphic the same way.
     * STYLE parameter is derived by the corresponding SLD file name
     * (see #getWmsStyleFromSldFile).
     *
     * @param  {ol.layer.Base} layer The OL layer to get the request URL for
     * @return {String}       The getLegendGraphic request URL
     */
    createGetLegendGraphicUrl: function (layer) {

        var source = layer.getSource();
        var url;
        var requestParams = '';

        var activatedStyle;
        if (layer.get('isWms') || layer.get('isVt')) {
            if (source.getUrls) {
                url = source.getUrls()[0];
            } else {
                url = source.getUrl(); // for a ol.source.ImageWMS layer
            }

            var layers;
            activatedStyle = layer.get('activatedStyle');

            if (layer.get('isVt')) {
                var splitUrl = url.toLowerCase().split('?');
                url = splitUrl[0];
                layers = Ext.Object.fromQueryString(splitUrl[1]).layers;
            } else {
                layers = BasiGX.util.Object.layersFromParams(source.getParams());
            }

            if (!url || !layers) {
                return;
            }

            // Remove possible duplicates created by adding labels
            // (CpsiMapview.view.menuitem.LayerLabels) because GetLegendGraphic
            // accepts only one layer in its LAYER param
            layers = LegendUtil.getUniqueLayersParam(layers);

            requestParams += 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&';
            requestParams += 'FORMAT=image%2Fpng&TRANSPARENT=TRUE&SLD_VERSION=1.1.0&';
            requestParams += 'LAYER=' + layers + '&';
            if (activatedStyle) {
                requestParams += 'STYLE=' + activatedStyle;
            }

        } else if (layer.get('isWfs')) {

            url = layer.get('url');
            var ft = layer.get('featureType');
            activatedStyle = layer.get('activatedStyle');
            if (!url || !ft) {
                return;
            }

            requestParams += 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&';
            requestParams += 'FORMAT=image%2Fpng&TRANSPARENT=TRUE&SLD_VERSION=1.1.0&';
            requestParams += 'LAYER=' + ft + '&';
            if (activatedStyle) {
                requestParams += 'STYLE=' + activatedStyle;
            }
        }
        if (!url) {
            return;
        }

        if (!url.endsWith('?') && !url.endsWith('&')) {
            url += '?';
        }

        url += requestParams;

        return url;
    },

    /*
     * Removes any duplicate layer name from the given LAYERS parameter value.
     *
     * @param  {String} layers WMS LAYERS parameter value, e.g. (layer1,layer2)
     * @return {String}        WMS LAYERS parameter without duplicates
     */
    getUniqueLayersParam: function (layers) {
        var layerList = Ext.isArray(layers) ? layers : layers.split(',');
        // remove any duplicate layer names
        var reducedLayerList = Ext.Array.unique(layerList);

        return reducedLayerList.join(',');
    },

    /**
     * Returns a string-based HTML template for a legend image.
     * Can be used within CpsiMapview.plugin.BasicTreeColumnLegend.
     *
     * @param {String} legendUrl The URL to the legend image
     * @param {Number} width Width of the legend image
     * @param {Number} height Height of the legend image
     */
    getLegendImgHtmlTpl: function (legendUrl, width, height) {
        var ns = 'CpsiMapview.plugin.BasicTreeColumnLegends';
        return '<img' +
            ' class="cpsi-layer-legend"' +
            ' src="' + legendUrl + '"' +
            (width ? ' width="' + width + '"' : '') +
            (height ? ' height="' + height + '"' : '') +
            ' onerror="' + ns + '.checkCleanup(this);"' +
            ' onload="' + ns + '.checkCleanup(this);"' +
            '/>';
    },

    /**
     * Caches the given legend image for a layer as dataURL in the
     * static lookup of CpsiMapview.view.LayerTree.
     *
     * @param {String} legendUrl The URL to the legend image
     * @param {String} layerKey The key / ID of the layer (used for storing in lookup)
     */
    cacheLegendImgAsDataUrl: function (legendUrl, layerKey) {
        var legendImage = new Image();
        legendImage.crossOrigin = 'anonymous';
        CpsiMapview.util.Html.addEvent(
            legendImage, 'load', function () {

                // set width and height
                var width = this.naturalWidth;
                var height = this.naturalHeight;
                // convert to base64 to avoid
                // reloading of the image
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                var legendDataUrl = canvas.toDataURL('image/png');

                // store in cache for later reuse
                CpsiMapview.view.LayerTree.legendImgLookup[layerKey] = legendDataUrl;

                LegendUtil['legendLoading_' + layerKey] = false;
            });

        LegendUtil['legendLoading_' + layerKey] = true;

        // set original legend url to trigger loading
        legendImage.src = legendUrl;
    }
});
