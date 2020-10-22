/**
 * Util class for style related functions.
 *
 * @class CpsiMapview.util.Style
 */
Ext.define('CpsiMapview.util.Style', {
    alternateClassName: 'StyleUtil',
    requires: [],

    singleton: true,

    /**
     * Returns the human readable label for the given layer style.
     * If WFS or VT we remove the '_' and the .xml file ending. For other layer
     * types we return the input value.
     *
     * @param  {String} layerStyle The style name to get the label for
     * @param  {ol.layer.Base} layer The layer to get style label for
     * @return {String} Human readable label
     */
    getLayerStyleLabel: function (layerStyle, layer) {
        if (layer.get('isWfs') || layer.get('isVt')) {
            // remove _ and the .xml file ending
            var legendUtil = CpsiMapview.util.Legend;
            return legendUtil.getWmsStyleFromSldFile(layerStyle);
        } else {
            return layerStyle;
        }
    },

    /**
     * Returns the human readable title for the given layer style.
     * Either the explicit title property of the style config or the derived
     * style label (by #getLayerStyleLabel) is returned.
     *
     * @param  {String} layerStyle The style name to get the title for
     * @param  {ol.layer.Base} layer The layer to get style title for
     * @return {String}            Human readable title
     */
    getLayerStyleTitle: function (layerStyleName, layer) {
        var me = CpsiMapview.util.Style;
        var layerStyles = layer.get('styles');
        var layerTitle = null;

        Ext.each(layerStyles, function (layerStyle) {
            // get the relevant style definition
            if (layerStyle === layerStyleName ||
                layerStyle.name === layerStyleName) {
                if (layerStyle['title'] && layerStyle['name']) {
                    // has title property
                    layerTitle = layerStyle['title'];
                } else {
                    // does not have title property
                    // title generated from style name
                    layerTitle = me.getLayerStyleLabel(layerStyle, layer);
                }
            }
        });

        return layerTitle;
    }
});
