/**
 * Base class for WFS-based data grids with filtering
 * and Excel exports.
 */
Ext.define('CpsiMapview.view.grid.Grid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.toolbar.Paging',
        'GeoExt.toolbar.WfsPaging',
        'GeoExt.selection.FeatureModel',
        'BasiGX.util.Layer',
        'CpsiMapview.view.button.SpatialQueryButton',
        'CpsiMapview.controller.grid.Grid'
    ],

    xtype: 'cmv_grid',
    controller: 'cmv_grid',
    viewModel: 'cmv_grid',

    plugins: ['gridfilters'],
    width: 1050,

    /**
     * The distance used to buffer a feature when the zoomToFeature
     * function is used
     * @cfg {Number}
     */
    extentBuffer: 100,

    /**
     * The title added to the Excel document
     * @cfg {String}
     */
    exportTitle: 'Records Export',

    /**
    * The filename of the Excel export
    * @cfg {String}
    */
    exportFileName: 'RecordsExport.xlsx',

    bind: {
        store: '{gridstore}'
    },

    viewConfig: {  //this config is passed to the view
        loadingText: 'Loading records'
        //loadMask: {
        //    msg: 'Loading records' // TODO not sure why this isn't applied to the loadMask
        //}
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
            }),
            stroke: new ol.style.Stroke({
                width: 3,
                color: '#0ff'
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
        filterchange: 'updateAssociatedLayers',
        itemcontextmenu: 'onItemContextMenu',
        columnhide: 'onColumnHide',
        columnshow: 'onColumnShow',
        rowdblclick: 'onRowDblClick',
        // ensure columns are set when the store is bound to the grid
        reconfigure: 'onColumnsReconfigure'
    },

    /**
    * Collection of tools and buttons at the top of the grid
    */
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            text: 'Clear Filters',
            glyph: 'f0b0@FontAwesome',
            handler: 'clearFilters'
        },
        {
            xtype: 'button',
            text: 'Clear Sorting',
            glyph: 'f039@FontAwesome',
            handler: 'onClearSort'
        }, '->',
        {
            xtype: 'cmv_spatial_query_button',
            drawGeometryType: 'Polygon',
            text: 'Select by Shape',
            spatialOperator: 'intersect',
            toggleGroup: 'map',
            triggerWfsRequest: false,
            displayPermanently: true,
            glyph: 'xf044@FontAwesome',
            listeners: {
                'cmv-spatial-query-filter': 'onSpatialFilter'
            }
        },
        {
            xtype: 'button',
            bind: {
                pressed: '{isGroupEditingEnabled}',
                hidden: '{!isGroupEditingVisible}'
            },
            text: 'Group Edit',
            enableToggle: true,
            glyph: 'xf040@FontAwesome',
            toggleHandler: 'onGroupEditToggle'
        },
        {
            xtype: 'button',
            text: 'Export to Excel',
            glyph: 'xf1c3@FontAwesome',
            handler: 'exportToExcel'
        }]
    },
    {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
            {
                xtype: 'gx_wfspaging_toolbar',
                displayInfo: true,
                bind: {
                    store: '{gridstore}'
                }
            },
            {
                xtype: 'checkbox',
                itemId: 'pagingCheckbox',
                checked: true,
                boxLabel: 'Page Records?',
                handler: 'togglePaging'
            }]
    }],
});
