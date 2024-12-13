/**
 * Main map view.
 */
Ext.define('CpsiMapview.view.main.Map', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_map',

    requires: [
        'GeoExt.component.Map',
        'GeoExt.state.PermalinkProvider',

        'CpsiMapview.view.toolbar.MapFooter',
        'CpsiMapview.view.toolbar.MapTools',
        'CpsiMapview.view.toolbar.MinimizedWindows',
        'CpsiMapview.controller.panel.TimeSlider',
        'CpsiMapview.controller.MapController',
        'CpsiMapview.plugin.FeatureInfoWindow',

        'BasiGX.util.Projection',
        'CpsiMapview.plugin.FeatureAttributeGrouping',
        'CpsiMapview.util.SwitchLayer'
    ],

    layout: 'fit',

    controller: 'cmv_map',

    dockedItems: [{
        xtype: 'cmv_maptools',
        dock: 'top',
    }, {
        xtype: 'cmv_mapfooter',
        dock: 'bottom'
    }],

    plugins: [
        {
            ptype: 'cmv_feature_attribute_grouping',
            startGroupingEvent: 'click',
            endGroupingEvent: 'context'
        },
        {
            ptype: 'cmv_feature_info_window'
        }
    ],

    mapViewConfig: {
        projection: 'EPSG:3857',
        zoom: 10,
        center: [-890555.9263461886, 7076025.276180581], // ol.proj.fromLonLat([-8, 53.5])
        // the number of pixels used for 'cmv-mapclick' tolerance
        // 0 is the OpenLayers default
        // see https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#forEachFeatureAtPixel
        hitTolerance: 0
    },

    /**
    * See blog post https://www.sencha.com/blog/declarative-listeners-in-ext-js-5/
    * Setting in initComponent sets scope to the parent (wrong) controller
    * */
    listeners: {
        'cmv-mapclick': {
            fn: 'onMapClick',
            options: {
                priority: 500
            }
        }
    },

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
     * Remembers the last resolution before change.
     * Necessary for detecting resolution change events.
     * @property {Number}
     * @private
     */
    lastResolution: null,

    /**
     * @event cmv-mapclick
     * Fires when the OL map is clicked.
     * @param {CpsiMapview.view.main.Map} this
     * @param {Object[]} clickInfo The clicked features and the corresponding layers, like `[{feature: aFeat, layer: aLayer}, ...]`
     * @param {ol.MapBrowserEvent} evt The original 'singleclick' event of OpenLayers
     */

    /**
     * @event cmv-init-layersadded
     * Fires when all initial layers from the config have been created and added to the OL map.
     * @param {CpsiMapview.view.main.Map} this
     */

    inheritableStatics: {
        /**
         * Tries to detect the first occurrence of this map panel.
         * @return {CpsiMapview.view.main.Map} The map panel, which is at least
         *     a GeoExt.component.Map and possibly an instance of this class.
         */
        guess: function () {
            return BasiGX.util.Map.getMapComponent(this.xtype);
        }
    },

    /**
     * Applies the default values to each layer
     * @param {*} layerConf
     * @param {*} defaults
     */
    applyDefaultsToLayerConf: function (layerConf, defaults) {

        var newLayerConf = {};

        // general default
        var generalDefaults = defaults ? defaults['general'] : {};
        Ext.Object.merge(newLayerConf, generalDefaults);

        // layer type default
        var typeDefaults = defaults ? defaults[layerConf.layerType] : {};
        Ext.Object.merge(newLayerConf, typeDefaults);

        // actual config
        Ext.Object.merge(newLayerConf, layerConf);
        return newLayerConf;
    },

    /**
     * Takes the configuration file of the application
     * and applies the default values to each layer definition.
     * @param {*} layerJson
     */
    applyDefaultsToApplicationConf: function (layerJson) {
        var me = this;

        var defaults = layerJson.defaults;

        var newConfiguration = { 'layers': [] };

        // loop through layers and apply defaults
        Ext.each(layerJson.layers, function (layerConf) {

            var newLayerConf = me.applyDefaultsToLayerConf(layerConf, defaults);

            // additionally update sublayers of switch layers
            if (newLayerConf.layerType == 'switchlayer') {

                var updatedSubLayers = [];
                // loop through sublayers and apply defaults
                Ext.each(newLayerConf.layers, function (subLayerConf) {

                    var newSubLayerConf = me.applyDefaultsToLayerConf(subLayerConf, defaults);
                    updatedSubLayers.push(newSubLayerConf);
                });
                // replace old layers with updated layers
                newLayerConf.layers = updatedSubLayers;
            }
            // add updated layer config to new configuration file
            newConfiguration.layers.push(newLayerConf);
        });
        return newConfiguration;
    },


    /**
     * @private
     */
    initComponent: function () {

        var me = this;

        // ensure custom projections are registered prior to creating the map

        proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
        proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');
        proj4.defs('EPSG:2157', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=0.99982 +x_0=600000 +y_0=750000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
        proj4.defs('EPSG:29902', '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs');

        // support deprecated ESRI code for EPSG3857
        // see https://support.esri.com/en-us/knowledge-base/why-does-arcgis-online-use-a-deprecated-spatial-referen-000013950
        proj4.defs('EPSG:102100', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

        ol.proj.proj4.register(proj4);

        // use app settings when available for zoom and center
        var viewConfig = {};

        var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;

        if (app && app.zoom) {
            viewConfig.zoom = app.zoom;
        }

        if (app && app.center) {
            viewConfig.center = app.center;
        }

        // now apply any defaults if not set by the app
        Ext.applyIf(viewConfig, me.mapViewConfig);

        var view = new ol.View(viewConfig);

        // create a default map if one has not already been created in a derived class
        if (!me.map) {
            me.map = new ol.Map({
                // layers will be created from default.json later
                layers: [],
                controls: ol.control.defaults.defaults().extend([
                    new ol.control.FullScreen()
                ]),
                interactions: ol.interaction.defaults.defaults().extend([
                    new ol.interaction.DragRotateAndZoom()
                ]),
                view: view
            });
        }

        // create default items if not already been created in a derived class
        if (!me.items) {
            me.items = [{
                xtype: 'gx_map',
                pointerRest: true,
                pointerRestInterval: 500,
                stateful: true,
                stateId: 'cmv_mapstate',
                map: me.map,
                listeners: {
                    afterrender: 'afterMapRender'
                }
            }, {
                xtype: 'cmv_minimized_windows_toolbar'
            }];
        }

        // Load layer JSON configuration
        app.getResourcePaths().then(function (resourcePaths) {
            Ext.Ajax.request({
                url: resourcePaths.layerConfig,
                success: function (response) {
                    var layerJson = Ext.decode(response.responseText);
                    var newConfiguration = me.applyDefaultsToApplicationConf(layerJson);

                    Ext.each(newConfiguration.layers, function (layerConf) {
                        var layer = LayerFactory.createLayer(layerConf);
                        if (layer) {
                            me.olMap.addLayer(layer);
                        }
                    });

                    //<debug>
                    // save the layer configuration as property on the application for debugging
                    app.layerJson = newConfiguration;
                    //</debug>

                    // fire event to inform subscribers that all layers are loaded
                    me.fireEvent('cmv-init-layersadded', me);

                    var timeSlider = me.down('cmv_timeslider');
                    if (timeSlider) {
                        timeSlider.fireEvent('allLayersAdded',
                            timeSlider.down('multislider'));
                    }
                }
            });
        });

        me.callParent(arguments);

        // make sub components accessible as members
        me.mapCmp = me.down('gx_map');
        me.olMap = me.mapCmp.map;

        if (me.enableMapClick) {
            me.olMap.on('singleclick', function (evt) {
                var clickedFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function (feature, layer) {
                        // collect all clicked features and their layers
                        clickedFeatures.push({ feature: feature, layer: layer });
                    },
                    {
                        hitTolerance: me.mapViewConfig.hitTolerance
                    }
                );

                // fire event to forward click info to subscribers
                me.fireEvent('cmv-mapclick', clickedFeatures, evt);
            });
        }

        if (me.enableMapHover) {
            me.mapCmp.on('pointerrest', function (evt) {
                var hoveredFeatures = [];
                me.olMap.forEachFeatureAtPixel(evt.pixel,
                    function (feature, layer) {
                        // collect all clicked features and their layers
                        hoveredFeatures.push({ feature: feature, layer: layer });
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

            // event for resolution change
            // we intentionally do not use the 'change:resolution',
            // because it fires too often
            // (see https://github.com/openlayers/openlayers/issues/7402)
            me.olMap.on('moveend', function (evt) {
                var targetResolution = evt.target.getView().getResolution();
                if (targetResolution === me.lastResolution) {
                    // resolution has not changed
                    return;
                }
                me.lastResolution = targetResolution;

                var switchLayerUtil = CpsiMapview.util.SwitchLayer;
                switchLayerUtil.handleSwitchLayerOnResolutionChange(targetResolution);
            }
            );
        }

        if (me.enablePermalink) {

            // create permalink provider
            var plProvider = Ext.create('GeoExt.state.PermalinkProvider');
            // set it in the state manager
            Ext.state.Manager.setProvider(plProvider);

            me.permalinkProvider = plProvider;

            if (window.location.hash !== '') {
                // try to restore center, zoom-level and rotation from the URL
                me.mapCmp.applyState(
                    me.permalinkProvider.readPermalinkHash(window.location.hash)
                );
            }

            me.registerPermalinkEvents();
        }

        Ext.GlobalEvents.fireEvent('cmv-mapready', me);

        var grouping = this.getPlugin('cmv_feature_attribute_grouping');
        if (grouping) {
            grouping.initGrouping(me.mapCmp, me.olMap);
        }

        me.olMap.set('defaultClickEnabled', true);
    },

    /**
     * Registers the events to have a permalink synchronization.
     *
     * @private
     */
    registerPermalinkEvents: function () {
        var me = this;

        // update permalink when visible map state changes
        me.permalinkProvider.on('statechange', function (stateProvider, stateId, state) {
            if (stateId === 'cmv_mapstate') {
                me.updatePermalink(state);
            }
        });

        // restore the view state when navigating through the history, see
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
        window.addEventListener('popstate', function (event) {
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
     * Updates the permalink as URL hash and pushes the state into the window
     * history.
     *
     * @private
     */
    updatePermalink: function (mapState) {
        var me = this;

        if (!me.shouldUpdatePermalink) {
            // do not update the URL when the view was changed in the 'popstate'
            // handler
            me.shouldUpdatePermalink = true;
            return;
        }

        // check if we have to round the coords (if no coordinates in deegrees)
        var doRound =
            me.roundPermalinkCoords &&
            me.olMap.getView().getProjection().getUnits() !== 'degrees';

        var hash = me.permalinkProvider.getPermalinkHash(doRound);

        // push the state into the window history (to navigate with browser's
        // back and forward buttons)
        window.history.pushState(mapState, 'map', hash);
    }
});
