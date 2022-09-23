/**
 * This is an example class for the usage of the ParallelLine toolbar.
 * A new layer will be added to the map, that contains the latest created
 * feature.
 *
 * @class CpsiMapview.view.window.ParallelLineWindow
 */
Ext.define('CpsiMapview.view.window.ParallelLineWindow', {
    extend: 'Ext.window.Window',
    xtype: 'cmv_parallel_line_window',

    requires: [
        'Ext.button.Button',
        'CpsiMapview.view.toolbar.ParallelLineToolbar',
        'CpsiMapview.controller.window.ParallelLineWindow',
        'CpsiMapview.model.window.ParallelLineWindow'
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
