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
        const me = this;
        const vm = me.getViewModel();
        const map = vm.get('map');
        const isSpatial = vm.get('isSpatialGrid');

        // currently there is only one context-menu tool
        // and it is spatial-related
        // if more tools are added then remove this guard
        if (!isSpatial) {
            return;
        }

        const contextMenu = Ext.create('Ext.menu.Menu', {
            defaults: {
                clickHideDelay: 1
            },
            items: [
                {
                    text: 'Zoom to Feature',
                    hidden: !isSpatial,
                    handler: function () {
                        me.zoomToFeature(record.getFeature(), map);
                    }
                }
            ],
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
        const layers = BasiGX.util.Layer.getLayersBy('layerKey', key);

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
        const me = this;
        const grid = me.getView();
        const viewModel = me.getViewModel();

        const store = grid.getStore();
        const filters = Ext.clone(store.getFilters().items); // otherwise the actual grid filters are modified
        let wmsLayer = me.getLayerByKey(viewModel.get('wmsLayerKey'));

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
            const wmsFilterUtil = CpsiMapview.util.WmsFilter;
            const wmsSource = wmsLayer.getSource();
            const wmsParams = wmsFilterUtil.getWmsParams(wmsLayer);

            // save the current filter string to see if the filter has changed
            const originalFilterString = wmsParams.FILTER || '';

            // set any new filter
            if (filters && filters.length > 0) {
                const ogcFilters =
                    CpsiMapview.util.Layer.convertAndCombineFilters(filters);
                wmsParams.FILTER = GeoExt.util.OGCFilter.combineFilters(
                    ogcFilters,
                    'And',
                    true,
                    '1.1.0'
                );
            } else {
                wmsParams.FILTER = ''; // ensure the filter is reset if no filters are set
            }

            // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
            const wmsFilterString = wmsFilterUtil.getWmsFilterString(wmsParams);

            // if the filters have not changed then we do not need to refresh
            // unless the underlying data has changed and force is used
            if (force === true || originalFilterString !== wmsFilterString) {
                const newParams = {
                    FILTER: wmsFilterString,
                    TIMESTAMP: Ext.Date.now()
                };

                if (wmsLayer.get('isVt') === true) {
                    CpsiMapview.util.Layer.updateVectorTileParameters(
                        wmsLayer,
                        newParams
                    );
                } else {
                    wmsSource.updateParams(newParams);
                }
            }
            // keep a reference to the raw filters so they can be applied to the vector layer
            // when switching
            wmsSource.set('additionalFilters', filters);
            CpsiMapview.util.Layer.updateLayerNodeUI(wmsLayer);
        }

        const vectorLayer = me.getLayerByKey(viewModel.get('vectorLayerKey'));

        if (vectorLayer) {
            let vectorSource = vectorLayer.getSource();

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
        const me = this;
        let wfsGetFeatureFilter = '';

        const filters = Ext.clone(store.getFilters().items);

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        if (me.idFilter) {
            filters.push(me.idFilter);
        }

        if (filters.length > 0) {
            const ogcFilters =
                CpsiMapview.util.Layer.convertAndCombineFilters(filters);
            wfsGetFeatureFilter = GeoExt.util.OGCFilter.combineFilters(
                ogcFilters,
                'And',
                true,
                '2.0.0'
            );
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
        const me = this;

        const view = me.getView();
        view.setEmptyText('');
        view.setLoading();

        const wfsGetFeatureFilter = me.createStoreFilters(store);

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
        const grid = this.getView();
        let emptyText = '';

        // display a message if the WFS request fails
        if (success === false) {
            emptyText = 'An error occurred loading the data. ';
            if (store.pageSize === null) {
                emptyText +=
                    'Please check "Page Records" to reduce the amount of records returned';
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
        const me = this;
        me.spatialFilter = spatialFilter;
        const clearPaging = true;
        me.refreshStore(clearPaging);
        const force = false;
        me.updateAssociatedLayers(force);
    },

    /**
     * Force a reload of the grid store
     * @param {Boolean} clearPaging True to clear paging parameters
     */
    refreshStore: function (clearPaging) {
        const me = this;
        const grid = me.getView();
        const store = grid.getStore();

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
        const me = this;
        me.idFilter = idFilter;

        const clearPaging = true;
        me.refreshStore(clearPaging);

        const force = false;
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
        const me = this;
        const vm = me.getViewModel();
        const config = me.getRecordEditConfig(vm, record);
        const associatedEditWindow = config.associatedEditWindow;
        const associatedEditModel = config.associatedEditModel;
        const recId = config.id;

        // get a reference to the model class so we can use the
        // static .load function without creating a new empty model
        const modelPrototype = Ext.ClassManager.get(associatedEditModel);

        if (associatedEditWindow && modelPrototype) {
            // if the record is already open in a window then simply bring that window to the front
            const windowXType =
                Ext.ClassManager.get(associatedEditWindow).prototype.getXType();
            const existingWindows = Ext.ComponentQuery.query(windowXType);
            let rec, recordWindow;

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
                        const win = Ext.create(associatedEditWindow);
                        const vm = win.getViewModel();
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
        const me = this;
        const grid = me.getView();

        const pagingToolbar = grid.down('gx_wfspaging_toolbar');
        pagingToolbar.setDisabled(!checked);

        const store = grid.getStore();

        // save the initial store parameters
        if (!me.originalPageSize) {
            me.originalPageSize = store.pageSize;
        }

        const originalHeight = grid.getHeight();

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
        const me = this;
        const grid = me.getView();

        if (!grid.saveDocumentAs) {
            Ext.Msg.alert(
                'Not Supported',
                'The Excel export is not supported for this grid',
                Ext.emptyFn
            );
            return;
        }

        const originalMsg = grid.loadMask.msg;
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
        const me = this;
        me.exportUsingMapServer('shapezip');
    },

    /**
     * Export all records in the grid to a zipped Excel
     * using MapServer
     *
     * @private
     */
    exportToServerExcel: function () {
        const me = this;
        me.exportUsingMapServer('xlsx');
    },

    /**
     * Export data using MapServer OGR exports
     *
     * @private
     */
    exportUsingMapServer: function (outputFormat) {
        const me = this;
        const grid = me.getView();

        const store = grid.getStore();
        const url = store.url;
        const params = store.createParameters();

        // apply filters to the shapefile export
        const wfsGetFeatureFilter = me.createStoreFilters(store);

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
        const me = this;
        const viewModel = me.getViewModel();
        const grid = me.getView();
        const store = grid.getStore();
        const extraPropertyNames = viewModel.get('extraPropertyNames');

        let visibleColumnNames, idProperty;
        if (!store.isEmptyStore) {
            visibleColumnNames = Ext.Array.pluck(
                grid.getVisibleColumns(),
                'dataIndex'
            );
            idProperty = store.model.prototype.idField.name;

            // add the idProperty as the first item in the list
            // if not already in list
            if (visibleColumnNames.indexOf(idProperty) === -1) {
                visibleColumnNames.unshift(idProperty);
            }
            // remove any null columns which may have been created by
            // selection checkboxes for example
            visibleColumnNames = Ext.Array.clean(visibleColumnNames);
            store.propertyName = Ext.Array.merge(
                visibleColumnNames,
                extraPropertyNames
            ).join(',');
        }
    },

    onColumnHide: function () {
        this.getVisibleColumns();
    },

    onColumnsReconfigure: function () {
        this.getVisibleColumns();
    },

    onColumnShow: function (ct, column) {
        const me = this;
        const grid = me.getView();
        const store = grid.getStore();

        me.getVisibleColumns();
        const idProperty = store.model.prototype.idField.name;

        if (
            Ext.isEmpty(column.dataIndex) === false &&
            column.dataIndex !== idProperty
        ) {
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
        const me = this;
        const grid = me.getView();
        const store = grid.getStore();

        if (store.isEmptyStore !== true && store.getLayer) {
            const selectedFeaturesLayer = store.getLayer();
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
        const me = this;
        const viewModel = me.getViewModel();
        // look for both wms and vector tile layers (vtwms)
        const wmsLayerKey = viewModel.get('wmsLayerKey')
            ? viewModel.get('wmsLayerKey')
            : viewModel.get('vtwmsLayerKey');
        const vectorLayerKey = viewModel.get('vectorLayerKey');
        let layer;

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
        const me = this;
        const grid = me.getView();
        const store = grid.getStore();
        store.getSorters().clear();
        store.reload();
    },

    /**
     * Clear the spatial filter only
     */
    onClearSpatialFilter: function () {
        const me = this;

        // trigger a refresh of the store without the spatial filter
        me.onSpatialFilter(null);
        // now remove the polygon from the layer
        const spatialQueryButton = me.getVisibleSpatialQueryButton();
        if (spatialQueryButton !== null) {
            spatialQueryButton.fireEvent('clearAssociatedPermanentLayer');
            spatialQueryButton.toggle(false);
        }
    },

    /**
     * The grid can have a simple or an advanced spatial selection button.
     * Make sure the visible button is returned
     */
    getVisibleSpatialQueryButton: function () {
        const me = this;
        const view = me.getView();

        const spatialQueryButtons = view.query('cmv_spatial_query_button');
        let spatialQueryButton = null;
        Ext.each(spatialQueryButtons, function (button) {
            if (button.isVisible(true)) {
                // check visibility including parent containers
                spatialQueryButton = button;
                return false; // exit the loop
            }
        });

        return spatialQueryButton;
    },
    /**
     * Clear both the grid filters and any spatial filter.
     * This will cause the store to reload.
     *
     * @private
     */
    clearFilters: function () {
        const me = this;
        const view = me.getView();
        me.spatialFilter = null;
        me.idFilter = null;
        view.getPlugin('gridfilters').clearFilters();

        const spatialQueryButton = me.getVisibleSpatialQueryButton();
        if (spatialQueryButton !== null) {
            spatialQueryButton.fireEvent('clearAssociatedPermanentLayer');
            spatialQueryButton.toggle(false);
        }
        const featureSelectionButton = view.down(
            'cmv_feature_selection_button'
        );
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
        const me = this;
        const grid = me.getView();
        const store = grid.getStore();

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
        const me = this;
        const vm = me.getViewModel();
        const associatedEditModel = vm.get('associatedEditModel');

        if (associatedEditModel) {
            const modelPrototype = Ext.ClassManager.get(associatedEditModel);
            Ext.util.Observable.observe(modelPrototype, {
                modelsaved: function () {
                    const clearPaging = false;
                    me.refreshStore(clearPaging);
                    const force = true;
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
        const me = this;

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
        const me = this;

        me.addChildModelListener();

        const gridStoreType = viewModel.get('gridStoreType');
        const layerName = viewModel.get('gridLayerName');
        // var vectorLayerKey = viewModel.get('vectorLayerKey');
        const featureSelectionLayerKey = viewModel.get(
            'featureSelectionLayerKey'
        );

        // TODO check why we can't simply add a {'queryLayerName'} binding in
        // the grid view - already created ?

        // we can have 2 cmv_spatial_query_buttons depending on the selection type (simple or advanced)
        const spatialQueryButtons = viewModel
            .getView()
            .query('cmv_spatial_query_button');

        Ext.Array.each(spatialQueryButtons, function (btn) {
            btn.setQueryLayerName(layerName);
            btn.setVectorLayerKey(layerName); // this name will have _spatialfilter appended to it
        });

        // we will only ever have 1 cmv_feature_selection_button tool per grid
        const featureSelectionButton = viewModel
            .getView()
            .down('cmv_feature_selection_button');
        featureSelectionButton.setVectorLayerKey(featureSelectionLayerKey);

        // dynamically create the store based on the config setting

        const stores = {
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
        const me = this;

        // check if layer has preset grid Filters
        // if yes, we activate the respective button
        const layer = me.getOlLayer();
        if (layer && layer.get('gridFilters')) {
            viewModel.set('usePresetFilters', true);
        }
    },

    /**
     * Applies preset filters from the configuration
     * to the grid.
     */
    applyPresetFilters: function () {
        const me = this;

        const layer = me.getOlLayer();
        const gridFilters = layer.get('gridFilters');

        if (!gridFilters || !Ext.isArray(gridFilters)) {
            return;
        }

        const grid = me.getView();
        if (!grid) {
            return;
        }

        const columnManager = grid.getColumnManager();
        if (!columnManager) {
            return;
        }

        // loop through all provided preset filter definitions
        Ext.each(gridFilters, function (filterDef) {
            if (!filterDef || !Ext.isObject(filterDef)) {
                return;
            }

            const columnName = filterDef.property;
            const value = filterDef.value;
            const operator = filterDef.operator;

            if (!columnName || !value || !operator) {
                Ext.log.warn('Preset filter is not properly defined.');
                Ext.log.warn(filterDef);
                return;
            }

            const column = columnManager.getHeaderByDataIndex(columnName);
            if (!column || !column.filter || !column.filter.type) {
                return;
            }
            const columnType = column.filter.type;

            switch (columnType) {
                case 'string':
                    // only equal is supported for string
                    if (operator !== '=') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }
                    column.filter.setValue(value);
                    break;
                case 'number': {
                    const filterValue = me.createNumberFilterValue(
                        operator,
                        value
                    );
                    if (!filterValue) {
                        return;
                    }

                    column.filter.setValue(filterValue);
                    break;
                }
                case 'boolean':
                    // only equal is supported for boolean
                    if (operator !== '=') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }
                    column.filter.setValue(value);
                    break;
                case 'list': {
                    // we need to apply the initial config again,
                    // because otherwise the store with the list-choices
                    // gets lost
                    const newFilter = Ext.clone(column.initialConfig.filter);

                    if (operator != 'in') {
                        Ext.log.warn('No valid operator provided.');
                        return;
                    }

                    // now we apply the operator and the value
                    newFilter.operator = operator;
                    newFilter.value = value;

                    const plugin = grid.getPlugin('gridfilters');
                    plugin.addFilter(newFilter);
                    break;
                }
                default:
                    Ext.log.warn(
                        'Filters not implemented for columns of type ' +
                            columnType
                    );
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
        const operatorMapping = {
            '=': 'eq',
            '>': 'gt',
            '<': 'lt'
        };
        const filterOperator = operatorMapping[operator];
        if (!filterOperator) {
            Ext.log.warn('No valid operator provided.');
            return;
        }

        // the value for number filters are objects like '{eq: 42}'
        // we need to create them from the original value and the operator
        const filterValue = {};
        filterValue[filterOperator] = value;
        return filterValue;
    }
});
