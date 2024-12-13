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
        'CpsiMapview.view.button.SpatialQueryButton',
        'CpsiMapview.controller.grid.Grid',
        'CpsiMapview.view.button.FeatureSelectionButton'
    ],

    mixins: ['CpsiMapview.util.ColumnMenuOrderMixin'],

    xtype: 'cmv_grid',
    controller: 'cmv_grid',
    viewModel: 'cmv_grid',

    plugins: ['gridfilters'],
    width: 1090,

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
        loadingText: 'Loading records',
        enableTextSelection: true
        //loadMask: {
        //    msg: 'Loading records' // TODO not sure why this isn't applied to the loadMask
        //}
    },

    selModel: {
        type: 'featuremodel',
        mode: 'SINGLE',
        allowDeselect: true,
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
        reconfigure: 'onColumnsReconfigure',
        clearfilters: 'clearFilters',
        applypresetfilters: 'applyPresetFilters'
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
            tooltip: 'Remove all field and spatial filters set on the grid',
            iconCls: 'x-fa fa-filter',
            handler: 'clearFilters',
            bind: {
                hidden: '{!clearFiltersVisible}'
            }
        },
        {
            xtype: 'button',
            text: 'Clear Sorting',
            tooltip: 'Clear any custom sorting of the grid',
            iconCls: 'x-fa fa-align-justify',
            handler: 'onClearSort'
        },
        {
            xtype: 'button',
            text: 'Apply Preset Filters',
            tooltip: 'Re-apply any default filters that have been configured for the grid',
            iconCls: 'x-fa fa-star',
            handler: 'applyPresetFilters',
            bind: {
                hidden: '{!usePresetFilters}'
            }
        },
        '->',
        {
            xtype: 'buttongroup',
            bind: {
                hidden: '{!useSimpleSelection}'
            },
            items: [{
                xtype: 'cmv_spatial_query_button',
                drawGeometryType: 'Polygon',
                text: 'Select by Shape',
                spatialOperator: 'intersect',
                toggleGroup: 'map',
                triggerWfsRequest: false,
                displayPermanently: true,
                iconCls: 'x-fa fa-pencil-alt',
                listeners: {
                    'cmv-spatial-query-filter': 'onSpatialFilter'
                }
            },
            {
                xtype: 'button',
                text: 'Clear',
                tooltip: 'Clear the spatial filter',
                iconCls: 'x-fa fa-times-circle',
                handler: 'onClearSpatialFilter'
            }]
        },

        {
            xtype: 'buttongroup', // segmentedbutton does not support toggleGroup
            bind: {
                hidden: '{!useAdvancedSelection}'
            },
            items: [
                {
                    xtype: 'cmv_spatial_query_button',
                    drawGeometryType: 'Polygon',
                    text: 'Select by Shape',
                    spatialOperator: 'intersect',
                    toggleGroup: 'map',
                    triggerWfsRequest: false,
                    displayPermanently: true,
                    iconCls: 'x-fa fa-pencil-alt',
                    listeners: {
                        'cmv-spatial-query-filter': 'onSpatialFilter'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Clear',
                    tooltip: 'Clear the spatial filter',
                    iconCls: 'x-fa fa-times-circle',
                    handler: 'onClearSpatialFilter'
                },
                {
                    xtype: 'cmv_feature_selection_button',
                    triggerWfsRequest: false,
                    allowMultiple: true,
                    toggleGroup: 'map',
                    bind: {
                        vectorLayerKey: '{featureSelectionLayerKey}'
                    },
                    iconCls: 'x-fa fa-mouse-pointer',
                    listeners: {
                        'cmv-reset-grid-filters': 'resetFilters',
                        'cmv-id-filter-set': 'onIdFilterSet'
                    }
                }
            ]
        },
        {
            xtype: 'button',
            bind: {
                pressed: '{isGroupEditingEnabled}',
                hidden: '{!isGroupEditingVisible}'
            },
            text: 'Group Edit',
            enableToggle: true,
            iconCls: 'x-fa fa-pencil-alt',
            tooltip: 'Update a field in the grid for multiple records',
            toggleHandler: 'onGroupEditToggle'
        },
        {
            xtype: 'button',
            text: 'Export to Excel',
            iconCls: 'x-far fa-file-excel',
            tooltip: 'Export the records that are visible in the grid to an Excel file',
            handler: 'exportToExcel',
            bind: {
                hidden: '{!exportExcelVisible}'
            }
        },
        {
            xtype: 'button',
            text: 'Data Exports',
            tooltip: 'Export all records in the grid to a zip file',
            bind: {
                hidden: '{!exportShapefileVisible}'
            },
            menu: [{
                text: 'Export to Shapefile',
                iconCls: 'fg-shape-file',
                handler: 'exportToShapefile'
            }, {
                text: 'Export to Excel',
                iconCls: 'x-fa fa-file-excel',
                handler: 'exportToServerExcel'
            }]
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
    }]
});
