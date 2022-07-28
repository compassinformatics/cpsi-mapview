/**
 * This is an example class for the usage of the ParallelLine toolbar.
 * A new layer will be added to the map, that contains the latest created
 * feature.
 *
 * @class CpsiMapview.view.window.ParallelLine
 */
Ext.define('CpsiMapview.view.window.ParallelLine', {
    extend: 'Ext.window.Window',
    xtype: 'cmv_parallel_line_window',

    requires: [
        'Ext.button.Button',
        'CpsiMapview.view.toolbar.ParallelLine',
        'CpsiMapview.controller.window.ParallelLine',
        'CpsiMapview.model.window.ParallelLine'
    ],

    controller: 'cmv_parallel_line_window',

    viewModel: 'cmv_parallel_line_window',

    title: 'Parallel Line Example',

    layer: null,

    items: [{
        xtype: 'button',
        text: 'Select Feature (example button)',
        enableToggle: true,
        listeners: {
            toggle: 'onSelectFeatureToggle'
        }
    }, {
        xtype: 'cmv_parallel_line_toolbar',
        bind: {
            feature: '{selectedFeature}'
        },
        listeners: {
            parallelLineCreated: 'onParallelLineCreated'
        }
    }],

    listeners: {
        beforedestroy: 'onBeforeDestroy'
    }
});
