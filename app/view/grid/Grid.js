/**
 * Base class for WFS-based data grids with filtering
 * and Excel exports.
 */
Ext.define('CpsiMapview.view.grid.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.toolbar.Paging',
        'Ext.grid.plugin.Exporter',
        'GeoExt.toolbar.WfsPaging',
        'GeoExt.selection.FeatureModel',
        'BasiGX.util.Layer',
        'CpsiMapview.view.button.SpatialQueryButton',
        'Ext.exporter.excel.Xlsx' // from the Sencha Premium package
    ],

    xtype: 'cmv_grid',
    controller: 'cmv_grid',
    viewModel: 'cmv_grid',

    plugins: ['gridfilters', 'gridexporter'],
    width: 1050,

    bind: {
        store: '{gridstore}'
    },

    viewConfig: {  //this config is passed to the view
        loadMask: {
            msg: 'Loading records' // TODO not sure why this isn't applied to the loadMask
        }
    },

    selModel: {
        type: 'featuremodel',
        mode: 'SINGLE',
        mapSelection: true,
        selectStyle: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                stroke: new ol.style.Stroke({
                    color: '#0ff',
                    width: 3
                })
            })
        }),
        bind: {
            map: '{map}'
            // TODO can't bind to a formula in the ViewModel
            //selectStyle: '{selectStyle}'
        }
    },

    /**
    * Functions attached to various listeners on the grid
    */
    listeners: {
        rowdblclick: 'onRowDblClick',
        filterchange: 'filterAssociatedLayers',
        itemcontextmenu: 'onItemContextMenu',
        documentsave: 'onDocumentSave'
    },

    /**
    * Collection of tools and buttons at the top of the grid
    */
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'gx_wfspaging_toolbar',
                displayInfo: true,
                bind: {
                    store: '{gridstore}'
                }
            }, {
                xtype: 'checkbox',
                checked: true,
                boxLabel: 'Page Records?',
                handler: 'togglePaging'
            },
            '->',
            {
                xtype: 'cmv_spatial_query_button',
                drawGeometryType: 'Polygon',
                spatialOperator: 'intersect',
                toggleGroup: 'map',
                triggerWfsRequest: false,
                glyph: 'xf044@FontAwesome',
                listeners: {
                    'cmv-spatial-query-filter': 'onSpatialFilter'
                }
            },
            {
                xtype: 'button',
                text: 'Clear Filters',
                handler: 'clearFilters'
            },
            {
                xtype: 'button',
                glyph: 'xf1c3@FontAwesome',
                handler: 'exportToExcel'
            }]
    }]
});
