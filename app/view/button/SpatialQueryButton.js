/**
 * This class is the select by polygon button button of cpsi mapview application
 * It can be used e.g. query a layer by a drawn polygon
 */
/**
 * Select by polygon button TODO: !!
 *
 * @class CpsiMapview.view.button.SpatialQueryButton
 */
Ext.define('CpsiMapview.view.button.SpatialQueryButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_spatial_query_button',

    requires: [
        'CpsiMapview.model.button.SpatialQueryButton',
        'CpsiMapview.controller.button.SpatialQueryButtonController'
    ],

    /**
     * The viewModel for this class
     */
    viewModel: 'cmv_spatial_query_btn',

    /**
     * The controller for this class
     */
    controller: 'cmv_spatial_query_btn',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'spatialQueryBtn',

    /**
     * The type of the geomety to graw / query with
     * (Polygon, LineString, Point)
     * Will be ignored if spatialOperator === 'bbox'
     */
    drawGeometryType: null,

    /**
     * Te type of spatial operato to use, see GeoExt.util.OGCFilter.
     *                               topologicalOrSpatialFilterOperators
     */
    spatialOperator: null,

    /**
     * The name of the layer to query
     */
    queryLayerName: null,

    /**
     * The layer to query
     */
    queryLayer: null,

    /**
     * The drawn feature to query with
     */
    queryFeature: new ol.Collection(),

    /**
     * Enable toggle
     */
    enableToggle: true,

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onSpatialQueryBtnToggle'
    },

    bind: {
        tooltip: '{tooltip}'
    },

    /**
     * Initializes this component
     */
    initComponent: function () {
        var me = this;

        // set map
        me.map = BasiGX.util.Map.getMapComponent().getMap();
        me.callParent();
    }

});
