/**
 * This class is the controller for the button 'SpatialQueryButton'
 */
Ext.define('CpsiMapview.controller.button.SpatialQueryButtonController', {
    extend: 'Ext.app.ViewController',

    requires: ['BasiGX.util.Layer'],

    alias: 'controller.cmv_spatial_query_btn',

    /**
     * The {ol.interaction.Draw} used to draw the geometry used in the spatial
     * query
     * @property{ol.interaction.Draw}
     */
    drawQueryInteraction: null,

    /**
     * The {ol.interaction.Modify} used to modify the geometry used in the spatial
     * query
     * @property{ol.interaction.Modify}
     */
    modifiyQueryInteraction: null,

    /**
     * The {ol.interaction.Snap} used to snap to the points of the geometry used
     * in the spatial query
     * @property{ol.interaction.Snap}
     */
    snapQueryInteraction: null,

    /**
     * The layer that contains the geometry used in the spatial query, if
     * displayPermanently is set to true
     * @property{ol.layer.Vector}
     */
    permanentLayer: null,

    /**
     * Flag indicating if the layer was created directly by the tool or
     * is an existing layer passed as a configuration option
     * @property {boolean}
     */
    permanentLayerCreatedByTool: false,

    /**
     * The OpenLayers map. If not given, will be auto-detected
     */
    map: null,

    /**
     * The BasiGX mapComponent. If not given, will be auto-detected
     */
    mapComponent: null,

    constructor: function () {
        const me = this;
        me.getFeaturesFromSourceAndTriggerWfs =
            me.getFeaturesFromSourceAndTriggerWfs.bind(me);
        me.getGeometryFromPolygonAndTriggerWfs =
            me.getGeometryFromPolygonAndTriggerWfs.bind(me);
        me.onQueryLayerVisibilityChange =
            me.onQueryLayerVisibilityChange.bind(me);
        me.callParent(arguments);
    },

    /**
     * Function to determine the query layer if not yet defined in class
     */
    findQueryLayer: function () {
        const me = this;
        const view = me.getView();
        if (!view.queryLayer && view.queryLayerName) {
            view.queryLayer = BasiGX.util.Layer.getLayerByName(
                view.queryLayerName
            );
        }

        if (!view.queryLayer) {
            Ext.Logger.warn(
                'No queryLayer found in the map for the SpatialQueryButton with the name: ' +
                    view.queryLayerName
            );
        }
    },

    /**
     * Activates #drawQueryInteraction on button toggle to draw polygon
     * selection geometry that will be used for filtering.
     *
     * @param {Ext.button.Button} btn The toggled select by polygon button.
     * @param {Boolean} pressed The toggle state.
     */
    onSpatialQueryBtnToggle: function (btn, pressed) {
        const me = this;
        const view = me.getView();

        if (view.map && view.map instanceof ol.Map) {
            me.map = view.map;
        } else {
            // guess map as fallback
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        if (!view.queryLayer) {
            me.findQueryLayer();
        }

        let geometryFunction;
        let type = view.drawGeometryType;
        if (view.spatialOperator === 'bbox') {
            type = 'Circle';
            geometryFunction = ol.interaction.Draw.createBox();
        }

        const vectorLayerKey = view.getVectorLayerKey();
        me.permanentLayer =
            CpsiMapview.view.button.SpatialQueryButton.findAssociatedPermanentLayer(
                me.map,
                vectorLayerKey
            );
        if (me.permanentLayer === undefined) {
            me.permanentLayerCreatedByTool = true; // add flag indicating the tool will handle the destruction of the layer
            me.permanentLayer = new ol.layer.Vector({
                source: new ol.source.Vector()
            });
            me.permanentLayer.set('associatedLayerKey', vectorLayerKey);
            me.permanentLayer.set('isSpatialQueryLayer', true);
            me.permanentLayer.set('name', vectorLayerKey + '_spatialfilter');
            // connect hide and show to query layer hide and show
            me.connectQueryLayer();
        }

        const permanentLayerSource = me.permanentLayer.getSource();
        if (!me.drawQueryInteraction) {
            if (view.displayPermanently) {
                me.map.addLayer(me.permanentLayer);
                me.drawQueryInteraction = new ol.interaction.Draw({
                    source: permanentLayerSource,
                    geometryFunction: geometryFunction,
                    type: type
                });

                me.modifiyQueryInteraction = new ol.interaction.Modify({
                    source: permanentLayerSource
                });
                me.snapQueryInteraction = new ol.interaction.Snap({
                    source: permanentLayerSource
                });
                me.map.addInteraction(me.modifiyQueryInteraction);
                me.map.addInteraction(me.snapQueryInteraction);
            } else {
                me.drawQueryInteraction = new ol.interaction.Draw({
                    features: view.queryFeatures,
                    geometryFunction: geometryFunction,
                    type: type
                });
            }
            me.map.addInteraction(me.drawQueryInteraction);
        }
        if (pressed) {
            me.drawQueryInteraction.setActive(true);
            me.map
                .getViewport()
                .addEventListener('contextmenu', me.contextHandler);
            if (view.displayPermanently) {
                me.modifiyQueryInteraction.setActive(true);
                me.snapQueryInteraction.setActive(true);
                me.drawQueryInteraction.on(
                    'drawend',
                    me.getFeaturesFromSourceAndTriggerWfs
                );
                me.modifiyQueryInteraction.on(
                    'modifyend',
                    me.getFeaturesFromSourceAndTriggerWfs
                );
            } else {
                view.queryFeatures.on(
                    'add',
                    me.getGeometryFromPolygonAndTriggerWfs
                );
            }
        } else {
            me.drawQueryInteraction.setActive(false);
            me.map
                .getViewport()
                .removeEventListener('contextmenu', me.contextHandler);
            if (view.displayPermanently) {
                me.modifiyQueryInteraction.setActive(false);
                me.snapQueryInteraction.setActive(false);
                me.drawQueryInteraction.un(
                    'drawend',
                    me.getFeaturesFromSourceAndTriggerWfs
                );
                me.modifiyQueryInteraction.un(
                    'modifyend',
                    me.getFeaturesFromSourceAndTriggerWfs
                );
            } else {
                view.queryFeatures.un(
                    'add',
                    me.getGeometryFromPolygonAndTriggerWfs
                );
            }
        }
    },

    /**
     * Method shows the context menu on mouse right click
     * @param {Event} evt The browser event
     */
    showContextMenu: function (evt) {
        // suppress default browser behaviour
        evt.preventDefault();

        const me = this.scope;

        const menu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            renderTo: Ext.getBody(),
            items: [
                {
                    text: 'Clear Feature',
                    scope: me,
                    handler: function () {
                        const view = me.getView();
                        // remove the spatial filter on the layer by firing an event
                        view.fireEvent('cmv-spatial-query-filter', null);
                        // now remove the polygon from the layer
                        me.onClearAssociatedPermanentLayer();
                    }
                },
                {
                    text: 'Cancel Drawing',
                    scope: me,
                    handler: function () {
                        me.drawQueryInteraction.abortDrawing();
                    }
                }
            ]
        });
        menu.showAt(evt.pageX, evt.pageY);
    },
    /**
     * Connects the change:visible event of the query layer
     * to the permanent layer. Thereby, when the query layer
     * visibility is changed, the visibility of the permanent layer
     * changes accordingly.
     */
    connectQueryLayer: function () {
        const me = this;
        const view = me.getView();
        const layerKey = view.getVectorLayerKey();
        if (!layerKey) {
            return;
        }
        if (view.queryLayer) {
            view.queryLayer.on(
                'change:visible',
                me.onQueryLayerVisibilityChange
            );
        }
    },

    /**
     * Event handler for the change:visible event of the
     * query layer.
     * @param {ol.Object.event} evt change:visible event of layer
     */
    onQueryLayerVisibilityChange: function (evt) {
        const me = this;
        const visible = evt.target.getVisible();
        if (visible) {
            me.onShowAssociatedPermanentLayer();
        } else {
            me.onHideAssociatedPermanentLayer();
        }
    },

    /**
     * Creates a Filter object from the passed geometry and queryLayer
     *
     * @param  {ol.geom.Geometry} geometry The geometry
     * @return {Ext.util.Filter}       A filter spatial
     * @private
     */
    createSpatialFilter: function (geometry) {
        const me = this;
        let filter = null;

        const view = me.getView();
        if (!view.queryLayer) {
            return;
        }

        const mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();
        const projString = mapComp.getMap().getView().getProjection().getCode();
        const geomFieldName =
            view.queryLayer.get('geomFieldName') ||
            view.queryLayer.getSource().get('geomFieldName') ||
            'the_geom';

        if (!Ext.isEmpty(geometry)) {
            filter = GeoExt.util.OGCFilter.createSpatialFilter(
                view.spatialOperator,
                geomFieldName,
                geometry,
                projString
            );
        }

        return filter;
    },

    /**
     * Handles the modifyend and drawend events of the draw layer
     * @param {ol.Object.event} evt ol modifyend or drawend event
     */
    getFeaturesFromSourceAndTriggerWfs: function (evt) {
        const me = this;
        let feature;
        if (evt.type === 'modifyend') {
            // We expect to only have one existing feature in source.
            // In case multiple features exist, we only use the one
            // that was added last
            feature = evt.features.getArray()[evt.features.getLength() - 1];
        } else if (evt.type === 'drawend') {
            // clear previously drawn features so that only one feature exists
            me.permanentLayer.getSource().clear();
            feature = evt.feature;
        }
        const fakeEvent = { element: feature };
        me.getGeometryFromPolygonAndTriggerWfs(fakeEvent);
    },

    /**
     * Helper method to create a polygon geometry from drawn irregular polygon.
     *
     * @param {Ext.Event} evt The add-Event containing drawn feature
     */
    getGeometryFromPolygonAndTriggerWfs: function (evt) {
        const me = this;
        const geometry = evt.element.getGeometry();
        const view = me.getView();

        const filter = me.createSpatialFilter(geometry);
        view.fireEvent('cmv-spatial-query-filter', filter);
        if (view.triggerWfsRequest === true) {
            this.buildAndRequestQuery(geometry);
        }
    },

    /**
     * Build query / filter and call WFS
     *
     * @param {ol.geom.Geometry} geometry The geometry
     */
    buildAndRequestQuery: function (geometry) {
        const me = this;
        const view = me.getView();
        if (!view.queryLayer) {
            return;
        }

        const mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();

        const projString = mapComp.getMap().getView().getProjection().getCode();
        const geomFieldName =
            view.queryLayer.get('geomFieldName') ||
            view.queryLayer.getSource().get('geomFieldName') ||
            'the_geom';
        const url =
            view.queryLayer.get('url') ||
            view.queryLayer.getSource().getUrl() ||
            view.queryLayer.getSource().getUrls()[0];

        const featureType =
            view.queryLayer.get('featureType') ||
            BasiGX.util.Object.layersFromParams(
                view.queryLayer.getSource().getParams()
            );

        if (!Ext.isEmpty(geometry)) {
            const filter = GeoExt.util.OGCFilter.getOgcFilter(
                geomFieldName,
                view.spatialOperator,
                geometry,
                '1.1.0',
                projString
            );

            mapComp.setLoading(true);
            BasiGX.util.WFS.executeWfsGetFeature(
                url,
                view.queryLayer,
                projString,
                null,
                geomFieldName,
                filter,
                null,
                me.onWfsExecuteSuccess,
                me.onWfsExecuteFailure,
                me,
                null,
                featureType
            );
        }
    },

    /**
     * Handle a successful WFS request.
     *
     * @param {XMLHttpRequest.response} response The response of the AJAX call.
     */
    onWfsExecuteSuccess: function (response) {
        const me = this;
        const view = me.getView();
        const mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();
        mapComp.setLoading(false);
        const wfsResponse = response.responseText;
        if (wfsResponse.indexOf('Exception') > 0) {
            // something got wrong and we probably have an exception, that we
            // try to handle...
            BasiGX.util.WFS.handleWfsExecuteException(wfsResponse);
            view.fireEvent('cmv-spatial-query-error', wfsResponse);
        } else {
            const decodedResponse = Ext.decode(wfsResponse);
            view.fireEvent('cmv-spatial-query-success', decodedResponse);
        }
    },

    /**
     * Handle WFS GetFeature failure.
     *
     * @param {XMLHttpRequest.response} response The response of the AJAX call.
     */
    onWfsExecuteFailure: function (response) {
        const me = this;
        const view = me.getView();
        let responseTxt;
        if (response && response.responseText) {
            responseTxt = response.responseText;
        }
        const mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();
        mapComp.setLoading(false);
        view.fireEvent('cmv-spatial-query-error', responseTxt);
    },

    /**
     * Handles clearing the permanentLayer of the instance.
     */
    onClearAssociatedPermanentLayer: function () {
        const me = this;
        const layerKey = me.getView().getVectorLayerKey();
        if (!me.map) {
            return;
        }
        if (!layerKey) {
            return;
        }
        CpsiMapview.view.button.SpatialQueryButton.clearAssociatedPermanentLayer(
            me.map,
            layerKey
        );
    },

    /**
     * Handles showing the permanentLayer of the instance.
     */
    onShowAssociatedPermanentLayer: function () {
        const me = this;
        const layerKey = me.getView().getVectorLayerKey();
        if (!me.map) {
            return;
        }
        if (!layerKey) {
            return;
        }
        CpsiMapview.view.button.SpatialQueryButton.showAssociatedPermanentLayer(
            me.map,
            layerKey
        );
    },

    /**
     * Handles hiding the permanentLayer of the instance.
     */
    onHideAssociatedPermanentLayer: function () {
        const me = this;
        const layerKey = me.getView().getVectorLayerKey();
        if (!me.map) {
            return;
        }
        if (!layerKey) {
            return;
        }
        CpsiMapview.view.button.SpatialQueryButton.hideAssociatedPermanentLayer(
            me.map,
            layerKey
        );
    },

    onBeforeDestroy: function () {
        const me = this;
        const view = me.getView();

        // detoggle button
        me.onSpatialQueryBtnToggle(view, false);

        if (me.modifiyQueryInteraction) {
            me.map.removeInteraction(me.modifiyQueryInteraction);
        }

        if (me.snapQueryInteraction) {
            me.map.removeInteraction(me.snapQueryInteraction);
        }

        if (me.drawQueryInteraction) {
            me.map.removeInteraction(me.drawQueryInteraction);
        }

        if (me.permanentLayer && me.permanentLayerCreatedByTool) {
            me.map.removeLayer(me.permanentLayer);
        }
    },

    init: function () {
        const me = this;

        // create an object for the contextmenu eventhandler
        // so it can be removed correctly
        me.contextHandler = {
            handleEvent: me.showContextMenu,
            scope: me
        };
    }
});
