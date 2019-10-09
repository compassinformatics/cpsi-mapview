Ext.define('CpsiMapview.controller.grid.Grid', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_grid',

    requires: [
        'Ext.menu.Menu',
        'Ext.grid.filters.Filters',
        'BasiGX.util.Layer',
        'GeoExt.util.OGCFilter'
    ],

    onRowDblClick: function (sender, record) {
        this.fireEvent('onRowDblClick', sender, record);
    },

    spatialFilter: null,

    zoomToFeature: function (feature, map) {

        // TODO check for feature type
        var extent = feature.getGeometry().getExtent();
        // as this is a point then buffer it by 100m
        extent = ol.extent.buffer(extent, 100);
        //map.getView().fit(extent, map.getSize());

        var view = map.getView();

        var resolution = view.getResolutionForExtent(extent);
        var zoom = view.getZoomForResolution(resolution);
        var center = ol.extent.getCenter(extent);
        var duration = 2000;

        view.animate({
            center: center,
            duration: duration
        });

        view.animate(
            {
                zoom: zoom - 1,
                duration: duration / 2
            }, {
                zoom: zoom,
                duration: duration / 2
            }
        );
    },

    onItemContextMenu: function (grid, record, item, index, e) {

        var me = this;
        var map = me.getViewModel().get('map');

        if (!me.contextMenu) {
            me.contextMenu = Ext.create('Ext.menu.Menu', {
                //height: 200,
                //width: 250,
                items: [{
                    text: 'Zoom to Feature',
                    scope: me,
                    handler: function () {
                        var record = grid.getSelection()[0];
                        if (record) {
                            me.zoomToFeature(record.getFeature(), map);
                        }
                    }
                }]
            });
        }

        e.stopEvent();
        me.contextMenu.showAt(e.getXY());
    },

    getLayerByKey: function (key) {
        var layers = BasiGX.util.Layer.getLayersBy("layerKey", key);

        if (layers && layers.length === 1) {
            return layers[0];
        }
    },

    applyAllFilters: function () {

        var me = this;
        debugger;
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

    onFilterChange: function () {

        this.applyAllFilters();

    },

    onWfsStoreBeforeLoad: function (store, params) {

        //store.setRemoteFilter(true);

        // handle the loadMask ourselves due to various issues around data binding and reconfiguring stores
        // https://www.sencha.com/forum/showthread.php?299670-ExtJS-5.1.0-LoadMask-missing-on-grids-with-bound-store&p=1116109#post1116109
        // https://www.sencha.com/forum/showthread.php?301458-Loading-mask-not-setting-for-bound-store-loaded-in-ViewController.init
        var me = this;

        var view = me.getView();
        view.setLoading("Loading Records...");

        var filters = Ext.clone(store.getFilters().items);

        if (me.spatialFilter) {
            filters.push(me.spatialFilter);
        }

        var wfsGetFeatureFilter = GeoExt.util.OGCFilter.getOgcWfsFilterFromExtJsFilter(filters, 'And', '2.0.0');

        if (wfsGetFeatureFilter) {
            params.filter = wfsGetFeatureFilter;
        }
    },

    onWfsStoreAfterLoad: function () {
        var view = this.getView();
        view.setLoading(false);
    },

    onSpatialFilter: function (spatialFilter) {
        var me = this;
        me.spatialFilter = spatialFilter;

        // force a reload of the grid store
        var grid = me.getView();
        var store = grid.getStore();
        store.loadWfs();


        this.applyAllFilters();
    },

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

        //if (!me.startIndex) {
        //    me.startIndex = store.startIndex;
        //}

        if (checked) {
            store.pageSize = me.originalPageSize;
            store.startIndex = 0; // reset each time // me.startIndex;
        } else {
            store.pageSize = null;
            store.startIndex = 0;
        }

        store.loadWfs();
    },

    exportToExcel: function () {

        var me = this;
        var grid = me.getView();

        grid.setLoading('Exporting to Excel...');

        // later in an event listeners
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Map Export',
            fileName: 'myExport.xlsx'
        }).then(function () {
            grid.setLoading(false);
        });
    },

    clearFilters: function () {
        this.spatialFilter = null;
        this.getView().getPlugin('gridfilters').clearFilters();
    },

    initViewModel: function (viewModel) {

        var gridStoreType = viewModel.get('gridStoreType');

        var layerName = gridStoreType + 'Layer';

        var stores = {
            gridstore: {
                type: gridStoreType,
                map: '{map}',
                createLayer: true,
                layerOptions: {
                    name: layerName
                },
                style: null, // hide WFS features unless selected - they are visible as part of the WMS
                listeners: {
                    'gx-wfsstoreload-beforeload': 'onWfsStoreBeforeLoad',
                    'gx-wfsstoreload': 'onWfsStoreAfterLoad'
                }
            }
        };
        viewModel.setStores(stores);

        viewModel.setData('queryLayerName', layerName);

    },

});
