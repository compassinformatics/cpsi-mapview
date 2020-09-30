Ext.define('CpsiMapview.view.addWms.AddWmsForm', {
    xtype: 'cmv_add_wms_form',

    extend: 'BasiGX.view.form.AddWms',

    controller: 'cmv_add_wms_form',

    layerGroupName: 'External Layers',

    listeners: {
        wmsadd: 'onWmsAdd'
    }
});
