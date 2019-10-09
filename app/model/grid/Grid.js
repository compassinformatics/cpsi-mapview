Ext.define('CpsiMapview.model.grid.Grid', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_grid',

    requires: [
        'BasiGX.util.Map'
    ],

    data: {
        vectorLayerKey: null,
        wmsLayerKey: null,
        gridStoreType: null
    },

    formulas: {
        map: function () {
            return BasiGX.util.Map.getMapComponent().map;
        },
        selectStyle: { // TODO - cannot bind this at the moment
            get: function () {
                return new ol.style.Circle({
                    radius: 2,
                    stroke: new ol.style.Stroke({
                        color: '#0ff',
                        width: 2
                    })
                });
            }
        }
    }
});
