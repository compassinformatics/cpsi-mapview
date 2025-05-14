/**
 * This class is the controller of the button to open the Street View tool.
 */
Ext.define('CpsiMapview.controller.button.StreetViewTool', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_streetview_tool',

    requires: ['CpsiMapview.view.window.MinimizableWindow', 'BasiGX.util.Map'],

    /**
     * The OL map work / sync with this tool.
     *
     * @property {ol.Map}
     * @readonly
     */
    map: null,

    /**
     * The Street View Service instance.
     *
     * @property {google.maps.StreetViewService}
     * @readonly
     */
    streetViewService: null,

    /**
     * The vector layer to draw the Street View position feature.
     *
     * @cfg {ol.layer.Vector}
     * @property {ol.layer.Vector}
     */
    vectorLayer: null,

    /**
     * The identificator for the layer to draw the Street View position feature.
     *
     * @property {String}
     * @private
     */
    vectorLayerName: 'StreetViewLayer',

    /**
     * Listener object for the 'pov_changed' event.
     * Used to unregister the event.
     *
     * @property {Object}
     * @private
     */
    svPovChangedListener: null,

    /**
     * Listener object for the 'position_changed' event.
     * Used to unregister the event.
     *
     * @property {Object}
     * @private
     */
    svPositionChangedListener: null,

    constructor: function () {
        const me = this;
        me.onMapClick = me.onMapClick.bind(me);
        me.callParent(arguments);
    },

    /**
     * @private
     */
    init: function () {
        const me = this;
        const view = me.getView();

        // helper function to disable tool when GMaps API is not available
        const reactOnMissingGmapsApi = function () {
            Ext.Logger.warn(
                'No Google Maps JS-API available. ' +
                    'The Street View tool will be deactivated.'
            );
            view.setDisabled(true);
            return;
        };
        // GMaps API missing at all
        if (!Ext.isObject(window.google)) {
            reactOnMissingGmapsApi();
            return;
        }
        // GMaps API not usable due to missing API key or similar
        window.gm_authFailure = reactOnMissingGmapsApi;

        // detect the map instance we work on
        if (view.map && view.map instanceof ol.Map) {
            me.map = view.map;
        } else {
            // guess map as fallback
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        // create a vector layer for position if not passed in
        if (!me.vectorLayer) {
            const style =
                view.vectorLayerStyle ||
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: view.vectorIcon
                    })
                });

            me.vectorLayer = new ol.layer.Vector({
                name: me.vectorLayerName,
                source: new ol.source.Vector(),
                style: style
            });
        }

        // init the Street View Service instance
        me.streetViewService = new google.maps.StreetViewService();
    },

    /**
     * Handles the 'toggle' event of the button (view).
     *
     * @param  {Ext.button.Button} btn The toggled button
     * @param  {Boolean}           pressed New pressed state
     * @private
     */
    onToggle: function (btn, pressed) {
        const me = this;

        if (pressed) {
            // add layer and raise layer to top of stack
            me.map.addLayer(me.vectorLayer);
        } else {
            me.map.removeLayer(me.vectorLayer);
            // cleanup
            me.vectorLayer.getSource().clear();
            if (me.streetViewWin) {
                me.streetViewWin.close();
            }
        }

        // activate / deactivate click
        me.registerMapListeners(pressed);
    },

    /**
     * Handles the 'beforedestroy' event of the view.
     * Performs several cleanup steps.
     */
    onBeforeDestroy: function () {
        const me = this;
        const btn = me.getView();

        // detoggle button, forces clearing layer
        me.onToggle(btn, false);
        // remove GMaps events
        me.unregisterGmapsEvents();
        // clean-up window
        if (me.streetViewWin) {
            me.streetViewWin.close();
            me.streetViewWin = null;
        }
    },

    /**
     * Registers listeners on the map we need for this tool.
     *
     * @param  {Boolean} activate Flag to activate / deactivate the listeners
     */
    registerMapListeners: function (activate) {
        const me = this;

        if (activate) {
            me.map.on('singleclick', me.onMapClick);
        } else {
            me.map.un('singleclick', me.onMapClick);
        }
    },

    /**
     * Handles 'singleclick' event on the map.
     * Show window with Street View panorama for clicked position (if existing)
     *
     * @param  {ol.MapBrowserEvent} evt OL event object
     * @private
     */
    onMapClick: function (evt) {
        const me = this;
        const clickCoord = evt.coordinate;

        const gmapsLatLng = me.olCoord2GmapsLatLng(clickCoord);
        me.showStreetViewWindow(gmapsLatLng);
    },

    /**
     * Shows the window with the Street View panorama at the given position or
     * fires an event 'missingpanorama' on the view instance of this controller.
     *
     * @param  {google.maps.LatLng} latLng Position to show SV panorama at
     * @private
     */
    showStreetViewWindow: function (latLng) {
        const me = this;
        const view = me.getView();

        if (!me.streetViewWin) {
            me.streetViewWin = Ext.create(
                'CpsiMapview.view.window.MinimizableWindow',
                {
                    title: view.svWinTitlePrefix,
                    width: view.svWinWidth,
                    height: view.svWinHeight,
                    closeAction: 'destroy',
                    autoShow: false,
                    listeners: {
                        afterrender: function (win) {
                            // render SV panorama to body of the window
                            me.svDiv = Ext.getDom(win.body);
                        },
                        resize: function () {
                            // reload the panorama to fit the new window size
                            if (me.svPanorama) {
                                // for an open window use the current position
                                me.showStreetViewWindow(
                                    me.svPanorama.getPosition()
                                );
                            } else {
                                // for a new window use the new position
                                me.showStreetViewWindow(latLng);
                            }
                        },
                        destroy: function () {
                            me.unregisterGmapsEvents();
                            me.svPanorama = null;
                            me.streetViewWin = null;
                            me.vectorLayer.getSource().clear();
                        }
                    }
                }
            );
        }

        // load the panorama for the given position
        me.streetViewService.getPanoramaByLocation(
            latLng,
            50,
            function (data, status) {
                if (status === google.maps.StreetViewStatus.OK) {
                    const win = me.streetViewWin;
                    const title =
                        view.svWinTitlePrefix +
                        view.svWinTitleDateLabel +
                        data.imageDate;

                    win.setTitle(title);
                    win.show();

                    // create new Street View panorama
                    const panoConf = {
                        position: latLng,
                        pov: view.svDefaultPov
                    };
                    me.svPanorama = new google.maps.StreetViewPanorama(
                        me.svDiv
                    );
                    me.svPanorama.setPov(panoConf.pov);
                    me.svPanorama.setPosition(panoConf.position);

                    // initially draw the position on the map and set heading
                    me.drawPositionFeature(me.gmapsLatLng2olCoord(latLng));
                    me.updatePositionFeature();

                    me.registerGmapsEvents();
                } else {
                    // inform subscribers that there was no panorama for clicked pos
                    me.getView().fireEvent('missingpanorama', {
                        msg: 'No StreetView panorama available at clicked location'
                    });

                    if (view.showNoPanoramaWarning) {
                        Ext.MessageBox.alert(
                            view.noPanoramaWarningTitle,
                            view.noPanoramaWarningText
                        );
                    }
                }
            }
        );
    },

    /**
     * Draws the position feature on the map. Clears an eventually existing
     * position feature before adding the new one.
     *
     * @param  {ol.Coordinate} coord Position to draw on the map
     * @private
     */
    drawPositionFeature: function (coord) {
        const me = this;
        const vectorSource = me.vectorLayer.getSource();

        // remove existing position feature
        vectorSource.clear();
        // add new position feature
        const posFeat = new ol.Feature({
            geometry: new ol.geom.Point(coord)
        });
        vectorSource.addFeature(posFeat);
    },

    /**
     * Updates an existing position feature by applying the current position and
     * heading of the currently opened SV panorama.
     */
    updatePositionFeature: function () {
        const me = this;

        if (!me.svPanorama) {
            return;
        }

        const newHeading = me.getHeadingRad();
        const newPosCoord = me.getPositionCoord();
        const vectorSource = me.vectorLayer.getSource();
        const feat = vectorSource.getFeatures()[0];

        if (feat) {
            // move position feature to current position
            feat.getGeometry().setCoordinates(newPosCoord);

            // rotate position feature to current heading
            me.vectorLayer.getStyle().getImage().setRotation(newHeading);
        }
    },

    /**
     * Handles 'pov_changed' event of the SV panorama.
     * Triggers #updatePositionFeature.
     *
     * @private
     */
    handlePovChanged: function () {
        const me = this;
        me.updatePositionFeature();
    },

    /**
     * Handles 'position_changed' event of the SV panorama.
     * Triggers #updatePositionFeature.
     *
     * @private
     */
    handlePositionChanged: function () {
        const me = this;
        me.updatePositionFeature();
    },

    /**
     * Returns the current heading of the SV panorama as radiant.
     *
     * @return {Number} Heading in radiant
     */
    getHeadingRad: function () {
        const me = this;
        let heading = me.svPanorama.getPov().heading;

        // normalize and convert to radiant
        heading = me.normaliseDegrees(heading);
        heading = (heading / 180) * Math.PI;

        return heading;
    },

    /**
     * Returns the current position of the SV panorama as OL coordinate.
     *
     * @return {ol.Coordinate} SV panorama position
     */
    getPositionCoord: function () {
        const me = this;
        const pos = me.svPanorama.getPosition();
        return me.gmapsLatLng2olCoord(pos);
    },

    /**
     * Normalizes the given degree value.
     *
     * @param  {Number} value Degree value to normalize
     * @return {Number}       Normalized degree value
     * @private
     */
    normaliseDegrees: function (value) {
        if (value < 0) {
            value += 360;
        } else {
            if (value > 360) {
                value -= 360;
            }
        }
        return Number(value);
    },

    /**
     * Converts an OpenLayers coordinate to a Google Maps LatLng object.
     * Transforms the coordinates to EPSG:4326.
     *
     * @param  {ol.Coordinate} coords OL coordinate to transform
     * @return {google.maps.LatLng}   Google Maps LatLng object
     */
    olCoord2GmapsLatLng: function (coords) {
        const me = this;
        const latLonProj = 'EPSG:4326';
        const mapProj = me.map.getView().getProjection().getCode();

        let latLonCoord;
        if (mapProj !== latLonProj) {
            latLonCoord = ol.proj.transform(coords, mapProj, latLonProj);
        } else {
            latLonCoord = coords;
        }

        return new google.maps.LatLng(latLonCoord[1], latLonCoord[0]);
    },

    /**
     * Converts an Google Maps LatLng object to a OpenLayers coordinate.
     * Transforms the coordinates to the map projection.
     *
     * @param  {google.maps.LatLng} latLng Google Maps LatLng object
     * @return {ol.Coordinate}             OL coordinate in map projection
     */
    gmapsLatLng2olCoord: function (latLng) {
        const me = this;
        const latLonProj = 'EPSG:4326';
        const mapProj = me.map.getView().getProjection().getCode();
        const latLonCoord = [latLng.lng(), latLng.lat()];

        let mapCoord;
        if (mapProj !== latLonProj) {
            mapCoord = ol.proj.transform(latLonCoord, latLonProj, mapProj);
        } else {
            mapCoord = latLonCoord;
        }

        return mapCoord;
    },

    /**
     * Registers the 'pov_changed' and the 'position_changed' events for the
     * SV panorama.
     */
    registerGmapsEvents: function () {
        const me = this;
        me.svPovChangedListener = google.maps.event.addListener(
            me.svPanorama,
            'pov_changed',
            me.handlePovChanged.bind(me)
        );
        me.svPositionChangedListener = google.maps.event.addListener(
            me.svPanorama,
            'position_changed',
            me.handlePositionChanged.bind(me)
        );
    },

    /**
     * Unregisters the 'pov_changed' and the 'position_changed' events for the
     * SV panorama.
     */
    unregisterGmapsEvents: function () {
        const me = this;
        google.maps.event.removeListener(me.svPovChangedListener);
        google.maps.event.removeListener(me.svPositionChangedListener);
    }
});
