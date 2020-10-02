/**
 * This class is the button of cpsi mapview application that can be used to
 * ...
 *
 * @class CpsiMapview.view.button.SpatialQueryButton
 */
Ext.define('CpsiMapview.view.button.FeatureSelectionButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_feature_selection_button',

    requires: [
        // 'CpsiMapview.model.button.SpatialQueryButton',
        'CpsiMapview.controller.button.FeatureSelectionButtonController'
    ],

    statics: {
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
    // viewModel: 'cmv_spatial_query_btn',

    /**
     * The controller for this class
     */
    controller: 'cmv_feature_selection_btn',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'featureSelectionBtn',

    /**
     * The layer to query
     */
    queryLayer: null,

    /**
     * The name of the layer to query
     * This property will be ignored if queryLayer is defined
     */
    //TODO set to null
    queryLayerName: 'Ruins',

    /**
     * Enable toggle
     */
    enableToggle: true,

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onBtnToggle',
    },

    bind: {
        tooltip: '{tooltip}'
    },


    /**
     * Initializes this component
     */
    initComponent: function () {
        var me = this;
        me.callParent();
    }

});
