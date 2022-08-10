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
        'BasiGX.util.Map'
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
     * Compute the length of the [a, b] segment.
     *
     * @param {ol.coordinate.Coordinate} a The start coordinate of the segment
     * @param {ol.coordinate.Coordinate} b The end coordinate of the segment
     *
     * @returns {ol.coordinate.Coordinate} The length of the segment
     */
    computeLength: function (a, b) {
        return Math.sqrt(
            (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
        );
    },

    /**
     * Checks if coordinate c is on the [a, b] segment.
     *
     * @param {ol.coordinate.Coordinate} c The coordinate to check
     * @param {ol.coordinate.Coordinate} a The start coordinate of the segment
     * @param {ol.coordinate.Coordinate} b The end coordinate of the segment
     *
     * @returns {Boolean} If coordinate c is on the [a, b] segment
     */
    coordIsOnSegment: function (c, a, b) {
        var me = this;
        var lengthAc = me.computeLength(a, c);
        var lengthAb = me.computeLength(a, b);
        var dot =
            ((c[0] - a[0]) * (b[0] - a[0]) + (c[1] - a[1]) * (b[1] - a[1])) / lengthAb;
        return Math.abs(lengthAc - dot) < 1e-6 && lengthAc < lengthAb;
    },

    /**
     * Compute the modulo for negative values.
     *
     * Example: me.computeModulo(-1, 4) returns 3
     *
     * @param {Number} a The first number
     * @param {Number} b The second number
     *
     * @returns {Number} The modulo
     */
    computeModulo: function (a, b) {
        return ((a % b) + b) % b;
    },

    /**
     * Returns a coordinates array which contains the segments of the traced feature
     * between the start and the end point.
     *
     * @param {ol.Feature} feature The feature to trace
     * @param {ol.coordinate.Coordinate} startPoint The coordinate of the start point
     * @param {ol.coordinate.Coordinate} endPoint The coordinate of the end point
     *
     * @returns {ol.coordinate.Coordinate[]} The coordinates of the traced segment.
     */
    getPartialSegmentCoords: function (feature, startPoint, endPoint) {
        var me = this;
        var geometry = feature.getGeometry();
        var ringCoords;
        if (geometry.getType() === 'MultiPolygon') {
            geometry = geometry.getPolygon(0);
            ringCoords = geometry.getLinearRing().getCoordinates();
        } else if (geometry.getType() === 'Polygon') {
            ringCoords = geometry.getLinearRing().getCoordinates();
        } else if (geometry.getType() === 'LineString') {
            ringCoords = geometry.getCoordinates();
        } else {
            Ext.Logger.warn('Tracing only works for LineString, Polygon and MultiPolygon');
            return;
        }

        var i,
            pointA,
            pointB,
            startSegmentIndex = -1;
        for (i = 0; i < ringCoords.length; i++) {
            pointA = ringCoords[i];
            pointB = ringCoords[me.computeModulo(i + 1, ringCoords.length)];

            // check if this is the start segment dot product
            if (me.coordIsOnSegment(startPoint, pointA, pointB)) {
                startSegmentIndex = i;
                break;
            }
        }

        var cwCoordinates = [];
        var cwLength = 0;
        var ccwCoordinates = [];
        var ccwLength = 0;

        // build clockwise coordinates
        for (i = 0; i < ringCoords.length; i++) {
            pointA =
                i === 0
                    ? startPoint
                    : ringCoords[me.computeModulo(i + startSegmentIndex, ringCoords.length)];
            pointB = ringCoords[me.computeModulo(i + startSegmentIndex + 1, ringCoords.length)];
            cwCoordinates.push(pointA);

            if (me.coordIsOnSegment(endPoint, pointA, pointB)) {
                cwCoordinates.push(endPoint);
                cwLength += me.computeLength(pointA, endPoint);
                break;
            } else {
                cwLength += me.computeLength(pointA, pointB);
            }
        }

        // build counter-clockwise coordinates
        for (i = 0; i < ringCoords.length; i++) {
            pointA = ringCoords[me.computeModulo(startSegmentIndex - i, ringCoords.length)];
            pointB =
                i === 0
                    ? startPoint
                    : ringCoords[me.computeModulo(startSegmentIndex - i + 1, ringCoords.length)];
            ccwCoordinates.push(pointB);

            if (me.coordIsOnSegment(endPoint, pointA, pointB)) {
                ccwCoordinates.push(endPoint);
                ccwLength += me.computeLength(endPoint, pointB);
                break;
            } else {
                ccwLength += me.computeLength(pointA, pointB);
            }
        }

        // keep the shortest path
        return ccwLength < cwLength ? ccwCoordinates : cwCoordinates;
    },

    // TODO: on close remove tracing

    // TODO: handle linestring touch interior point

    // TODO: docs
    initTracing: function (tracingLayerKeys) {
        var me = this;

        // bind scope to listener functions
        me.onTracingPointerMove = me.onTracingPointerMove.bind(me);
        me.onTracingMapClick = me.onTracingMapClick.bind(me);

        // get tracing layers
        me.tracingLayers = [];
        Ext.each(tracingLayerKeys, function (key) {
            var foundLayers = BasiGX.util.Layer.getLayersBy('layerKey', key);
            if (foundLayers.length === 1) {
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

        // TODO: maybe move as mixin prop
        me.tracingFeature = new ol.Feature({
            geometry: new ol.geom.LineString([]),
        });
        me.tracingFeatureArray = [];
        me.tracingStartPoint = null;
        me.tracingEndPoint = null;


        // DEBUG
        var debug = false;
        if (debug) {
            var tracingVector = new ol.layer.Vector({
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
            me.map.addLayer(tracingVector);
        }
        // DEBUG


        // the visible tracing line while editing
        me.previewLine = new ol.Feature({
            geometry: new ol.geom.LineString([]),
        });

        var previewVector = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [me.previewLine],
            }),
            style: me.previewStyle
        });



        me.map.addLayer(previewVector);

        me.map.on('click', me.onTracingMapClick);

        me.map.on('pointermove', me.onTracingPointerMove);
    },

    /**
     * Checks if a LineString is not empty.
     *
     * @param {ol.Feature} feature The feature to check
     * @returns {Boolean} If LineString is not empty
     */
    lineStringNotEmpty: function (feature) {
        var geom = feature.getGeometry();
        var coords = geom.getCoordinates();
        return coords.length > 0;
    },

    /**
     * Listen to click to start and end the tracing.
     *
     * @param {Event} event The OpenLayers click event.
     */
    onTracingMapClick: function (event) {
        var me = this;

        if (!me.editingIsActive) {
            return;
        }

        var hit = false;
        me.map.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                if (me.lineStringNotEmpty(me.tracingFeature) && !me.tracingFeatureArray.includes(feature)) {
                    return;
                }

                hit = true;
                var coord = me.map.getCoordinateFromPixel(event.pixel);

                // second click on the tracing feature: append the ring coordinates
                if (me.lineStringNotEmpty(me.tracingFeature) && me.tracingFeatureArray.includes(feature)) {
                    me.tracingEndPoint = me.tracingFeature.getGeometry().getClosestPoint(coord);
                    var appendCoords = me.getPartialSegmentCoords(
                        me.tracingFeature,
                        me.tracingStartPoint,
                        me.tracingEndPoint
                    );
                    me.drawInteraction.removeLastPoint();
                    me.drawInteraction.appendCoordinates(appendCoords);
                    me.tracingFeature.getGeometry().setCoordinates([]);
                    me.tracingFeatureArray = [];
                    me.previewLine.getGeometry().setCoordinates([]);
                }

                // start tracing on the feature ring
                me.tracingFeature.getGeometry().setCoordinates(
                    feature.clone().getGeometry().getCoordinates()
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

        // TODO: attach new features only at end

        if (me.lineStringNotEmpty(me.tracingFeature) && me.editingIsActive) {
            var coord = null;
            me.map.forEachFeatureAtPixel(
                event.pixel,
                // TODO: maybe separate function
                function (feature) {

                    if (me.tracingFeatureArray.includes(feature)) {
                        coord = me.map.getCoordinateFromPixel(event.pixel);

                        var i = me.tracingFeatureArray.indexOf(feature);
                        var notLastFeature = (i !== (me.tracingFeatureArray.length - 1));
                        if (notLastFeature) {

                            // remove all features after hovered feature
                            me.tracingFeatureArray = me.tracingFeatureArray.slice(0, i + 1);
                            var updatedCoords = [];
                            Ext.each(me.tracingFeatureArray, function (f) {
                                var geom = f.getGeometry();
                                var coords = geom.clone().getCoordinates();
                                if (updatedCoords.length === 0) {
                                    updatedCoords = coords;
                                } else {
                                    updatedCoords = me.concatLineCoords(updatedCoords, coords);
                                }
                            });

                            me.tracingFeature.getGeometry().setCoordinates(updatedCoords);
                        }
                    } else {
                        var geom = feature.getGeometry().clone();

                        // TODO: maybe separate function
                        var first = geom.getFirstCoordinate();
                        var last = geom.getLastCoordinate();

                        var tracingGeom = me.tracingFeature.getGeometry().clone();
                        var tracingFirst = tracingGeom.getFirstCoordinate();
                        var tracingLast = tracingGeom.getLastCoordinate();

                        var endStart = Ext.Array.equals(tracingLast, first);
                        var endEnd = Ext.Array.equals(tracingLast, last);
                        var startStart = Ext.Array.equals(tracingFirst, first);
                        var startEnd = Ext.Array.equals(tracingFirst, last);
                        var touching = endStart || endEnd || startStart || startEnd;
                        // TODO: maybe separate function

                        if (touching) {
                            var resultCoords = me.concatLineCoords(
                                tracingGeom.getCoordinates(),
                                geom.getCoordinates()
                            );

                            if (resultCoords) {
                                me.tracingFeature.getGeometry().setCoordinates(resultCoords);
                                me.tracingFeatureArray.push(feature);
                            }
                        }
                    }
                },
                me.forEachFeatureOptions
            );

            var previewCoords = [];
            if (coord) {
                me.tracingEndPoint = me.tracingFeature.getGeometry().getClosestPoint(coord);
                previewCoords = me.getPartialSegmentCoords(
                    me.tracingFeature,
                    me.tracingStartPoint,
                    me.tracingEndPoint
                );
            }
            me.previewLine.getGeometry().setCoordinates(previewCoords);
        }
    },


    /**
     * Concatenate two coordinate arrays if they are touching at the startpoint or endpoint.
     * It takes the direction of the arrays into account.
     *
     * Return empty array otherwise.
     *
     * @param {ol.coordinate.Coordinate[]} aLineCoords The first coordinate array
     * @param {ol.coordinate.Coordinate[]} bLineCoords The second coordinate array
     * @returns {ol.coordinate.Coordinate[]} The combined coordinate array if input arrays are touching, empty array otherwise
     */
    concatLineCoords: function (aLineCoords, bLineCoords) {
        var aFirst = aLineCoords[0] || [];
        var aLast = aLineCoords[aLineCoords.length - 1] || [];

        var bFirst = bLineCoords[0] || [];
        var bLast = bLineCoords[bLineCoords.length - 1] || [];

        var lastFirst = Ext.Array.equals(aLast, bFirst);
        var lastLast = Ext.Array.equals(aLast, bLast);
        var firstFirst = Ext.Array.equals(aFirst, bFirst);
        var firstLast = Ext.Array.equals(aFirst, bLast);

        if (lastFirst) {
            // optimal order, do nothing

        } else if (lastLast) {
            // reverse second array
            bLineCoords.reverse();

        } else if (firstFirst) {
            // reverse first array
            aLineCoords.reverse();

        } else if (firstLast) {
            // reverse both arrays
            aLineCoords.reverse();
            bLineCoords.reverse();

        } else {
            // lines do not touch
            Ext.Logger.warn('Cannot concat lines, because they do not touch.');
            return [];
        }
        // remove intersecting vertex
        aLineCoords.pop();
        var resultCoords = aLineCoords.concat(bLineCoords);
        return resultCoords;
    }
}

);
