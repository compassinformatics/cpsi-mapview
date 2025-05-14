/**
 * Util class for tracing related functions.
 *
 * @class CpsiMapview.util.Tracing
 */
Ext.define('CpsiMapview.util.Tracing', {
    statics: {
        /**
         * Compute the modulo for negative values.
         *
         * Example: staticMe.computeModulo(-1, 4) returns 3
         *
         * Taken from the official OpenLayers example:
         * https://openlayers.org/en/latest/examples/tracing.html
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
         * Checks if a LineString is is populated i.e. is not empty.
         *
         * @param {ol.Feature} feature The feature to check
         * @returns {Boolean} true/false if LineString is populated, undefined if something unexpected happened
         */
        lineStringPopulated: function (feature) {
            if (!feature) {
                return;
            }
            const geom = feature.getGeometry();
            if (!geom) {
                return;
            }

            const type = geom.getType();
            if (type != 'LineString') {
                return;
            }
            const coords = geom.getCoordinates();
            if (!coords) {
                return;
            }
            return coords.length >= 2;
        },

        /**
         * Finds the index of a coordinate in a coordinate array
         * by only comparing its value.
         *
         * @param {ol.coordinate.Coordinate[]} coordinateArray The coordinate array
         * @param {ol.coordinate.Coordinate} coordToFind The coordinate to find
         * @returns {Number} The index of the coordinate, or -1 if not found
         */
        // TODO: use Ext.Array.reduce instead of Ext.Array.findBy you can omit the second loop
        getCoordIndex: function (coordinateArray, coordToFind) {
            const found = Ext.Array.findBy(coordinateArray, function (c) {
                return Ext.Array.equals(c, coordToFind);
            });
            return coordinateArray.indexOf(found);
        },

        /**
         * Checks if two LineString geometries are touching at only startpoint and/or endpoint.
         *
         * @param {ol.geom.LineString} lineA The first LineString
         * @param {ol.geom.LineString} lineB The second LineString
         *
         * @returns {Boolean} If lines are touching.
         */
        linesTouchAtStartEndPoint: function (lineA, lineB) {
            const firstA = lineA.getFirstCoordinate();
            const lastA = lineA.getLastCoordinate();

            const firstB = lineB.getFirstCoordinate();
            const lastB = lineB.getLastCoordinate();

            const endStart = Ext.Array.equals(lastA, firstB);
            const endEnd = Ext.Array.equals(lastA, lastB);
            const startStart = Ext.Array.equals(firstA, firstB);
            const startEnd = Ext.Array.equals(firstA, lastB);
            return endStart || endEnd || startStart || startEnd;
        },

        /**
         * Checks if the interior of one line touches the startpoint
         * or the endpoint of another line. If yes, the touching point is returned.
         *
         * @param {ol.geom.LineString} lineGeomA The first LineString
         * @param {ol.geom.LineString} lineGeomB The second LineString
         * @returns {ol.coordinate.Coordinate} The touching coordinate or null
         */
        lineInteriorTouchesLineStartEnd: function (lineA, lineB) {
            const firstB = lineB.getFirstCoordinate();
            const lastB = lineB.getLastCoordinate();

            if (lineA.intersectsCoordinate(firstB)) {
                return firstB;
            }

            if (lineA.intersectsCoordinate(lastB)) {
                return lastB;
            }
        },

        /**
         * Checks if the startpoint or the endpoint of a line touches the interior of another line.
         * If yes, the touching point is returned.
         *
         * @param {ol.geom.LineString} lineGeomA The first LineString
         * @param {ol.geom.LineString} lineGeomB The second LineString
         * @returns {ol.coordinate.Coordinate} The touching coordinate
         */
        lineStartEndTouchesLineInterior: function (lineA, lineB) {
            const firstA = lineA.getFirstCoordinate();
            const lastA = lineA.getLastCoordinate();

            if (lineB.intersectsCoordinate(firstA)) {
                return firstA;
            }
            if (lineB.intersectsCoordinate(lastA)) {
                return lastA;
            }
        },

        /**
         * Compute the length of the [a, b] segment.
         *
         * Taken from the official OpenLayers example:
         * https://openlayers.org/en/latest/examples/tracing.html
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
         * Finds the closest coordinate to a point.
         *
         * @param {ol.coordinate.Coordinate[]} coordinateArray An array of coordinates
         * @param {ol.coordinate.Coordinate} pointCoordinate The point coordinate
         *
         * @returns {ol.coordinate.Coordinate} The found coordinate
         */
        getClosestCoordinateToPoint: function (
            coordinateArray,
            pointCoordinate
        ) {
            const staticMe = CpsiMapview.util.Tracing;

            let found, length;
            Ext.each(coordinateArray, function (c) {
                const tmpLength = staticMe.computeLength(c, pointCoordinate);
                if (!length || tmpLength < length) {
                    length = tmpLength;
                    found = c;
                }
            });
            return found;
        },

        /**
         * Checks if coordinate c is on the [a, b] segment.
         *
         * Taken from the official OpenLayers example:
         * https://openlayers.org/en/latest/examples/tracing.html
         *
         * @param {ol.coordinate.Coordinate} c The coordinate to check
         * @param {ol.coordinate.Coordinate} a The start coordinate of the segment
         * @param {ol.coordinate.Coordinate} b The end coordinate of the segment
         *
         * @returns {Boolean} If coordinate c is on the [a, b] segment
         */
        coordIsOnSegment: function (c, a, b) {
            const staticMe = CpsiMapview.util.Tracing;

            const lengthAc = staticMe.computeLength(a, c);
            const lengthAb = staticMe.computeLength(a, b);
            const dot =
                ((c[0] - a[0]) * (b[0] - a[0]) +
                    (c[1] - a[1]) * (b[1] - a[1])) /
                lengthAb;
            return Math.abs(lengthAc - dot) < 1e-6 && lengthAc < lengthAb;
        },

        /**
         * Concatenate two coordinate arrays if they are touching at the startpoint or endpoint.
         * It takes the direction of the arrays into account.
         *
         * @param {ol.coordinate.Coordinate[]} aLineCoords The first coordinate array
         * @param {ol.coordinate.Coordinate[]} bLineCoords The second coordinate array
         * @returns {ol.coordinate.Coordinate[]} The combined coordinate array if input arrays are touching, empty array otherwise
         */
        concatLineCoords: function (aLineCoords, bLineCoords) {
            const inputValid =
                Ext.isArray(aLineCoords) &&
                aLineCoords.length >= 2 &&
                Ext.isArray(bLineCoords) &&
                bLineCoords.length >= 2;

            if (!inputValid) {
                return;
            }

            const aFirst = aLineCoords[0];
            const aLast = aLineCoords[aLineCoords.length - 1];

            const bFirst = bLineCoords[0];
            const bLast = bLineCoords[bLineCoords.length - 1];

            const lastFirst = Ext.Array.equals(aLast, bFirst);
            const lastLast = Ext.Array.equals(aLast, bLast);
            const firstFirst = Ext.Array.equals(aFirst, bFirst);
            const firstLast = Ext.Array.equals(aFirst, bLast);

            if (lastLast) {
                // reverse second array
                bLineCoords.reverse();
            } else if (firstFirst) {
                // reverse first array
                aLineCoords.reverse();
            } else if (firstLast) {
                // reverse both arrays
                aLineCoords.reverse();
                bLineCoords.reverse();
            } else if (!lastFirst) {
                // lines do not touch
                Ext.Logger.warn(
                    'Cannot concat lines, because they do not touch.'
                );
                return undefined;
            }
            // remove intersecting vertex
            aLineCoords.pop();
            const resultCoords = aLineCoords.concat(bLineCoords);
            return resultCoords;
        },

        // TODO: this code was originally built for polygons and
        //       might need more adjustment for simple linestrings
        /**
         * Returns a coordinates array which contains the segments of the traced feature
         * between the start and the end point.
         *
         * The basic functionality is taken from the official OpenLayers example:
         * https://openlayers.org/en/latest/examples/tracing.html
         *
         * @param {ol.Feature} feature The feature to trace
         * @param {ol.coordinate.Coordinate} startPoint The coordinate of the start point
         * @param {ol.coordinate.Coordinate} endPoint The coordinate of the end point
         *
         * @returns {ol.coordinate.Coordinate[]} The coordinates of the traced segment.
         */
        getPartialSegmentCoords: function (feature, startPoint, endPoint) {
            const staticMe = CpsiMapview.util.Tracing;
            let geometry = feature.getGeometry();
            let ringCoords;
            if (geometry.getType() === 'MultiPolygon') {
                geometry = geometry.getPolygon(0);
                ringCoords = geometry.getLinearRing().getCoordinates();
            } else if (geometry.getType() === 'Polygon') {
                ringCoords = geometry.getLinearRing().getCoordinates();
            } else if (geometry.getType() === 'LineString') {
                ringCoords = geometry.getCoordinates();
            } else {
                Ext.Logger.warn(
                    'Tracing only works for LineString, Polygon and MultiPolygon'
                );
                return;
            }

            let i,
                pointA,
                pointB,
                startSegmentIndex = -1;
            for (i = 0; i < ringCoords.length; i++) {
                pointA = ringCoords[i];
                pointB =
                    ringCoords[
                        staticMe.computeModulo(i + 1, ringCoords.length)
                    ];

                // check if this is the start segment dot product
                if (staticMe.coordIsOnSegment(startPoint, pointA, pointB)) {
                    startSegmentIndex = i;
                    break;
                }
            }

            const cwCoordinates = [];
            let cwLength = 0;
            const ccwCoordinates = [];
            let ccwLength = 0;

            // build clockwise coordinates
            for (i = 0; i < ringCoords.length; i++) {
                pointA =
                    i === 0
                        ? startPoint
                        : ringCoords[
                              staticMe.computeModulo(
                                  i + startSegmentIndex,
                                  ringCoords.length
                              )
                          ];
                pointB =
                    ringCoords[
                        staticMe.computeModulo(
                            i + startSegmentIndex + 1,
                            ringCoords.length
                        )
                    ];
                cwCoordinates.push(pointA);

                if (staticMe.coordIsOnSegment(endPoint, pointA, pointB)) {
                    cwCoordinates.push(endPoint);
                    cwLength += staticMe.computeLength(pointA, endPoint);
                    break;
                } else {
                    cwLength += staticMe.computeLength(pointA, pointB);
                }
            }

            // build counter-clockwise coordinates
            for (i = 0; i < ringCoords.length; i++) {
                pointA =
                    ringCoords[
                        staticMe.computeModulo(
                            startSegmentIndex - i,
                            ringCoords.length
                        )
                    ];
                pointB =
                    i === 0
                        ? startPoint
                        : ringCoords[
                              staticMe.computeModulo(
                                  startSegmentIndex - i + 1,
                                  ringCoords.length
                              )
                          ];
                ccwCoordinates.push(pointB);

                if (staticMe.coordIsOnSegment(endPoint, pointA, pointB)) {
                    ccwCoordinates.push(endPoint);
                    ccwLength += staticMe.computeLength(endPoint, pointB);
                    break;
                } else {
                    ccwLength += staticMe.computeLength(pointA, pointB);
                }
            }

            // keep the shortest path
            return ccwLength < cwLength ? ccwCoordinates : cwCoordinates;
        }
    }
});
