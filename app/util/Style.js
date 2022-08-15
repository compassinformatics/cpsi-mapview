/**
 * Util class for style related functions.
 *
 * @class CpsiMapview.util.Style
 */
Ext.define('CpsiMapview.util.Style', {
    alternateClassName: 'StyleUtil',
    requires: [],

    singleton: true,

    createBlackCircle: function () {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'black'
                })
            })
        });
    },

    createGreenTriangle: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'green'
                }),
                stroke: new ol.style.Stroke({
                    color: 'green',
                    width: 3
                }),
                points: 3,
                radius: 5,
                rotation: 0,
                angle: 0,
            })
        });
    },

    createRedSquare: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'red'
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 3
                }),
                points: 4,
                radius: 5,
                angle: Math.PI / 4,
            })
        });
    },

    createYellowSquare: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'yellow'
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 3
                }),
                points: 4,
                radius: 10,
                angle: Math.PI / 4,
            })
        });
    },

    createOrangeLine: function () {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'orange',
                width: 2
            })
        });
    },

    createBlackCross: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: 0,
            })
        });
    },
    createBlackStar: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1
                }),
                points: 5,
                radius: 10,
                radius2: 0,
                angle: 0,
            })
        });
    },

    createBlackRotatedCross: function () {
        return new ol.style.Style({
            image: new ol.style.RegularShape({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: Math.PI / 4
            })
        });
    },

    createWhiteCircle: function () {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: 'white',
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1
                }),
            })
        });
    },

    createRedPoiMarker: function () {
        return new ol.style.Style({
            text: new ol.style.Text({
                font: 'normal 2em "font-gis"',
                text: '\uea16',
                fill: new ol.style.Fill({
                    color: 'red'
                })
            })
        });
    },

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
    },

    /**
     * Create a point style for clustered features
     * @param {any} featCount the number of features in the clustered feature
     */
    createClusterStyle: function (featCount) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#3399CC'
                })
            }),
            text: new ol.style.Text({
                text: featCount.toString(),
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        });
    }
});
