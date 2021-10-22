Ext.define('CpsiMapview.util.MenuMixin', {
    extend: 'Ext.Mixin',
    requires: [
        'BasiGX.util.Layer',
        'CpsiMapview.view.menuitem.LayerGrid'
    ],

    showGridWindow: function (layerKey) {

        // get a layer by layer key - if this is a switch layer only one may have been loaded to the map
        // search for both and take the first layer found
        var layers = BasiGX.util.Layer.getLayersBy('layerKey', layerKey);
        var layer = layers[0];

        // reuse the logic from the menuitem to find any existing grid window, or create
        // a new one

        var menuItem = Ext.create('CpsiMapview.view.menuitem.LayerGrid', { layer: layer });
        menuItem.handlerFunc();
        menuItem.destroy();
    },

    showEditWindow: function (windowClassName, record) {
        var win = Ext.create(windowClassName);
        var vm = win.getViewModel();
        vm.set('currentRecord', record);
        win.show();
    }
});