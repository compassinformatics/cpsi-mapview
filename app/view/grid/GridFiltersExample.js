/**
 * Example classes for a CpsiMapview.view.grid.Grid grid
 */

const storeConfig = {
    type: 'array',
    fields: ['name'],
    data: [
        ['Carlow'],
        ['Cavan'],
        ['Clare'],
        ['Cork City'],
        ['Cork County'],
        ['DLRCC'],
        ['Donegal County Council'],
        ['Dublin City'],
        ['Fingal'],
        ['Galway City'],
        ['Galway County'],
        ['Kerry'],
        ['Kildare'],
        ['Kilkenny CC'],
        ['Laois'],
        ['Leitrim'],
        ['Limerick'],
        ['Longford'],
        ['Louth'],
        ['Mayo'],
        ['Meath'],
        ['Monaghan'],
        ['Offaly'],
        ['Roscommon CC'],
        ['Sligo'],
        ['South Dublin Co Co'],
        ['Tipperary'],
        ['Waterford'],
        ['Westmeath'],
        ['Wexford'],
        ['Wicklow']
    ]
};

// define the model
Ext.define('CpsiMapview.model.GridFiltersExample', {
    extend: 'GeoExt.data.model.Feature',
    idProperty: 'OBJECTID',
    fields: [
        {
            name: 'Unique_ID',
            type: 'string'
        },
        {
            name: 'GREENFIELD',
            type: 'string'
        },
        {
            name: 'AUTHORITY',
            type: 'string'
        },
        {
            name: 'Location',
            type: 'string'
        },
        {
            name: 'Calc_Area',
            type: 'float'
        }
    ]
});

// create the store
Ext.define('CpsiMapview.store.GridFiltersExample', {
    extend: 'CpsiMapview.store.WfsFeatures',
    alias: 'store.GridFiltersExample',
    url: 'https://mapserver.compass.ie/mapserver/?map=/MapServer/apps/mapview-demo/example.map&',
    storeId: 'GridFiltersExample',
    requestMethod: 'POST',
    //srsName: 'epsg:2157',
    model: 'CpsiMapview.model.GridFiltersExample',
    typeName: 'lasites',
    layerOptions: {
        displayInLayerSwitcher: false,
        name: 'GridFiltersExampleLayer'
    },
    sorters: [
        {
            property: 'OBJECTID',
            direction: 'ASC'
        }
    ]
});

// create the view model
Ext.define('CpsiMapview.view.grid.GridFiltersExampleModel', {
    extend: 'CpsiMapview.model.grid.Grid',
    alias: 'viewmodel.filtersexample_grid',
    data: {
        wmsLayerKey: 'LA_SITES',
        gridStoreType: 'GridFiltersExample',
        gridLayerName: 'GridFiltersExampleLayer', // TODO this is duplicated in layerOptions above
        helpUrl:
            'https://github.com/compassinformatics/cpsi-mapview/blob/master/app/view/grid/ExampleGrid.js'
    }
});

// create the grid view
Ext.define('CpsiMapview.view.grid.GridFiltersExample', {
    extend: 'CpsiMapview.view.grid.Grid',
    xtype: 'cmv_filtersexamplegrid',
    controller: 'cmv_grid',
    viewModel: 'filtersexample_grid',
    columns: {
        items: [
            {
                text: 'Id',
                dataIndex: 'OBJECTID', // case-sensitive
                xtype: 'numbercolumn',
                filter: {
                    type: 'number'
                }
            },
            {
                text: 'Unique ID',
                dataIndex: 'Unique_ID',
                flex: 2,
                filter: {
                    type: 'string'
                }
            },
            {
                text: 'Greenfield?',
                dataIndex: 'GREENFIELD',
                flex: 2,
                filter: {
                    type: 'string'
                }
            },
            {
                text: 'LA',
                dataIndex: 'AUTHORITY',
                flex: 1,
                filter: {
                    type: 'list',
                    dataIndex: 'AUTHORITY',
                    labelField: 'name',
                    idField: 'name',
                    store: storeConfig
                }
            },
            {
                text: 'Location',
                dataIndex: 'Location',
                flex: 1,
                filter: {
                    type: 'string'
                }
            },
            {
                text: 'Area',
                dataIndex: 'Calc_Area',
                flex: 1,
                xtype: 'numbercolumn',
                filter: {
                    type: 'number'
                }
            }
        ]
    }
});
