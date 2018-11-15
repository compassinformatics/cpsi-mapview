/**
 * This view is an example list of people.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_map',

    requires: [
        'GeoExt.component.Map',

        'CpsiMapview.model.button.MeasureButton',
        'CpsiMapview.controller.button.MeasureButtonController',

        'CpsiMapview.view.toolbar.MapFooter',

        'BasiGX.view.button.Measure',
        'BasiGX.view.button.ZoomToExtent',
        'BasiGX.util.Projection'
    ],

    layout: 'fit',

    controller: 'cmv_map',

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'basigx-button-zoomtoextent',
            extent: [-1210762, 6688545, -600489, 7490828]
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'line',
            toggleGroup: 'measure-tools',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            glyph: 'xf068@FontAwesome',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }, {
            xtype: 'basigx-button-measure',
            measureType: 'polygon',
            toggleGroup: 'measure-tools',
            glyph: 'xf044@FontAwesome',
            viewModel: 'cmw_btn_measure',
            controller: 'cmv_btn_measure',
            listeners: {
                afterrender: 'initializeMeasureBtn'
            }
        }]
    }, {
        xtype: 'cmv_mapfooter',
        dock: 'bottom'
    }],

    items: [{
        xtype: 'gx_map',
        pointerRest: true,
        pointerRestInterval: 500,
        map: new ol.Map({
            // layers will be created from config in initComponent
            layers: [],
            view: new ol.View({
                center: ol.proj.fromLonLat( [-8, 53.5] ),
                zoom: 8
            })
        }),
        listeners: {
            afterrender: 'afterMapRender'
        }
    }],

    /**
     * Enables a click handler on the map which fires an event
     * 'cmv-mapclick' with all clicked vector features and their corresponding
     * layers.
     * @config {Boolean}
     */
    enableMapClick: true,

    /**
     * Enables a 'pointerrest' handler on the map which fires an event
     * 'cmv-map-pointerrest' with all hovered vector features and their
     * corresponding layers.
     * @config {Boolean}
     */
    enableMapHover: true,

    /*
     * Flag that to add a scale bar to the map or not
     * @config {Boolean}
     */
    addScaleBarToMap: true,

    /*
     * Flag that enables/disables permalink functionality
     * @config {Boolean}
     */
    enablePermalink: true,

    /**
     * Flag to show if permalink should be updated or not.
     * We do not update the URL when the view was changed in the 'popstate'
     * handler.
     * @property {Boolean}
     * @private
     */
    shouldUpdatePermalink: true,

    /**
     * Flag to steer if center coordinates in the permalink should be rounded or
     * not
     * @config {Boolean}
     */
    roundPermalinkCoords: true,

    /**
     * @event cmv-mapclick
     * Fires when the OL map is clicked.
     * @param {CpsiMapview.view.main.Map} this
     * @param {Object[]} clickInfo The clicked features and the corresponding layers, like `[{feature: aFeat, layer: aLayer}, ...]`
     * @param {ol.MapBrowserEvent)} evt The original 'singleclick' event of OpenLayers
     */

    inheritableStatics: {
        /**
         * Tries to detect the first occurance of this map panel.
         * @return {CpsiMapview.view.main.Map} The map panel, which is at least
         *     a GeoExt.component.Map and possibly an instance of this class.
         */
        guess: function() {
            return BasiGX.util.Map.getMapComponent(this.xtype);
        }
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // Load layer JSON configuration
        Ext.Ajax.request({
            url: 'resources/data/layers/default.json',
            success: function (response) {
                var layerJson = Ext.decode(response.responseText);

                Ext.each(layerJson.layers, function (layerConf) {
                    var layer = LayerFactory.createLayer(layerConf);
                    if (layer) {
                        me.olMap.addLayer(layer);
                    }
                });
            }
        });

        me.callParent(arguments);

        // make sub components accessible as members
        me.mapCmp = me.down('gx_map');
        me.olMap = me.mapCmp.map;

        if (me.enableMapClick) {
            me.olMap.on('singleclick', function(evt) {
                var clickedFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function(feature, layer) {
                        // collect all clicked features and their layers
                        clickedFeatures.push({feature: feature, layer: layer});
                    }
                );

                // fire event to forward click info to subscribers
                me.fireEvent('cmv-mapclick', clickedFeatures, evt);
            });
        }

        if (me.enableMapHover) {
            me.mapCmp.on('pointerrest', function(evt) {
                var hoveredFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function(feature, layer) {
                        // collect all clicked features and their layers
                        hoveredFeatures.push({feature: feature, layer: layer});
                    }
                );

                // fire event to forward hover info to subscribers
                me.fireEvent('cmv-map-pointerrest', hoveredFeatures, evt);
            });

            me.mapCmp.on('pointerrestout', function () {
                me.fireEvent('cmv-map-pointerrestout');
            });

            me.olMap.on('pointermove', function () {
                me.fireEvent('cmv-map-pointermove');
            });
        }

        if (me.enablePermalink) {
            if (window.location.hash !== '') {
                // try to restore center, zoom-level and rotation from the URL
                me.applyState(me.readPermalink(window.location.hash));
            }

            me.registerPermalinkEvents();
        }

        Ext.GlobalEvents.fireEvent('cmv-mapready', me);
    },

    /**
     * Registers the events to have a permalink synchronization.
     *
     * @private
     */
    registerPermalinkEvents: function () {
        var me = this;

        // update permalink when visible map state changes
        me.olMap.on('moveend', me.updatePermalink, me);

        // restore the view state when navigating through the history, see
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
        window.addEventListener('popstate', function(event) {
            if (event.state === null) {
                return;
            }
            me.olMap.getView().setCenter(event.state.center);
            me.olMap.getView().setZoom(event.state.zoom);
            me.olMap.getView().setRotation(event.state.rotation);
            me.shouldUpdatePermalink = false;
        });
    },

    /**
     * Returns the current map state (center, zoom, rotation)
     * @return {Object} The map state object
     */
    getState: function () {
        var me = this;
        var view = me.olMap.getView();
        return {
            zoom: view.getZoom(),
            center: view.getCenter(),
            rotation: view.getRotation()
        };
    },

    /**
     * Applies the map state (center, zoom, rotation) to this map.
     *
     * @param  {Object} mapState The map state object
     */
    applyState: function (mapState) {
        var me = this;

        if (!Ext.isObject(mapState)) {
            return;
        }

        me.olMap.getView().setCenter(mapState.center);
        me.olMap.getView().setZoom(mapState.zoom);
        me.olMap.getView().setRotation(mapState.rotation);
    },

    /**
     * Creates a map state object from a URL hash.
     *
     * @param plHash {String} The URL hash to get the state from
     * @return {Object} The map state object
     * @private
     */
    readPermalink: function (plHash) {
        var mapState;
        if (window.location.hash !== '') {
            // read center, zoom and rotation from the URL
            var hash = plHash.replace('#map=', '');
            var parts = hash.split('/');
            if (parts.length === 4) {
                mapState = {
                    zoom: parseInt(parts[0], 10),
                    center: [
                        parseFloat(parts[1]),
                        parseFloat(parts[2])
                    ],
                    rotation: parseFloat(parts[3])
                };
            }
        }

        return mapState;
    },

    /**
     * Updates the permalink as URL hash and pushes the state into the window
     * history.
     *
     * @private
     */
    updatePermalink: function () {
        var me = this;

        if (!me.shouldUpdatePermalink) {
            // do not update the URL when the view was changed in the 'popstate'
            // handler
            me.shouldUpdatePermalink = true;
            return;
        }

        var mapState = me.getState();

        // check if we have to round the coords (if no coordinates in deegrees)
        var doRound =
            me.roundPermalinkCoords &&
            me.olMap.getView().getProjection().getUnits() !== 'degrees';
        var centerX = mapState.center[0];
        var centerY = mapState.center[1];
        if (doRound) {
            centerX = Math.round(centerX * 100) / 100;
            centerY = Math.round(centerY * 100) / 100;
        }

        var hash = '#map=' +
            mapState.zoom + '/' +
            centerX + '/' +
            centerY + '/' +
            mapState.rotation;

        // push the state into the window history (to navigate with browser's
        // back and forward buttons)
        window.history.pushState(mapState, 'map', hash);
    }
});
