﻿Ext.define('CpsiMapview.util.MenuMixin', {
    extend: 'Ext.Mixin',
    requires: [
        'BasiGX.util.Layer',
        'CpsiMapview.view.menuitem.LayerGrid'
    ],

    mixins: ['CpsiMapview.util.EditWindowOpenerMixin'],

    showGridWindow: function (layerKey, titleOverride) {

        // get a layer by layer key - if this is a switch layer only one may have been loaded to the map
        // search for both and take the first layer found
        var layers = BasiGX.util.Layer.getLayersBy('layerKey', layerKey);
        var layer = layers[0];

        // reuse the logic from the menuitem to find any existing grid window, or create
        // a new one

        var menuItem = Ext.create('CpsiMapview.view.menuitem.LayerGrid', { layer: layer, titleOverride: titleOverride });
        menuItem.handlerFunc();
        menuItem.destroy();
    },

    showEditWindow: function (windowClassName, record) {

        var me = this;
        var win = me.getEditingFormWindow(record, windowClassName);
        var vm = win.getViewModel();

        // if the window already exists then do not overwrite any
        // changes that may have been made to the model
        if (!vm.get('currentRecord')) {
            // for a new window set the currentRecord to the model
            vm.set('currentRecord', record);
        }

        win.show();
        Ext.WindowManager.bringToFront(win);
    }
});
