Ext.define('CpsiMapview.view.lineSliceGridExample.LineSliceGridWindow', {
    extend: 'CpsiMapview.view.window.MinimizableWindow',
    xtype: 'cmv_line_slice_grid_window',

    hidden: true,
    closeAction: 'hide',
    layout: 'fit',
    width: 400,
    height: 200,

    items: [
        {
            xtype: 'cmv_line_slice_grid'
        }
    ]
});
