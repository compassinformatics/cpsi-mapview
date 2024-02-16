/**
 * This class is the controller for the cpsi mapview WFS
 * generic grid class
 *
 */
Ext.define('CpsiMapview.controller.grid.Grid', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_grid',

    requires: [
        'Ext.menu.Menu',
        'Ext.grid.filters.Filters',
        'GeoExt.util.OGCFilter',
        'BasiGX.util.Layer',
        'CpsiMapview.util.WmsFilter',
        'CpsiMapview.util.Layer'
    ],

    listen: {
        component: {
            '#': {
                hide: 'onWindowHidden',
                show: 'onWindowShown'
            }
        }
    },

    mixins: {
        zoomer: 'CpsiMapview.util.ZoomerMixin'
    },

    /**
     * The currently active spatial filter for the layer.
     *
     * @cfg {Ext.util.Filter} spatialFilter
     */
    spatialFilter: null,

    /**
     * Open a row-level context-menu with a Zoom to Feature option
     * @private
     */
    onItemContextMenu: function (grid, record, item, index, evt) {
        var me = this;
        var vm = me.getViewModel();
        var map = vm.get('map');
        var isSpatial = vm.get('isSpatialGrid');

        // currently there is only one context-menu tool
        // and it is spatial-related
        // if more tools are added then remove this guard
        if (!isSpatial) {
            return;
        }

        var contextMenu = Ext.create('Ext.menu.Menu', {
            defaults: {
                clickHideDelay: 1
            },
            items: [{
                text: 'Zoom to Feature',
                hidden: !isSpatial,
                handler: function () {
                    me.zoomToFeature(record.getFeature(), map);
                }
            }],
            listeners: {
                hide: {
                    fn: function (menu) {
                        menu.destroy();
                    }
                }
            }
        });

        evt.stopEvent();
        contextMenu.showAt(evt.pageX, evt.pageY);
    },

    /**
     * Find a layer in the map based on its unique and custom layerKey
     * property
     *
     * @param {string} key
     * @private
     */
    getLayerByKey: function (key) {
        var layers = BasiGX.util.Layer.getLayersBy('layerKey', key);

        if (layers && layers.length === 1) {
            return layers[0];
        }
    },

    /**
     * Applies both attribute and spatial filters to
     * any associated WMS and vector layer and reloads both
     * If filters have not been modified the WMS layer is not updated unless forced
     *
     * @private
     * @param {Boolean} force True to force a WMS refresh (required if underlying data has changed)
     */
    updateAssociatedLayers: function (force) {

        var me = this;
        var grid = me.getView();
        var viewModel = me.getViewModel();

        var store = grid.getStore();
        var filters = Ext.clone(store.getFilters().items); // otherwise the actual grid filters are modified
        var wmsLayer = me.getLayerByKey(viewModel.get('wmsLayerKey'));

        // also check for MVT layer keys
        if (!wmsLayer) {
            wmsLayer = me.getLayerByKey(viewModel.get('vtwmsLayerKey'));
        }

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        if (me.idFilter) {
            filters.push(me.idFilter);
        }

        if (wmsLayer) {

            var wmsFilterUtil = CpsiMapview.util.WmsFilter;
            var wmsSource = wmsLayer.getSource();
            var wmsParams = wmsFilterUtil.getWmsParams(wmsLayer);

            // save the current filter string to see if the filter has changed
            var originalFilterString = wmsParams.FILTER || '';

            // set any new filter
            if (filters && filters.length > 0) {
                var ogcFilters = CpsiMapview.util.Layer.convertAndCombineFilters(filters);
                wmsParams.FILTER = GeoExt.util.OGCFilter.combineFilters(ogcFilters, 'And', true, '1.1.0');
            } else {
                wmsParams.FILTER = ''; // ensure the filter is reset if no filters are set
            }

            // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
            var wmsFilterString = wmsFilterUtil.getWmsFilterString(wmsParams);

            // if the filters have not changed then we do not need to refresh
            // unless the underlying data has changed and force is used
            if (force === true || originalFilterString !== wmsFilterString) {

                var newParams = {
                    FILTER: wmsFilterString,
                    TIMESTAMP: Ext.Date.now()
                };

                if (wmsLayer.get('isVt') === true) {
                    CpsiMapview.util.Layer.updateVectorTileParameters(wmsLayer, newParams);
                } else {
                    wmsSource.updateParams(newParams);
                }
            }
            // keep a reference to the raw filters so they can be applied to the vector layer
            // when switching
            wmsSource.set('additionalFilters', filters);
            CpsiMapview.util.Layer.updateLayerNodeUI(wmsLayer);
        }

        var vectorLayer = me.getLayerByKey(viewModel.get('vectorLayerKey'));

        if (vectorLayer) {
            var vectorSource = vectorLayer.getSource();

            if (vectorSource instanceof ol.source.Cluster) {
                vectorSource = vectorSource.getSource(); // we use the raw source
            }

            if (force === true) {
                vectorSource.set('timestamp', Ext.Date.now());
            }

            vectorSource.set('additionalFilters', filters);
            vectorSource.refresh();
            CpsiMapview.util.Layer.updateLayerNodeUI(vectorLayer);
        }

    },

    /**
     * Create WFS filters for the store
     * */
    createStoreFilters: function (store) {

        var me = this;
        var wfsGetFeatureFilter = '';

        var filters = Ext.clone(store.getFilters().items);

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        if (me.idFilter) {
            filters.push(me.idFilter);
        }

        if (filters.length > 0) {
            var ogcFilters = CpsiMapview.util.Layer.convertAndCombineFilters(filters);
            wfsGetFeatureFilter = GeoExt.util.OGCFilter.combineFilters(ogcFilters, 'And', true, '2.0.0');
        }

        return wfsGetFeatureFilter;
    },

    /**
     * Apply any spatial filter to the store request, and convert all
     * ExtJS filters to WFS filters.
     * Also set a loading mask on the grid.
     *
     * @private
     */
    onWfsStoreBeforeLoad: function (store, params) {

        // handle the loadMask ourselves due to various issues around data binding and reconfiguring stores
        // https://www.sencha.com/forum/showthread.php?299670-ExtJS-5.1.0-LoadMask-missing-on-grids-with-bound-store&p=1116109#post1116109
        // https://www.sencha.com/forum/showthread.php?301458-Loading-mask-not-setting-for-bound-store-loaded-in-ViewController.init
        var me = this;

        var view = me.getView();
        view.setEmptyText('');
        view.setLoading();

        var wfsGetFeatureFilter = me.createStoreFilters(store);

        if (wfsGetFeatureFilter) {
            params.filter = wfsGetFeatureFilter;
        }
    },

    /**
     * Hide the loading mask when the store has loaded
     *
     * @private
     */
    onWfsStoreAfterLoad: function (store, features, success) {

        var grid = this.getView();
        var emptyText = '';

        // display a message if the WFS request fails
        if (success === false) {
            emptyText = 'An error occurred loading the data. ';
            if (store.pageSize === null) {
                emptyText += 'Please check "Page Records" to reduce the amount of records returned';
            }
        }

        grid.setEmptyText(emptyText);
        grid.setLoading(false);
    },

    /**
     * Store the spatial filter as a property of this class
     * then force a reload of the grid store with the new filter
     * Finally apply all filters to any associated layers.
     *
     * @param {Ext.util.Filter} spatialFilter
     * @private
     */
    onSpatialFilter: function (spatialFilter) {
        var me = this;
        me.spatialFilter = spatialFilter;
        var clearPaging = true;
        me.refreshStore(clearPaging);
        var force = false;
        me.updateAssociatedLayers(force);
    },


    /**
    * Force a reload of the grid store
    * @param {Boolean} clearPaging True to clear paging parameters
    */
    refreshStore: function (clearPaging) {

        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        // clear any paging parameters as these will no longer apply
        // once filters have been applied
        if (clearPaging === true) {
            store.currentPage = 1;
        }

        if (store.loadWfs) {
            store.loadWfs();
        }
    },

    /**
     * Sets an ExtJS "in" filter for feature IDs which has to be applied to the
     * underlying WFS request.
     *
     * @param {Ext.util.Filter} idFilter Filter object with FIDs
     */
    onIdFilterSet: function (idFilter) {
        var me = this;
        me.idFilter = idFilter;

        var clearPaging = true;
        me.refreshStore(clearPaging);

        var force = false;
        me.updateAssociatedLayers(force);
    },

    /**
    * Gets associatedEditWindow, associatedEditModel and record Id
    * from a ViewModel and record Model. It is a separate function
    * so that it might be overridden in a subclass to return custom values
    * @param {Ext.app.ViewModel} vm
    * @param {Ext.data.Model} record
    * @returns {Object} Object containing the config properties
    */
    getRecordEditConfig: function (vm, record) {
        return {
            associatedEditWindow: vm.get('associatedEditWindow'),
            associatedEditModel: vm.get('associatedEditModel'),
            id: record.getId()
        };
    },

    /**
     * If there is an edit / view window for individual records
     * in the grid then open it with this function
     *
     * @param {Ext.grid.View} grid
     * @param {Ext.data.Model} record
     * @private
     */
    onRowDblClick: function (grid, record) {

        var me = this;
        var vm = me.getViewModel();
        var config = me.getRecordEditConfig(vm, record);
        var associatedEditWindow = config.associatedEditWindow;
        var associatedEditModel = config.associatedEditModel;
        var recId = config.id;

        // get a reference to the model class so we can use the
        // static .load function without creating a new empty model
        var modelPrototype = Ext.ClassManager.get(associatedEditModel);

        if (associatedEditWindow && modelPrototype) {

            // if the record is already open in a window then simply bring that window to the front
            var windowXType = Ext.ClassManager.get(associatedEditWindow).prototype.getXType();
            var existingWindows = Ext.ComponentQuery.query(windowXType);
            var rec, recordWindow;

            Ext.each(existingWindows, function (w) {
                rec = w.getViewModel().get('currentRecord');
                if (rec.getId() == recId) {
                    recordWindow = w;
                    return false;
                }
            });

            if (recordWindow) {
                // if the window is minimised make sure it is restored
                if (recordWindow.isMinimized) {
                    recordWindow.show();
                }
                Ext.WindowManager.bringToFront(recordWindow);
            } else {
                // load the record into a new window
                grid.mask('Loading Record...');
                modelPrototype.load(recId, {
                    success: function (rec) {
                        var win = Ext.create(associatedEditWindow);
                        var vm = win.getViewModel();
                        vm.set('currentRecord', rec);
                        win.show();
                    },
                    callback: function () {
                        grid.unmask();
                    },
                    scope: this
                });
            }
        }
    },
    /**
     * Enable and disable paging for the grid.
     * Disabling paging allows all records to be loaded into the
     * grid for an Excel export. Enabling paging improves load
     * performance.
     *
     * @private
     */
    togglePaging: function (checkBox, checked) {

        var me = this;
        var grid = me.getView();

        var pagingToolbar = grid.down('gx_wfspaging_toolbar');
        pagingToolbar.setDisabled(!checked);

        var store = grid.getStore();

        // save the initial store parameters
        if (!me.originalPageSize) {
            me.originalPageSize = store.pageSize;
        }

        var originalHeight = grid.getHeight();

        if (checked) {
            store.pageSize = me.originalPageSize;
            store.startIndex = 0; // reset each time // me.startIndex;
        } else {
            store.pageSize = null;
            store.currentPage = 1;
            store.startIndex = 0;
            // avoid the grid resizing to fill up the whole screen
            // set it to the height before paging was deactivated
            grid.setHeight(originalHeight);
        }

        store.loadWfs();
    },

    /**
     * Export the current records in the grid to Excel
     *
     * @private
     */
    exportToExcel: function () {

        var me = this;
        var grid = me.getView();

        if (!grid.saveDocumentAs) {
            Ext.Msg.alert('Not Supported',
                'The Excel export is not supported for this grid', Ext.emptyFn);
            return;
        }

        var originalMsg = grid.loadMask.msg;
        grid.setLoading('Exporting to Excel...');

        // later in an event listeners
        grid.saveDocumentAs({
            type: 'xlsx',
            title: grid.exportTitle,
            fileName: grid.exportFileName
        }).then(function () {
            grid.setLoading(false);
            grid.loadMask.msg = originalMsg;
        });
    },

    /**
     * Export the current records in the grid to a zipped shapefile
     *
     * @private
     */
    exportToShapefile: function () {

        var me = this;
        me.exportUsingMapServer('shapezip');
    },

    /**
     * Export all records in the grid to a zipped Excel
     * using MapServer
     *
     * @private
     */
    exportToServerExcel: function () {

        var me = this;
        me.exportUsingMapServer('xlsx');
    },

    /**
     * Export data using MapServer OGR exports
     *
     * @private
     */
    exportUsingMapServer: function (outputFormat) {

        var me = this;
        var grid = me.getView();

        var store = grid.getStore();
        var url = store.url;
        var params = store.createParameters();

        // apply filters to the shapefile export
        var wfsGetFeatureFilter = me.createStoreFilters(store);

        if (wfsGetFeatureFilter) {
            params.filter = wfsGetFeatureFilter;
        }

        // pass a filename to MapServer
        params.fileName = params.typeName;

        params.outputFormat = outputFormat;
        // remove the count and startIndex parameters so that all records are exported
        delete params.count;
        delete params.startIndex;

        // files can't be downloaded using Ext.Ajax.request (due to browser security)
        // so a hidden form is used with standardSubmit set to true
        // this approach does not allow callbacks to be run on success / failure

        Ext.create('Ext.form.Panel', {
            standardSubmit: true
        }).submit({
            params: params,
            url: url,
            target: '_blank' // set the target to a blank tab so if it times out it does not leave the user with an empty page
        });
    },

    /**
     * Whenever columns are shown or hidden update
     * the WFS propertyName so only data to
     * be displayed is returned. The idProperty will
     * always be returned even if the column is hidden.
     * Merge in an extraPropertyNames defined in the viewModel
     */
    getVisibleColumns: function () {

        var me = this;
        var viewModel = me.getViewModel();
        var grid = me.getView();
        var store = grid.getStore();
        var extraPropertyNames = viewModel.get('extraPropertyNames');

        var visibleColumnNames, idProperty;
        if (!store.isEmptyStore) {
            visibleColumnNames = Ext.Array.pluck(grid.getVisibleColumns(), 'dataIndex');
            idProperty = store.model.prototype.idField.name;

            // add the idProperty as the first item in the list
            // if not already in list
            if (visibleColumnNames.indexOf(idProperty) === -1) {
                visibleColumnNames.unshift(idProperty);
            }
            // remove any null columns which may have been created by
            // selection checkboxes for example
            visibleColumnNames = Ext.Array.clean(visibleColumnNames);
            store.propertyName = Ext.Array.merge(visibleColumnNames, extraPropertyNames).join(',');
        }
    },

    onColumnHide: function () {
        this.getVisibleColumns();
    },

    onColumnsReconfigure: function () {
        this.getVisibleColumns();
    },

    onColumnShow: function (ct, column) {

        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        me.getVisibleColumns();
        var idProperty = store.model.prototype.idField.name;

        if ((Ext.isEmpty(column.dataIndex) === false) && (column.dataIndex !== idProperty)) {
            // when a new column is displayed
            // query the server again to retrieve the data
            // idProperty will always be loaded so no need to reload in this case
            // if a column does not have a dataIndex (e.g. checkbox columns) then there is no need to requery the server

            // reset lastOptions used to load store to avoid records disappearing
            // this can happen if spatial filters are applied when on pages of data > 1 and
            // then new columns are displayed
            store.lastOptions.start = 0;
            store.lastOptions.page = 1;

            store.reload();
        }
    },

    /**
     * Hide and show the map layer used to highlight selected features
     * with the grid.
     * Although the layer has no styling we need to hide
     * any selections which are visible
     */
    toggleLayerVisibility: function (show) {
        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        if (store.isEmptyStore !== true && store.getLayer) {
            var selectedFeaturesLayer = store.getLayer();
            if (selectedFeaturesLayer) {
                selectedFeaturesLayer.setVisible(show);
            }
        }
    },

    /**
     * Returns the layer of the grid.
     *
     * @returns {ol.layer.Base} The grid's layer
     */
    getOlLayer: function () {
        var me = this;
        var viewModel = me.getViewModel();
        // look for both wms and vector tile layers (vtwms)
        var wmsLayerKey = viewModel.get('wmsLayerKey') ? viewModel.get('wmsLayerKey') : viewModel.get('vtwmsLayerKey');
        var vectorLayerKey = viewModel.get('vectorLayerKey');
        var layer;

        if (wmsLayerKey) {
            layer = me.getLayerByKey(wmsLayerKey);
        }

        // in the case of a switch layer we may have 2 layer keys defined
        // but only one loaded into the map
        if (!layer && vectorLayerKey) {
            layer = me.getLayerByKey(vectorLayerKey);
        }

        return layer;
    },

    /**
     * Show selection layer when the grid is shown
     */
    onWindowShown: function () {
        this.toggleLayerVisibility(true);
    },

    /**
     * Hide selection layer when the grid is shown
     */
    onWindowHidden: function () {
        this.toggleLayerVisibility(false);
    },

    /**
     * Clear any sorters on the store
     */
    onClearSort: function () {
        var me = this;
        var grid = me.getView();
        var store = grid.getStore();
        store.getSorters().clear();
        store.reload();
    },

    /**
     * Clear both the grid filters and any spatial filter.
     * This will cause the store to reload.
     *
     * @private
     */
    clearFilters: function () {
        var me = this;
        var view = me.getView();
        me.spatialFilter = null;
        me.idFilter = null;
        view.getPlugin('gridfilters').clearFilters();

        var spatialQueryButton = view.down('cmv_spatial_query_button');
        if (spatialQueryButton !== null) {
            spatialQueryButton.fireEvent('clearAssociatedPermanentLayer');
            spatialQueryButton.toggle(false);
        }
        var featureSelectionButton = view.down('cmv_feature_selection_button');
        if (featureSelectionButton !== null) {
            featureSelectionButton.toggle(false);
        }

        view.fireEvent('cmv-clear-filters');
    },

    /**
     * Resets all filters without reloading the store.
     * In case a direct reload of the store is needed use #clearFilters.
     */
    resetFilters: function () {
        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        // instead of grid.clearFilters() it does not force a reload
        store.filters.clear();
        me.spatialFilter = null;
        me.idFilter = null;
    },

    /**
     * If any models associated with the grid are edited
     * (for example in a child form) then automatically update
     * the grid and associated layers
     *
     * @private
     */
    addChildModelListener: function () {

        var me = this;
        var vm = me.getViewModel();
        var associatedEditModel = vm.get('associatedEditModel');

        if (associatedEditModel) {
            var modelPrototype = Ext.ClassManager.get(associatedEditModel);
            Ext.util.Observable.observe(modelPrototype, {
                modelsaved: function () {
                    var clearPaging = false;
                    me.refreshStore(clearPaging);
                    var force = true;
                    me.updateAssociatedLayers(force);
                },
                scope: me
            });
        }
    },

    /**
     * @private
     */
    initViewModel: function (viewModel) {
        var me = this;

        me.applyStoreToGrid(viewModel);
        me.activatePresetFilterButton(viewModel);
    },

    /**
     * Dynamically apply a store to the grid based on the gridStoreType
     * config option. Also set the hidden grid vector layer to be associated
     * with the cmv_spatial_query_button
     *
     * @param {Ext.app.ViewModel } viewModel The ViewModel
     */
    applyStoreToGrid: function (viewModel) {
        var me = this;

        me.addChildModelListener();

        var gridStoreType = viewModel.get('gridStoreType');
        var layerName = viewModel.get('gridLayerName');
        // var vectorLayerKey = viewModel.get('vectorLayerKey');
        var featureSelectionLayerKey = viewModel.get('featureSelectionLayerKey');

        // TODO check why we can't simply add a {'queryLayerName'} binding in
        // the grid view - already created ?

        // we can have 2 cmv_spatial_query_buttons depending on the selection type (simple or advanced)
        var spatialQueryButtons = viewModel.getView().query('cmv_spatial_query_button');

        Ext.Array.each(spatialQueryButtons, (function (btn) {
            btn.setQueryLayerName(layerName);
            btn.setVectorLayerKey(layerName); // this name will have _spatialfilter appended to it
        }));

        // we will only ever have 1 cmv_feature_selection_button tool per grid
        var featureSelectionButton = viewModel.getView().down('cmv_feature_selection_button');
        featureSelectionButton.setVectorLayerKey(featureSelectionLayerKey);

        // dynamically create the store based on the config setting

        var stores = {
            gridstore: {
                type: gridStoreType,
                map: '{map}',
                createLayer: true,
                style: null, // hide WFS features unless selected - they are visible as part of the WMS
                listeners: {
                    'gx-wfsstoreload-beforeload': 'onWfsStoreBeforeLoad',
                    'gx-wfsstoreload': 'onWfsStoreAfterLoad'
                }
            }
        };

        viewModel.setStores(stores);
    },

    /**
     * Activated the "preset filter" button if the layer
     * has the respective properties.
     *
     * @param {Ext.app.ViewModel } viewModel The ViewModel
     */
    activatePresetFilterButton: function (viewModel) {
        var me = this;

        // check if layer has preset grid Filters
        // if yes, we activate the respective button
        var layer = me.getOlLayer();
        if (layer && layer.get('gridFilters')) {
            viewModel.set('usePresetFilters', true);
        }
    },

    /**
     * Applies preset filters from the configuration
     * to the grid.
     */
    applyPresetFilters: function () {
        var me = this;

        var layer = me.getOlLayer();
        var gridFilters = layer.get('gridFilters');

        if (!gridFilters || !Ext.isArray(gridFilters)) {
            return;
        }

        var grid = me.getView();
        if (!grid) {
            return;
        }

        var columnManager = grid.getColumnManager();
        if (!columnManager) {
            return;
        }

        // loop through all provided preset filter definitions
        Ext.each(gridFilters, function (filterDef) {
            if (!filterDef || !Ext.isObject(filterDef)) {
                return;
            }

            var columnName = filterDef.property;
            var value = filterDef.value;
            var operator = filterDef.operator;

            if (!columnName || !value || !operator) {
                Ext.log.warn('Preset filter is not properly defined.');
                Ext.log.warn(filterDef);
                return;
            }

            var column = columnManager.getHeaderByDataIndex(columnName);
            if (!column || !column.filter || !column.filter.type) {
                return;
            }
            var columnType = column.filter.type;

            switch (columnType) {
                case 'string':
                    // only equal is supported for string
                    if (operator !== '=') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }
                    column.filter.setValue(value);
                    break;
                case 'number':
                    var filterValue = me.createNumberFilterValue(
                        operator,
                        value
                    );
                    if (!filterValue) {
                        return;
                    }

                    column.filter.setValue(filterValue);
                    break;
                case 'boolean':
                    // only equal is supported for boolean
                    if (operator !== '=') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }
                    column.filter.setValue(value);
                    break;
                case 'list':
                    // we need to apply the initial config again,
                    // because otherwise the store with the list-choices
                    // gets lost
                    var newFilter = Ext.clone(column.initialConfig.filter);

                    if (operator != 'in') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }

                    // now we apply the operator and the value
                    newFilter.operator = operator;
                    newFilter.value = value;

                    var plugin = grid.getPlugin('gridfilters');
                    plugin.addFilter(newFilter);
                    break;
                default:
                    Ext.log.warn('Filters not implemented for columns of type ' + columnType);
                    break;
            }
        });
    },

    /**
     * Create a value object needed for number filters.
     *
     * @param {string} operator The userdefined operator. Allowed values: '=', '<' and '>'
     * @param {number} value The numerical value to compare
     * @returns {Object} The value object for the filter
     */
    createNumberFilterValue: function (operator, value) {
        // translate user defined operators into operators
        // that are compatible with number filters
        var operatorMapping = {
            '=': 'eq',
            '>': 'gt',
            '<': 'lt'
        };
        var filterOperator = operatorMapping[operator];
        if (!filterOperator) {
            Ext.log.warn('No valid operator provided.');
            return;
        }

        // the value for number filters are objects like '{eq: 42}'
        // we need to create them from the original value and the operator
        var filterValue = {};
        filterValue[filterOperator] = value;
        return filterValue;
    }
});
