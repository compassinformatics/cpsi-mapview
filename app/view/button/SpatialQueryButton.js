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

    statics: {
        /**
         * Finds the associated permanent layer of a layer that is
         * used for the spatial query. This is done by comparing the
         * layerKey of the layer to the associatedLayerKey property
         * of the permanent layer.
         * @param {ol.Map} map the map in which to look for the layer
         * @param {String} layerKey layerKey property of the layer
         */
        findAssociatedPermanentLayer: function (map, layerKey) {
            var layers = map.getLayers().getArray();
            var associatedPermanentLayer = layers.find(function (layer) {
                var isSpatialQueryLayer = layer.get('isSpatialQueryLayer');
                var associatedLayerKey = layer.get('associatedLayerKey');
                return isSpatialQueryLayer && (associatedLayerKey === layerKey);
            });
            return associatedPermanentLayer;
        },

        /**
         * Clears the geometries of the associated permanent
         * layer of a layer that is used for the spatial query.
         * @param {ol.Map} map the map in which to look for the layer
         * @param {String} layerKey layerKey property of the layer
         */
        clearAssociatedPermanentLayer: function (map, layerKey) {
            var associatedPermanentLayer = CpsiMapview.view.button.SpatialQueryButton.findAssociatedPermanentLayer(map, layerKey);
            if (associatedPermanentLayer !== undefined) {
                associatedPermanentLayer.getSource().clear();
            }
        },

        /**
         * Shows the associated permanent layer of a layer that
         * is used for the spatial query.
         * @param {ol.Map} map the map in which to look for the layer
         * @param {String} layerKey layerKey property of the layer
         */
        showAssociatedPermanentLayer: function (map, layerKey) {
            var associatedPermanentLayer = CpsiMapview.view.button.SpatialQueryButton.findAssociatedPermanentLayer(map, layerKey);
            if (associatedPermanentLayer !== undefined) {
                associatedPermanentLayer.setVisible(true);
            }
        },

        /**
         * Hides the associated permanent layer of a layer that
         * is used for the spatial query.
         * @param {ol.Map} map the map in which to look for the layer
         * @param {String} layerKey layerKey property of the layer
         */
        hideAssociatedPermanentLayer: function (map, layerKey) {
            var associatedPermanentLayer = CpsiMapview.view.button.SpatialQueryButton.findAssociatedPermanentLayer(map, layerKey);
            if (associatedPermanentLayer !== undefined) {
                associatedPermanentLayer.setVisible(false);
            }
        },
    },

    config: {
        /**
         * The name of the layer to query
         * This property will be ignored if queryLayer is defined
         */
        queryLayerName: null,

        /**
         * The layerKey property of the layer to query
         */
        vectorLayerKey: null
    },

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
     * The layer to query
     */
    queryLayer: null,

    /**
     * The drawn feature to query with
     */
    queryFeatures: new ol.Collection(),

    /**
     * If true, the filter geometry will be displayed until filter was cleared
     * If false, the filter geometry will disappear after filtering
     */
    displayPermanently: false,

    /**
     * Enable toggle
     */
    enableToggle: true,

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onSpatialQueryBtnToggle',
        clearAssociatedPermanentLayer: 'onClearAssociatedPermanentLayer',
        hideAssociatedPermanentLayer: 'onHideAssociatedPermanentLayer',
        showAssociatedPermanentLayer: 'onShowAssociatedPermanentLayer',
        beforedestroy: 'onBeforeDestroy'
    },

    bind: {
        tooltip: '{tooltip}'
    },

    /**
    * If set to true a Wfs GetFeatures request will be automatically triggered
    *
    * @cfg {Boolean} triggerWfsRequest Whether or not to trigger a Wfs GetFeatures request
    */
    triggerWfsRequest: true

});
