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
         * The layerKey values for any vector layers the newly drawn lines should
         * trace on e.g. ['CHANNELNETWORKVECTOR_WFS', 'NETWORKJUNCTIONS_WFS', 'NETWORKEDGES_WFS']
         */
        tracingLayerKeys: [],

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
         * If the vertices of the snapped edge shall be shown.
         */
        showVerticesOfSnappedEdge: true,

        /**
         * Style of the editing cursor, before first point is set.
         */
        drawBeforeEditingPoint: CpsiMapview.util.Style.createBlackCircle(),

        /**
         * Style of the first point of the drawn line.
         */
        drawStyleStartPoint: CpsiMapview.util.Style.createGreenTriangle(),

        /**
         * Style of the last point of the currently drawn line.
         */
        drawStyleEndPoint: CpsiMapview.util.Style.createRedSquare(),

        /**
         * The style of the point to modify.
         */
        modifySnapPointStyle: CpsiMapview.util.Style.createYellowSquare(),

        /**
         * The style of the line to draw (without start and endpoint)
         */
        drawStyleLine: CpsiMapview.util.Style.createOrangeLine(),

        /**
         * The style of the point when snapped to the referenced
         * node layer.
         */
        snappedNodeStyle: CpsiMapview.util.Style.createBlackCross(),

        /**
         * The style of the point when snapped to the referenced
         * edge layer.
         */
        snappedEdgeStyle: CpsiMapview.util.Style.createBlackRotatedCross(),

        /**
         * The style of the point when snapped to the referenced
         * polygon layer.
         */
        snappedPolygonStyle: CpsiMapview.util.Style.createBlackStar(),

        /**
         * The style of the snapped edge's vertices.
         */
        snappedEdgeVertexStyle: CpsiMapview.util.Style.createWhiteCircle(),

        /**
         * Pixel distance for snapping to the drawing finish (default 12)
         */
        drawInteractionSnapTolerance: 2,

        /**
         * Allows consumer of component choice of snapping to only visible layer features
         * defined in snappingLayerKeys, or snapping to layer features even if they
         * are invisible.
         */
        allowSnapToHiddenFeatures: false
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
        beforedestroy: 'onBeforeDestroy',
        tracingend: 'handleTracingResult'
    }
});
