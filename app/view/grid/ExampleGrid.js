/**
 * Example classes for a CpsiMapview.view.grid.Grid grid
 */

// define the model
Ext.define('CpsiMapview.model.GridExample', {
    extend: 'GeoExt.data.model.Feature',
    idProperty: 'osm_id',
    fields: [
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'fclass',
            type: 'string'
        },
        {
            name: 'osm_id',
            type: 'integer'
        }
    ]
});

// create the store
Ext.define('CpsiMapview.store.GridExample', {
    extend: 'CpsiMapview.store.WfsFeatures',
    alias: 'store.GridExample',
    url: 'https://mapserver.compass.ie/mapserver/?map=/MapServer/apps/mapview-demo/example.map&',
    storeId: 'GridExample',
    requestMethod: 'POST',
    model: 'CpsiMapview.model.GridExample',
    typeName: 'ruins',
    layerOptions: {
        name: 'GridExampleLayer'
    },
    sorters: [{
        property: 'osm_id',
        direction: 'ASC'
    }]
});

// create the view model
Ext.define('CpsiMapview.view.grid.ExampleGridModel', {
    extend: 'CpsiMapview.model.grid.Grid',
    alias: 'viewmodel.example_grid',
    data: {
        vectorLayerKey: 'RUINS_WFS',
        featureSelectionLayerKey: 'RUINS_SELECTION_WFS',
        allowFeatureSelection: true, // allow the additional selection by point
        gridStoreType: 'GridExample',
        gridLayerName: 'GridExampleLayer', // TODO this is duplicated in layerOptions above
        helpUrl: 'https://github.com/compassinformatics/cpsi-mapview/blob/master/app/view/grid/ExampleGrid.js'
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
                dataIndex: 'osm_id', // case-sensitive
                filter: {
                    type: 'number'
                }
            },
            {
                text: 'Code',
                dataIndex: 'code',
                flex: 2,
                filter: {
                    type: 'number'
                }
            },
            {
                text: 'Class',
                dataIndex: 'fclass',
                flex: 2,
                filter: {
                    type: 'string'
                }
            },
            {
                text: 'Name',
                dataIndex: 'name',
                flex: 1,
                filter: {
                    type: 'string'
                }
            }
        ]
    }
});
