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
     * Get the style URL for the selected style object based on name
     * @returns
     */
    getStyleByName: function (layer, styleName) {

        var styleObj = null;

        if (Ext.isEmpty(layer.get('styles')) === false) {
            styleObj = layer.get('styles').find(function (style) {
                return style.name === styleName;
            });
            if (!styleObj) {
                Ext.log.warn('The style ' + styleName + ' was not found in the layer style configs');
            }
        }

        return styleObj;

    },

    /**
     * Returns the human readable title for the given layer style.
     * Either the explicit title property of the style config or the
     * style label
     *
     * @param  {String} layerStyle The style name to get the title for
     * @param  {ol.layer.Base} layer The layer to get style title for
     * @return {String}            Human readable title
     */
    getLayerStyleTitle: function (layerStyleName, layer) {

        var layerStyles = layer.get('styles');
        var layerTitle = null;

        Ext.each(layerStyles, function (layerStyle) {
            // get the relevant style definition
            if (layerStyle.name === layerStyleName) {
                layerTitle = layerStyle['title'];
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
