/**
 * Example classes for a CpsiMapview.view.grid.Grid grid
 */

// define the model
Ext.define('CpsiMapview.model.GridExample', {
    requires: 'GeoExt.data.model.Feature',
    extend: 'GeoExt.data.model.Feature',
    idProperty: 'EquipmentId',
    fields: [
        {
            name: 'UnitTypeName',
            type: 'string'
        },
        {
            name: 'EquipmentId',
            type: 'integer'
        }
    ]
});

// create the store
Ext.define('CpsiMapview.store.GridExample', {
    extend: 'CpsiMapview.store.WfsFeatures',
    alias: 'store.GridExample',
    url: 'https://plmonaghandev.compass.ie/mapserver/?',
    storeId: 'GridExample',
    model: 'CpsiMapview.model.GridExample',
    typeName: 'LightUnit',
    layerOptions: {
        displayInLayerSwitcher: false,
        name: 'GridExampleLayer'
    },
    sorters: [{
        property: 'EquipmentId',
        direction: 'ASC'
    }]
});

// create the view model
Ext.define('CpsiMapview.view.grid.ExampleGridModel', {
    extend: 'CpsiMapview.model.grid.Grid',
    alias: 'viewmodel.example_grid',
    data: {
        vectorLayerKey: 'LIGHT_UNIT_MVT',
        gridStoreType: 'GridExample',
        gridLayerName: 'GridExampleLayer' // TODO this is duplicated in layerOptions above
    }
});

// create the grid view
Ext.define('CpsiMapview.view.grid.ExampleGrid', {
    extend: 'CpsiMapview.view.grid.Grid',
    xtype: 'cmv_examplegrid',
    controller: 'cmv_grid',
    viewModel: 'example_grid',
    columns: {
        items: [
            {
                text: 'Id',
                dataIndex: 'EquipmentId', // case-sensitive
                filter: {
                    type: 'number'
                }
            },
            {
                text: 'Type',
                dataIndex: 'UnitTypeName',
                flex: 1,
                filter: {
                    type: 'string'
                }
            }
        ]
    }
});
