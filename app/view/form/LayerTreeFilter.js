/**
 * Panel with filtering tools for the layer tree.
 *
 * @class CpsiMapview.view.from.LayerTreeFilter
 */
Ext.define('CpsiMapview.view.form.LayerTreeFilter', {
    extend: 'Ext.form.FieldSet',

    xtype: 'cmv_layertreefilter',

    requires: [
        'CpsiMapview.controller.form.LayerTreeFilter'
    ],

    controller: 'cmv_layertreefilter',

    config: {
        /**
         * If baselayes shall be filtered by text filter.
         */
        doFilterBaseLayers: true
    },

    /**
     * The ID of the filter created by the text field.
     */
    TEXT_FILTER_ID: 'cpsi-tree-layer-text-filter',

    /**
     * The ID of the filter created by the checkbox.
     */
    VISIBLE_LAYER_FILTER_ID: 'cpsi-tree-visible-layer-filter',

    items: [{
        xtype: 'textfield',
        emptyText: 'Search for layers',
        hideTrigger: true,
        anchor: '100%',
        maxWidth: 250,
        triggers: {
            clearText: {
                cls: 'x-form-clear-trigger',
                handler: function () {
                    this.setValue('');
                }
            }
        },
        listeners: {
            change: 'onSearch'
        }
    },
    {
        xtype: 'checkboxfield',
        boxLabel: 'Show Visible',
        listeners: {
            change: 'filterVisibleLayers'
        }
    }]
});
