Ext.define('CpsiMapview.controller.addWms.AddWmsFormController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_add_wms_form',

    onWmsAdd: function (olLayer) {
        var me = this;
        var map = BasiGX.util.Map.getMapComponent().getMap();

        if (this.layerGroup === undefined) {
            this.layerGroup = new ol.layer.Group({
                name: this.getView().layerGroupName,
                collapsed: false
            });
            map.addLayer(this.layerGroup);

            setTimeout(function () {
                var layerTrees = Ext.ComponentQuery.query('cmv_layertree');
                layerTrees.forEach(function (layerTree) {
                    var node = layerTree.getNodeForLayer(me.layerGroup);
                    node.expand();
                });
            }, 0);
        }

        map.removeLayer(olLayer);
        this.layerGroup.getLayers().push(olLayer);
    }
});
