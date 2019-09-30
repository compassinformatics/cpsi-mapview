/**
 * This class is the button of cpsi mapview application that can be used to
 * query an assigned layer by a drawn geometry. After the button is toggled,
 * a draw interaction is activated on the map to define the query geometry.
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
     * The type of the geometry to draw / query with
     * (Polygon, LineString, Point)
     * Will be ignored if spatialOperator === 'bbox'
     */
    drawGeometryType: null,

    /**
     * The type of spatial operator to use, see GeoExt.util.OGCFilter.
     *                               topologicalOrSpatialFilterOperators
     */
    spatialOperator: null,

    /**
     * The name of the layer to query
     * This property will be ignored if queryLayer is defined
     */
    queryLayerName: null,

    /**
     * The layer to query
     */
    queryLayer: null,

    /**
     * The drawn feature to query with
     */
    queryFeatures: new ol.Collection(),

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
    * If set to true a Wfs GetFeatures request will be automatically triggered
    *
    * @cfg {Boolean} triggerWfsRequest Whether or not to trigger a Wfs GetFeatures request
    */
    triggerWfsRequest: true,
    /**
     * Initializes this component
     */
    initComponent: function () {
        var me = this;
        me.callParent();
    }

});
