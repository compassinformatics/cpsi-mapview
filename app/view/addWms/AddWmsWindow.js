Ext.define('CpsiMapview.view.addWms.AddWmsWindow', {
    xtype: 'cmv_add_wms_window',

    extend: 'Ext.window.Window',
    hidden: true,

    controller: 'cmv_add_wms_window',

    requires: [
        'CpsiMapview.controller.addWms.AddWmsWindowController',
        'CpsiMapview.view.addWms.AddWmsForm'
    ],
    items: [
        {
            xtype: 'cmv_add_wms_form'
        }
    ],

    closeAction: 'hide'
});
