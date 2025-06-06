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

    requires: ['BasiGX.util.Layer', 'CpsiMapview.util.Tracing'],

    /**
     * The style of the preview line during tracing.
     */
    previewStyle: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 1)',
            width: 10
        })
    }),

    /**
     * Used to store the position of the last mouse coord, taking into account snapping
     */
    lastSnappedCoord: null,

    /**
     * Interaction to track and populate lastSnappedCoord
     */
    getSnapCoordinateInteraction: null,

    /**
     * Enhances drawing functionality by adding tracing to it.
     *
     * @param {String[]} tracingLayerKeys The keys of the layers to trace
     * @param {ol.interaction.Draw} drawInteraction draw interaction to attach the tracing on
     * @param {Boolean} [showTraceableEdges=false] If the traceable edges shall be shown (useful for debugging)
     */
    initTracing: function (
        tracingLayerKeys,
        drawInteraction,
        showTraceableEdges
    ) {
        const me = this;

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
        me.trackSnappedCoords();

        if (!tracingLayerKeys) {
            return;
        }
        // get tracing layers
        me.tracingLayers = [];
        Ext.each(tracingLayerKeys, function (key) {
            const foundLayers = BasiGX.util.Layer.getLayersBy('layerKey', key);
            if (foundLayers.length > 0) {
                me.tracingLayers.push(foundLayers[0]);
            }
        });

        // the options for the eachFeature functions
        me.forEachFeatureOptions = {
            hitTolerance: 10,
            layerFilter: function (layer) {
                return Ext.Array.contains(me.tracingLayers, layer);
            }
        };

        me.tracingFeature = new ol.Feature({
            geometry: new ol.geom.LineString([])
        });
        me.tracingFeatureArray = [];
        me.tracingStartPoint = null;
        me.tracingEndPoint = null;

        // For debugging the traceable edges can be displayed
        me.tracingVector = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [me.tracingFeature]
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
            geometry: new ol.geom.LineString([])
        });

        me.previewVector = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [me.previewLine]
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
        const me = this;
        me.tracingActive = true;
    },

    /**
     * Sets the variable 'me.tracingActive' to false.
     */
    onTracingDrawEnd: function () {
        const me = this;
        me.tracingActive = false;
        // Clear previous tracingFeature data
        me.tracingFeature.getGeometry().setCoordinates([]);
        me.tracingFeatureArray = [];
        me.previewLine.getGeometry().setCoordinates([]);
    },

    /**
     * Remove listeners and layers
     */
    cleanupTracing: function () {
        const me = this;

        // nothing to cleanup if tracing has not been initialised
        if (!me.tracingDrawInteraction) {
            return;
        }

        me.map.removeLayer(me.previewVector);
        me.map.removeLayer(me.tracingVector);
        me.map.un('click', me.onTracingMapClick);
        me.map.un('pointermove', me.onTracingPointerMove);
        me.tracingDrawInteraction.un('drawstart', me.onTracingDrawStart);
        me.tracingDrawInteraction.un('drawend', me.onTracingDrawEnd);
        me.map.removeInteraction(me.getSnapCoordinateInteraction);
    },

    /**
     * Add a generic Interaction to the map before the last Snap interaction
     * So that we can collected the coordinates of the latest snapped edge/vertex/node
     * The new Interaction needs to be before the last Snap interaction so that the
     * Snap interaction modifies the coordinates to the snapped edge/vertex/node
     * And passes them down to the next interaction
     */
    trackSnappedCoords: function () {
        const me = this;
        const interactions = me.map.getInteractions();
        let lastSnapInteractionIndex;

        me.getSnapCoordinateInteraction = new ol.interaction.Interaction({
            handleEvent: function (e) {
                me.lastSnappedCoord = e.coordinate;
                return true;
            }
        });

        interactions.forEach(function (interaction, i) {
            if (interaction instanceof ol.interaction.Snap) {
                lastSnapInteractionIndex = i;
            }
        });

        interactions.insertAt(
            lastSnapInteractionIndex,
            me.getSnapCoordinateInteraction
        );
    },

    /**
     * Listen to click to start and end the tracing.
     *
     * @param {Event} event The OpenLayers click event.
     */
    onTracingMapClick: function (event) {
        const me = this;

        // Ignore the event if drawing is finished
        if (!me.tracingActive) {
            return;
        }

        let hit = false;
        me.map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                if (
                    me.tracingUtil.lineStringPopulated(me.tracingFeature) &&
                    !me.tracingFeatureArray.includes(feature)
                ) {
                    return;
                }

                hit = true;

                // second click on the tracing feature: append the ring coordinates
                if (
                    me.tracingUtil.lineStringPopulated(me.tracingFeature) &&
                    me.tracingFeatureArray.includes(feature)
                ) {
                    me.tracingEndPoint = me.lastSnappedCoord;
                    const appendCoords = me.tracingUtil.getPartialSegmentCoords(
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

                const geom = feature.clone().getGeometry();
                // start tracing on the feature ring
                const coords = geom.getCoordinates();

                me.tracingFeature.getGeometry().setCoordinates(coords);
                me.tracingFeatureArray.push(feature);
                me.tracingStartPoint = me.lastSnappedCoord;
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
        const me = this;
        const pixel = event.pixel;

        if (
            me.tracingUtil.lineStringPopulated(me.tracingFeature) &&
            me.tracingActive
        ) {
            let coordOnFoundFeature = null;
            me.map.forEachFeatureAtPixel(
                pixel,
                function (foundFeature) {
                    // find coordinate on found feature
                    if (me.tracingFeatureArray.includes(foundFeature)) {
                        coordOnFoundFeature =
                            me.map.getCoordinateFromPixel(pixel);
                    }

                    if (me.tracingFeatureArray.includes(foundFeature)) {
                        me.updateTraceableFeature(foundFeature);
                    } else {
                        // new feature found that needs to be added to tracingfeature

                        const foundGeom = foundFeature.getGeometry();
                        const tracingGeom = me.tracingFeature.getGeometry();

                        const touchingStartEnd =
                            me.tracingUtil.linesTouchAtStartEndPoint(
                                foundGeom,
                                tracingGeom
                            );

                        // TODO: the cases where lines touch at interior points only work in some cases
                        //       it might fail in some edge cases, also tracing consecutively on many
                        //       features does not work
                        const tracingInteriorTouchesFoundFeatureStartEnd =
                            me.tracingUtil.lineInteriorTouchesLineStartEnd(
                                tracingGeom,
                                foundGeom
                            );
                        const tracingStartEndTouchesFoundInterior =
                            me.tracingUtil.lineStartEndTouchesLineInterior(
                                tracingGeom,
                                foundGeom
                            );

                        if (touchingStartEnd) {
                            me.setNewTracingOnStartEndTouch(foundFeature);
                        } else if (tracingInteriorTouchesFoundFeatureStartEnd) {
                            me.setNewTracingOnInteriorStartEndTouch(
                                foundFeature,
                                tracingInteriorTouchesFoundFeatureStartEnd
                            );
                        } else if (tracingStartEndTouchesFoundInterior) {
                            me.setNewTracingOnStartEndInteriorTouch(
                                foundFeature,
                                tracingStartEndTouchesFoundInterior,
                                pixel
                            );
                        }
                    }
                },
                me.forEachFeatureOptions
            );

            let previewCoords = [];
            if (coordOnFoundFeature) {
                me.tracingEndPoint = me.tracingFeature
                    .getGeometry()
                    .getClosestPoint(coordOnFoundFeature);
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
        const me = this;

        // check if found feature is last of array
        const index = me.tracingFeatureArray.indexOf(foundFeature);
        if (index !== 0 && (!index || index === -1)) {
            Ext.Logger.error(
                'The found feature must be in the found features array.'
            );
            return;
        }
        const notLastFeature = index !== me.tracingFeatureArray.length - 1;

        if (notLastFeature) {
            // remove all features after hovered feature
            me.tracingFeatureArray = me.tracingFeatureArray.slice(0, index + 1);
            // update coordinates of tracingFeature
            let updatedCoords = [];
            Ext.each(me.tracingFeatureArray, function (f) {
                const geom = f.getGeometry();
                const coords = geom.getCoordinates();

                if (updatedCoords && updatedCoords.length === 0) {
                    updatedCoords = coords;
                } else {
                    updatedCoords = me.tracingUtil.concatLineCoords(
                        updatedCoords,
                        coords
                    );
                }
            });

            // concatLineCoords can return undefined if lines do not touch
            if (updatedCoords) {
                me.tracingFeature.getGeometry().setCoordinates(updatedCoords);
            }
        }
    },

    /**
     * Sets the new tracing feature if it is touching via startpoint or endpoint.
     *
     * @param {ol.Feature} foundFeature The hovered feature to set as new tracing feature
     */
    setNewTracingOnStartEndTouch: function (foundFeature) {
        const me = this;
        const foundGeom = foundFeature.getGeometry();
        const tracingGeom = me.tracingFeature.getGeometry();
        const tracingCoords = tracingGeom.getCoordinates();

        const coords = foundGeom.getCoordinates();

        const resultCoords = me.tracingUtil.concatLineCoords(
            tracingCoords,
            coords
        );

        if (resultCoords) {
            me.tracingFeature.getGeometry().setCoordinates(resultCoords);
            me.tracingFeatureArray.push(foundFeature);
        }
    },

    /**
     * Sets the new tracing feature if interior of line touches the startpoint or the endpoint of another line.
     *
     * @param {ol.Feature} foundFeature The hovered feature to set as new tracing feature
     * @param {ol.coordinate.Coordinate} touchCoordinate The coordinate of the touching point
     */
    setNewTracingOnInteriorStartEndTouch: function (
        foundFeature,
        touchCoordinate
    ) {
        const me = this;
        const tracingGeom = me.tracingFeature.getGeometry();
        const tracingCoords = tracingGeom.getCoordinates();

        const touchingIndex = me.tracingUtil.getCoordIndex(
            tracingCoords,
            touchCoordinate
        );

        const foundSplitPoint = me.tracingUtil.getClosestCoordinateToPoint(
            tracingCoords,
            me.tracingStartPoint
        );
        const startingPointIndex = me.tracingUtil.getCoordIndex(
            tracingCoords,
            foundSplitPoint
        );

        // we cut the tracing feature by the split point
        // we have to take the order into account
        let partUntilIntersection;
        if (touchingIndex < startingPointIndex) {
            partUntilIntersection = tracingCoords.slice(
                touchingIndex,
                tracingCoords.length
            );
        } else {
            partUntilIntersection = tracingCoords.slice(0, touchingIndex + 1);
        }

        const newTracingCoords = me.tracingUtil.concatLineCoords(
            partUntilIntersection,
            foundFeature.getGeometry().getCoordinates()
        );

        me.tracingFeature.getGeometry().setCoordinates(newTracingCoords);
        me.tracingFeatureArray.push(foundFeature);
    },

    /**
     * Sets the new tracing feature if startpoint or endpoint touches the interior of another line.
     *
     * @param {ol.Feature} foundFeature The hovered feature to set as new tracing feature
     * @param {ol.coordinate.Coordinate} touchCoordinate The coordinate of the touching point
     * @param {ol.pixel} pixel The pixel the user hovered on
     */
    setNewTracingOnStartEndInteriorTouch: function (
        foundFeature,
        touchCoordinate,
        pixel
    ) {
        const me = this;
        const foundGeom = foundFeature.getGeometry();
        const tracingGeom = me.tracingFeature.getGeometry();
        const tracingCoords = tracingGeom.getCoordinates();

        const touchingIndex = me.tracingUtil.getCoordIndex(
            foundGeom.getCoordinates(),
            touchCoordinate
        );

        const hoverCoord = me.map.getCoordinateFromPixel(pixel);
        const foundSplitPoint = me.tracingUtil.getClosestCoordinateToPoint(
            foundGeom.getCoordinates(),
            hoverCoord
        );
        const hoverIndex = me.tracingUtil.getCoordIndex(
            foundGeom.getCoordinates(),
            foundSplitPoint
        );

        // we cut the tracing feature by the split point
        // we have to take the order into account
        const foundCoords = foundGeom.getCoordinates();
        let partUntilIntersection;
        if (hoverIndex >= touchingIndex) {
            partUntilIntersection = foundCoords.slice(
                touchingIndex,
                foundCoords.length
            );
        } else {
            partUntilIntersection = foundCoords.slice(0, touchingIndex + 1);
        }

        const newTracingCoords = me.tracingUtil.concatLineCoords(
            partUntilIntersection,
            tracingCoords
        );

        me.tracingFeature.getGeometry().setCoordinates(newTracingCoords);
        me.tracingFeatureArray.push(foundFeature);
    }
});
