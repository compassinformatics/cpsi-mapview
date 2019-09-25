/**
 * Util class for legends related functions.
 *
 * @class CpsiMapview.util.Legend
 */
Ext.define('CpsiMapview.util.Legend', {
    alternateClassName: 'LegendUtil',
    requires: [],

    singleton: true,

    /**
     * Creates a WMS getLegendGraphic request URL for the given OL layer.
     * For WMS it uses the standard WMS mechnism / information.
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
        var activatedStyle;
        if (layer.get('isWms')) {

            url = source.getUrls()[0];
            var layers = BasiGX.util.Object.layersFromParams(source.getParams());
            activatedStyle = layer.get('activatedStyle');
            if (!url || !layers) {
                return;
            }

            if (!url.endsWith('?')) {
                url += '?';
            }

            url += 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&';
            url += 'FORMAT=image%2Fpng&TRANSPARENT=TRUE&SLD_VERSION=1.1.0&';
            url += 'LAYER=' + layers + '&';
            url += 'STYLE=' + activatedStyle;

        } else if (layer.get('isWfs')) {

            url = layer.get('url');
            var ft = layer.get('featureType');
            activatedStyle = layer.get('activatedStyle');
            if (!url || !ft) {
                return;
            }

            if (!url.endsWith('?')) {
                url += '?';
            }

            url += 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&';
            url += 'FORMAT=image%2Fpng&TRANSPARENT=TRUE&SLD_VERSION=1.1.0&';
            url += 'LAYER=' + ft + '&';
            url += 'STYLE=' + LegendUtil.getWmsStyleFromSldFile(activatedStyle);
        }

        return url;
    },

    /**
     * Derives the STYLE parameter by the corresponding SLD file name.
     * Convention is LAYERS_STYLES.xml (whereas in STYLES we replace blanks by
     * underscores), e.g. LightUnit_Unit_Type.xml => 'Unit Type'.
     *
     * @param  {String} sldFileName The SLD file name
     * @return {String}             The WMS STYLE parameter
     */
    getWmsStyleFromSldFile: function (sldFileName) {
        // LightUnit_Unit_Type.xml => ['LightUnit', 'Unit', 'Type']
        var parts = sldFileName
            .replace('.xml', '')
            .split('_');
        // remove first item since it is the LAYERS name
        parts.shift();
        // => 'Unit Type'
        return parts.join(' ');
    },

    /**
    * Derives the SLD file name by the corresponding WMS STYLES ans LAYERS
    * parameter.
    * Convention is LAYERS_STYLES.xml (whereas for STYLES we replace blanks by
    * underscores), e.g. 'Unit Type' and 'LightUnit' => LightUnit_Unit_Type.xml
    *
     * @param  {String} wmsStyle  The WMS STYLE parameter
     * @param  {String} wmsLayers The WMS LAYERS parameter
     * @return {String}           The SLD file name
     */
    getSldFileFromWmsStyle: function (wmsStyle, wmsLayers) {
        return wmsLayers + '_' + wmsStyle.replace(' ', '_') + '.xml';
    }

});
