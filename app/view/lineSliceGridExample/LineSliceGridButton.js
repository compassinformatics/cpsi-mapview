Ext.define('CpsiMapview.view.lineSliceGridExample.LineSliceGridButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_line_slice_grid_button',
    text: 'Linear reference',
    enableToggle: true,
    listeners: {
        toggle: function (_, pressed) {
            if (pressed) {
                this.window = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
                    layout: 'fit',
                    width: 400,
                    height: 200,

                    items: [{
                        xtype: 'cmv_line_slice_grid'
                    }]
                });
                this.window.show();
            } else if (this.window) {
                this.window.destroy();
                this.window = null;
            }
        }
    }
});
