/**
 * A mixin to add tracing functionality to a drawing tool.
 *
 * The basic functionality is taken from the official OpenLayers example:
 * https://openlayers.org/en/latest/examples/tracing.html
 *
 * @class CpsiMapview.controller.button.TracingMixin
 */
Ext.define('CpsiMapview.controller.button.TracingMixin', {
    extend: 'Ext.Mixin',

    requires: [
        'BasiGX.util.Map',
        'CpsiMapview.util.Tracing'
    ],

    /**
     * The style of the preview line during tracing.
     */
    previewStyle: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 1)',
            width: 10,
        })
    }),

    /**
     * Enhances drawing functionality by adding tracing to it.
     *
     * @param {String[]} tracingLayerKeys The keys of the layers to trace
     * @param {ol.interaction.Draw} drawInteraction draw interaction to attach the tracing on
     * @param {Boolean} [showTraceableEdges=false] If the traceable edges shall be shown (useful for debugging)
     */
    initTracing: function (tracingLayerKeys, drawInteraction, showTraceableEdges) {
        var me = this;

        if (me.getView()) {
            me.getView().fireEvent('tracingstart');
        }

        if (!drawInteraction) {
            return;
        }

        me.tracingDrawInteraction = drawInteraction;

        me.onTracingDrawStart = me.onTracingDrawStart.bind(this);
        me.onTracingDrawEnd = me.onTracingDrawEnd.bind(this);

        me.tracingActive = false;
        me.tracingDrawInteraction.on('drawstart', me.onTracingDrawStart);
        me.tracingDrawInteraction.on('drawend', me.onTracingDrawEnd);

        if (!tracingLayerKeys) {
            return;
        }
        // get tracing layers
        me.tracingLayers = [];
        Ext.each(tracingLayerKeys, function (key) {
            var foundLayers = BasiGX.util.Layer.getLayersBy('layerKey', key);
            if (foundLayers.length > 0) {
                me.tracingLayers.push(foundLayers[0]);
            }
        });

        // the options for the eachFeature functions
        me.forEachFeatureOptions = {
            hitTolerance: 10,
            layerFilter: function (layer) {
                return Ext.Array.contains(me.tracingLayers, layer);
            },
        };

        me.tracingFeature = new ol.Feature({
            geometry: new ol.geom.LineString([]),
        });
        me.tracingFeatureArray = [];
        me.tracingStartPoint = null;
        me.tracingEndPoint = null;

        // For debugging the traceable edges can be displayed
        me.tracingVector = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [me.tracingFeature],
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [255, 255, 0, 0.5],
                    width: 25
                })
            })
        });
        if (showTraceableEdges) {
            me.map.addLayer(me.tracingVector);
        }

        // the tracing util
        me.tracingUtil = CpsiMapview.util.Tracing;

        // the visible tracing line while editing
        me.previewLine = new ol.Feature({
            geometry: new ol.geom.LineString([]),
        });

        me.previewVector = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [me.previewLine],
            }),
            style: me.previewStyle
        });
        me.map.addLayer(me.previewVector);

        // bind scope to listener functions
        me.onTracingPointerMove = me.onTracingPointerMove.bind(me);
        me.onTracingMapClick = me.onTracingMapClick.bind(me);

        me.map.on('click', me.onTracingMapClick);
        me.map.on('pointermove', me.onTracingPointerMove);
    },

    /**
     * Sets the variable 'me.tracingActive' to true.
     */
    onTracingDrawStart: function () {
        var me = this;
        me.tracingActive = true;
    },

    /**
     * Sets the variable 'me.tracingActive' to false.
     */
    onTracingDrawEnd: function () {
        var me = this;
        me.tracingActive = false;
    },

    /**
     * Remove listeners and layers
     */
    cleanupTracing: function () {
        var me = this;
        me.map.removeLayer(me.previewVector);
        me.map.removeLayer(me.tracingVector);
        me.map.un('click', me.onTracingMapClick);
        me.map.un('pointermove', me.onTracingPointerMove);
        me.tracingDrawInteraction.un('drawstart', me.onTracingDrawStart);
        me.tracingDrawInteraction.un('drawend', me.onTracingDrawEnd);
    },

    /**
     * Listen to click to start and end the tracing.
     *
     * @param {Event} event The OpenLayers click event.
     */
    onTracingMapClick: function (event) {
        var me = this;

        var hit = false;
        me.map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                if (me.tracingUtil.lineStringPopulated(me.tracingFeature) && !me.tracingFeatureArray.includes(feature)) {
                    return;
                }

                hit = true;
                var coord = me.map.getCoordinateFromPixel(event.pixel);

                // second click on the tracing feature: append the ring coordinates
                if (me.tracingUtil.lineStringPopulated(me.tracingFeature) && me.tracingFeatureArray.includes(feature)) {
                    me.tracingEndPoint = me.tracingFeature.getGeometry().getClosestPoint(coord);
                    var appendCoords = me.tracingUtil.getPartialSegmentCoords(
                        me.tracingFeature,
                        me.tracingStartPoint,
                        me.tracingEndPoint
                    );

                    // send coordinates to parent component
                    if (me.getView()) {
                        // NOTE: we transfer the coordinates via an event,
                        //       but this mixin has access to the drawInteraction as well,
                        //       hence we could directly apply the coordinates to the drawInteraction
                        //       without an event
                        me.getView().fireEvent('tracingend', appendCoords);
                    }

                    me.tracingFeature.getGeometry().setCoordinates([]);
                    me.tracingFeatureArray = [];
                    me.previewLine.getGeometry().setCoordinates([]);
                }

                var geom = feature.clone().getGeometry();
                // start tracing on the feature ring
                var coords = geom.getCoordinates();

                me.tracingFeature.getGeometry().setCoordinates(
                    coords
                );
                me.tracingFeatureArray.push(feature);
                me.tracingStartPoint = me.tracingFeature.getGeometry().getClosestPoint(coord);
            },
            me.forEachFeatureOptions
        );

        if (!hit) {
            // clear current tracing feature & preview
            me.previewLine.getGeometry().setCoordinates([]);
            me.tracingFeature.getGeometry().setCoordinates([]);
            me.tracingFeatureArray = [];
        }
    },

    /**
     * Create the tracing geometry when pointer is moved.
     *
     * @param {Event} event The OpenLayers move event
     */
    onTracingPointerMove: function (event) {
        var me = this;

        if (me.tracingUtil.lineStringPopulated(me.tracingFeature) && me.tracingActive) {
            var coordOnFoundFeature = null;
            me.map.forEachFeatureAtPixel(
                event.pixel,
                function (foundFeature) {

                    // find coordinate on found feature
                    if (me.tracingFeatureArray.includes(foundFeature)) {
                        coordOnFoundFeature = me.map.getCoordinateFromPixel(event.pixel);
                    }

                    if (me.tracingFeatureArray.includes(foundFeature)) {
                        me.updateTraceableFeature(foundFeature);

                    } else {
                        // new feature found that needs to be added to tracingfeature

                        var foundGeom = foundFeature.getGeometry();
                        var tracingGeom = me.tracingFeature.getGeometry();

                        var touchingStartEnd = me.tracingUtil.linesTouchAtStartEndPoint(foundGeom, tracingGeom);

                        var tracingInteriorTouchesFoundFeatureStartEnd = me.tracingUtil.lineInteriorTouchesLineStartEnd(tracingGeom, foundGeom);

                        var tracingStartEndTouchesFoundInterior = me.tracingUtil.lineStartEndTouchesLineInterior(tracingGeom, foundGeom);

                        if (touchingStartEnd) {
                            me.setNewTracingOnStartEndTouch(foundFeature);
                        } else if (tracingInteriorTouchesFoundFeatureStartEnd) {
                            // TODO: must be implemented

                        } else if (tracingStartEndTouchesFoundInterior) {
                            // TODO: must be implemented
                        }
                    }
                },
                me.forEachFeatureOptions
            );

            var previewCoords = [];
            if (coordOnFoundFeature) {
                me.tracingEndPoint = me.tracingFeature.getGeometry().getClosestPoint(coordOnFoundFeature);
                previewCoords = me.tracingUtil.getPartialSegmentCoords(
                    me.tracingFeature,
                    me.tracingStartPoint,
                    me.tracingEndPoint
                );
            }
            me.previewLine.getGeometry().setCoordinates(previewCoords);
        }
    },

    /**
     * Updates the currently active traceable feature.
     *
     * @param {ol.Feature} foundFeature The hovered feature found in the tracing feature array
     */
    updateTraceableFeature: function (foundFeature) {
        var me = this;

        // check if found feature is last of array
        var index = me.tracingFeatureArray.indexOf(foundFeature);
        if (index !== 0 && (!index || index === -1)) {
            Ext.Logger.error('The found feature must be in the found features array.');
            return;
        }
        var notLastFeature = (index !== (me.tracingFeatureArray.length - 1));

        if (notLastFeature) {

            // remove all features after hovered feature
            me.tracingFeatureArray = me.tracingFeatureArray.slice(0, index + 1);
            // update coordinates of tracingFeature
            var updatedCoords = [];
            Ext.each(me.tracingFeatureArray, function (f) {
                var geom = f.getGeometry();
                var coords = geom.getCoordinates();

                if (updatedCoords.length === 0) {
                    updatedCoords = coords;
                } else {
                    updatedCoords = me.tracingUtil.concatLineCoords(updatedCoords, coords);
                }
            });

            me.tracingFeature.getGeometry().setCoordinates(updatedCoords);
        }
    },

    /**
     * Sets the new tracing feature if it is touching via startpoint or endpoint.
     *
     * @param {ol.Feature} foundFeature The hovered feature to set as new tracing feature
     */
    setNewTracingOnStartEndTouch: function (foundFeature) {
        var me = this;
        var foundGeom = foundFeature.getGeometry();
        var tracingGeom = me.tracingFeature.getGeometry();
        var tracingCoords = tracingGeom.getCoordinates();

        var coords = foundGeom.getCoordinates();

        var resultCoords = me.tracingUtil.concatLineCoords(
            tracingCoords,
            coords
        );

        if (resultCoords) {
            me.tracingFeature.getGeometry().setCoordinates(resultCoords);
            me.tracingFeatureArray.push(foundFeature);
        }
    }
});
