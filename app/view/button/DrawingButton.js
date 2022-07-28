/**
 * A digitize button used for drawing and modifying network features
 *
 * @class CpsiMapview.view.tool.DrawingButton
 */
Ext.define('CpsiMapview.view.tool.DrawingButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_drawing_button',

    requires: [
        'CpsiMapview.controller.button.DrawingButtonController'
    ],

    /**
     * The viewModel for this class
     */
    viewModel: {
        data: {
            tooltip: 'Draw a new line'
        }
    },

    /**
     * The controller for this class
     */
    controller: 'cmv_drawing_button',

    /**
     * The icon used for the button
     */
    glyph: 'xf040@FontAwesome',

    config: {

        /**
         * Set a layer to store the features drawn by a user (points, polygons_
         * If not set a layer will be created and added to the map automatically
         */
        drawLayer: null,

        /**
         * The layerKey values for any vector layers the newly drawn lines should
         * snap to e.g. ['NETWORKEDGES_WFS']
         */
        snappingLayerKeys: [],

        /**
         * The vector layer key of a point layer to snap the start and ends
         * of newly drawn lines to, and return the node ids
         */
        nodeLayerKey: null,

        /**
         * The vector layer key of an edge layer to snap the start and ends
         * of newly drawn lines to, and return the edge ids
         */
        edgeLayerKey: null,

        /**
         * The vector layer key of a polygon layer to snap the start and ends
         * of newly drawn lines to, and return the polygon ids
         */
        polygonLayerKey: null,

        /**
         * Style of the editing cursor, before first point is set.
         */
        drawBeforeEditingPoint: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'black'
                })
            })
        }),

        /**
         * Style of the first point of the drawn line.
         */
        drawStyleStartPoint: new ol.style.Style({
            // triangle
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
        }),

        /**
         * Style of the last point of the currently drawn line.
         */
        drawStyleEndPoint: new ol.style.Style({
            // square
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
        }),

        /**
         * The style of the point to modify.
         */
        modifySnapPointStyle: new ol.style.Style({
            // square
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
        }),

        /**
         * The style of the line to draw (without start and endpoint)
         */
        drawStyleLine: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'orange',
                width: 2
            })
        }),

        /**
         * The style of the point when snapped to the referenced
         * node layer.
         */
        snappedNodeStyle: new ol.style.Style({
            // cross
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'black'
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 3
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: 0,
            })
        }),

        /**
         * The style of the point when snapped to the referenced
         * edge layer.
         */
        snappedEdgeStyle: new ol.style.Style({
            // cross (45° rotation)
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: 'black'
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 3
                }),
                points: 4,
                radius: 10,
                radius2: 0,
                angle: Math.PI / 4
            })
        }),

        /**
         * The style snapped edge's vertices.
         */
        snappedEdgeVertexStyle: new ol.style.Style({
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
        })
    },

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'drawingButton',

    /**
     * The name of the toggleGroup
     * Activates the toggle behaviour of the button
     */
    toggleGroup: 'map',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onToggle',
        beforedestroy: 'onBeforeDestroy'
    }
});
