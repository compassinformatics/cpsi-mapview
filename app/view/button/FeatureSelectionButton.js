/**
 * This class represents a button, which is mainly used within a feature grid
 * (CpsiMapview.view.grid.Grid) and allows the user to select features on the
 * map by clicking when the button is pressed.
 * For selection the ID of the clicked feature is detected and forwarded to the
 * owner grid and its underlying WFS store.
 *
 * @class CpsiMapview.view.button.FeatureSelectionButton
 */
Ext.define('CpsiMapview.view.button.FeatureSelectionButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_feature_selection_button',

    requires: [
        'CpsiMapview.controller.button.FeatureSelectionButtonController'
    ],

    statics: {
    },

    config: {
        /**
         * The layerKey property of the layer to query
         */
        vectorLayerKey: null
    },

    viewModel: {
        data: {
            text: 'Select',
            tooltip: 'Select features on the map by click.',
            addToSelectionLabel: 'Add to Selection',
            newSelectionLabel: 'New Selection'
        }
    },

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
     * Flag steering if a message is showm if no features are selected
     */
    showNoSelectionMessage: true,

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
        text: '{text}',
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
