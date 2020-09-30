Ext.define('CpsiMapview.controller.addWms.AddWmsWindowController', {
    extend: 'CpsiMapview.controller.window.MinimizableWindow',

    alias: 'controller.cmv_add_wms_window',

    constructor: function () {
        this.setupListener();
    },

    setupListener: function () {
        var me = this;
        var layerTrees = Ext.ComponentQuery.query('cmv_layertree');
        layerTrees.forEach(function (layerTree) {
            layerTree.on('addWmsClick', function () {
                me.getView().setHidden(false);
            });
        });
    }
});
