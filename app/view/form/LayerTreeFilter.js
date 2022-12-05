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

    viewModel: {
        data: {
            hideInvisibleLayersLabel: 'Show visible only',
            searchTextPlaceholder: 'Search for layers',
            hideInvisibleLayers: false,
            searchText: undefined
        }
    },

    config: {
        /**
         * If baselayers shall be filtered by text filter.
         */
        doFilterBaseLayers: true,

        /**
         * If groups with no visible layer shall be hidden.
         */
        hideGroupsWithNoVisibleLayer: true
    },

    /**
     * The ID of the filter.
     */
    FILTER_ID: 'cpsi-tree-layer-filter',

    items: [{
        xtype: 'textfield',
        hideTrigger: false,
        anchor: '100%',
        maxWidth: 250,
        bind: {
            emptyText: '{searchTextPlaceholder}',
        },
        triggers: {
            clearTreeFilterText: {
                cls: 'x-form-clear-trigger',
                handler: 'clearText'
            }
        },
        listeners: {
            change: 'onSearchTextChange'
        }
    },
    {
        xtype: 'checkboxfield',
        bind: {
            boxLabel: '{hideInvisibleLayersLabel}',
        },
        listeners: {
            change: 'onCheckboxChange'
        }
    }],

    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        var mapPanel = CpsiMapview.view.main.Map.guess();
        mapPanel.on('cmv-init-layersadded', function () {
            var tree = Ext.ComponentQuery.query('cmv_layertree')[0];
            if (!tree) {
                return;
            }

            tree.on('cmv-init-layertree', function () {
                me.getController().updateFilter();
            });
        });

    }
});
