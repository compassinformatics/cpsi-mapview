Ext.define('CpsiMapview.view.lineSliceGridExample.LineSliceGridButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_line_slice_grid_button',
    text: 'Linear reference',
    handler: function () {
        var lineSliceGridWindow = Ext.ComponentQuery.query('cmv_line_slice_grid_window')[0];
        lineSliceGridWindow.show();
    }
});
