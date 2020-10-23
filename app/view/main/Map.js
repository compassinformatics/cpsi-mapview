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
        'CpsiMapview.plugin.FeatureAttributeGrouping'
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
        }
    ],

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

    /**
     * @event cmv-init-layersadded
     * Fires when all initial layers from the config have been created and added to the OL map.
     * @param {CpsiMapview.view.main.Map} this
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
     * Applies the default values to each layer
     * @param {*} layerConf
     * @param {*} defaults
     */
    applyDefaultsToLayerConf : function(layerConf, defaults){

        var newLayerConf = {};

        // general default
        var generalDefaults = defaults['general'];
        Ext.Object.merge(newLayerConf, generalDefaults);

        // layer type default
        var typeDefaults = defaults[layerConf.layerType];
        Ext.Object.merge(newLayerConf,typeDefaults);

        // actual config
        Ext.Object.merge(newLayerConf, layerConf);
        return newLayerConf;
    },

    /**
     * Takes the configuration file of the application
     * and applies the default values to each layer definition.
     * @param {*} layerJson
     */
    applyDefaultsToApplicationConf: function(layerJson){
        var me = this;

        var defaults = layerJson.defaults;

        var newConfiguration = {'layers':[]};

        // loop through layers and apply defaults
        Ext.each(layerJson.layers, function (layerConf) {

            var newLayerConf = me.applyDefaultsToLayerConf(layerConf, defaults);

            // additionally update sublayers of switch layers
            if(newLayerConf.layerType == 'switchlayer'){

                var updatedSubLayers = [];
                // loop through sublayers and apply defaults
                Ext.each(newLayerConf.layers, function(subLayerConf){

                    var newSubLayerConf = me.applyDefaultsToLayerConf( subLayerConf, defaults);
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

        // create a default map if one has not already been created in a derived class
        if (!me.map) {
            me.map = new ol.Map({
                // layers will be created from config in initComponent
                layers: [],
                controls: ol.control.defaults().extend([
                    new ol.control.FullScreen()
                ]),
                interactions: ol.interaction.defaults().extend([
                    new ol.interaction.DragRotateAndZoom()
                ]),
                view: new ol.View({
                    center: ol.proj.fromLonLat([-8, 53.5]),
                    zoom: 8
                })
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
                plugins: [
                    {
                        ptype: 'cmv_feature_info_window'
                    }
                ],
                listeners: {
                    afterrender: 'afterMapRender'
                }
            }, {
                xtype: 'cmv_minimized_windows_toolbar'
            }];
        }

        // Load layer JSON configuration
        Ext.Ajax.request({
            url: 'resources/data/layers/default.json',
            success: function (response) {
                var layerJson = Ext.decode(response.responseText);
                var newConfiguration = me.applyDefaultsToApplicationConf(layerJson);

                Ext.each(newConfiguration.layers, function (layerConf) {
                    var layer = LayerFactory.createLayer(layerConf);
                    if (layer) {
                        me.olMap.addLayer(layer);
                    }
                });

                // fire event to inform subscribers that all layers are loaded
                me.fireEvent('cmv-init-layersadded', me);

                var timeSlider = me.down('cmv_timeslider');
                if (timeSlider) {
                    timeSlider.fireEvent('allLayersAdded',
                        timeSlider.down('multislider'));
                }
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

            // listener that checks the resolution and changes the switch layer if required
            me.olMap.getView().on('change:resolution',
                LayerFactory.handleSwitchLayerOnResolutionChange);
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
            me.updatePermalink(state);
        });

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
