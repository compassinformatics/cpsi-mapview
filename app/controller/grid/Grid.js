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
        'BasiGX.util.Layer',
        'GeoExt.util.OGCFilter'
    ],

    /**
    * The currently active spatial filter for the layer.
    *
    * @cfg {Ext.util.Filter} spatialFilter
    */
    spatialFilter: null,

    /**
     * Zoom the map to the selected feature with a buffer
     *
     * @param {ol.Feature} feature
     * @param {ol.Map} map
     * @private
     */
    zoomToFeature: function (feature, map) {

        var me = this;

        // TODO check for feature type when zooming
        var extent = feature.getGeometry().getExtent();
        var view = me.getView();
        // as this is a point then buffer it by the extentBuffer property
        extent = ol.extent.buffer(extent, view.extentBuffer);
        //map.getView().fit(extent, map.getSize());

        var mapView = map.getView();

        var resolution = mapView.getResolutionForExtent(extent);
        var zoom = mapView.getZoomForResolution(resolution);
        var center = ol.extent.getCenter(extent);
        var duration = 2000;

        mapView.animate({
            center: center,
            duration: duration
        });

        mapView.animate(
            {
                zoom: zoom - 1,
                duration: duration / 2
            }, {
                zoom: zoom,
                duration: duration / 2
            }
        );
    },

    /**
     * Open a row-level context-menu with a Zoom to Feature option
     * @private
     */
    onItemContextMenu: function (grid, record, item, index, e) {
        var me = this;
        var map = me.getViewModel().get('map');

        var contextMenu = Ext.create('Ext.menu.Menu', {
            defaults: {
                clickHideDelay: 1
            },
            items: [{
                text: 'Zoom to Feature',
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

        e.stopEvent();
        contextMenu.showAt(e.getXY());
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
     * any associated WMS and vector layer and forces a reload of both
     *
     * @private
     */
    updateAssociatedLayers: function () {

        var me = this;
        var grid = me.getView();
        var viewModel = me.getViewModel();

        var store = grid.getStore();
        var filters = Ext.clone(store.getFilters().items); // otherwise the actual grid filters are modified

        var wmsFilter = '';
        var wmsLayer = me.getLayerByKey(viewModel.get('wmsLayerKey'));

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        if (wmsLayer) {
            if (filters.length > 0) {
                wmsFilter = GeoExt.util.OGCFilter.getOgcFilterFromExtJsFilter(filters, 'wms', 'and', '1.1.0');
            }
            var wmsSource = wmsLayer.getSource();
            wmsSource.updateParams({
                filter: wmsFilter,
                cacheBuster: Math.random()
            });
            // keep a reference to the raw filters so they can be applied to the vector layer
            // when switching - see LayerFactory
            wmsSource.set('additionalFilters', filters);
        }

        var vectorLayer = me.getLayerByKey(viewModel.get('vectorLayerKey'));

        if (vectorLayer) {
            var vectorSource = vectorLayer.getSource();
            vectorSource.set('additionalFilters', filters);
            vectorSource.clear();
            vectorSource.refresh();
        }

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
        view.setLoading();

        var filters = Ext.clone(store.getFilters().items);

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        var wfsGetFeatureFilter = GeoExt.util.OGCFilter.getOgcWfsFilterFromExtJsFilter(filters, 'And', '2.0.0');

        if (wfsGetFeatureFilter) {
            params.filter = wfsGetFeatureFilter;
        }
    },

    /**
    * Hide the loading mask when the store has loaded
    *
    * @private
    */
    onWfsStoreAfterLoad: function () {
        var view = this.getView();
        view.setLoading(false);
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

        // force a reload of the grid store
        var grid = me.getView();
        var store = grid.getStore();

        // clear any paging parameters as these will no longer apply
        // once the spatial filter has been applied
        store.currentPage = 1;

        store.loadWfs();


        this.updateAssociatedLayers();
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
        var associatedEditWindow = vm.get('associatedEditWindow');
        var associatedEditModel = vm.get('associatedEditModel');

        // get a reference to the model class so we can use the
        // static .load function without creating a new empty model
        var modelPrototype = Ext.ClassManager.get(associatedEditModel);

        if (associatedEditWindow && modelPrototype) {

            // if the record is already open in a window then simply bring that window to the front
            var recId = record.getId();
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
                'The Excel export is not supported in this version of the system', Ext.emptyFn);
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
    * Whenever columns are shown or hidden update
    * the WFS propertyName so only data to
    * be displayed is returned. The idProperty will
    * always be returned even if the column is hidden.
    *
    */
    getVisibleColumns: function () {

        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

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
            store.propertyName = visibleColumnNames.join(',');
        }
    },

    onColumnHide: function () {
        this.getVisibleColumns();
    },

    onColumnsReconfigure: function () {
        this.getVisibleColumns();
    },

    onColumnShow: function () {

        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        me.getVisibleColumns();

        // when a new column is displayed
        // query the server again to retrieve the data
        store.reload();
    },


    /**
     * Hide and show the map layer with the grid
     * Although the layer has no styling we need to hide
     * any selections which are visible
     */
    toggleLayerVisibility: function (show) {

        var me = this;
        var grid = me.getView();
        var store = grid.getStore();

        if (store.isEmptyStore !== true) {
            var layer = store.getLayer();
            layer.setVisible(show);
        }
    },

    /**
     * Template method for Ext.Component that
     * can be overridden
     */
    onHide: function () {
        this.toggleLayerVisibility(false);
    },

    /**
    * Template method for Ext.Component that
    * can be overridden
    */
    onShow: function () {
        this.toggleLayerVisibility(true);
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
        view.getPlugin('gridfilters').clearFilters();

        var spatialQueryButton = view.down('cmv_spatial_query_button');
        if (spatialQueryButton !== null) {
            spatialQueryButton.fireEvent('clearAssociatedPermanentLayer');
            spatialQueryButton.toggle(false);
        }
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
                    var grid = me.getView();
                    var store = grid.getStore();
                    store.loadWfs();
                    me.updateAssociatedLayers();
                }
            });
        }
    },

    /**
    * Dynamically apply a store to the grid based on the gridStoreType
    * config option. Also set the hidden grid vector layer to be associated
    * with the cmv_spatial_query_button
    *
    * @private
    */
    initViewModel: function (viewModel) {

        var me = this;

        me.addChildModelListener();

        var gridStoreType = viewModel.get('gridStoreType');
        var layerName = viewModel.get('gridLayerName');

        // TODO check why we can't simply add a {'queryLayerName'} binding in
        // the grid view - already created ?
        var spatialQueryButton = viewModel.getView().down('cmv_spatial_query_button');
        spatialQueryButton.setQueryLayerName(layerName);
        spatialQueryButton.setVectorLayerKey(layerName); // this name will have _spatialfilter appended to it

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
    }
});
