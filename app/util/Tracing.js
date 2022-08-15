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
            var geom = feature.getGeometry();
            if (!geom) {
                return;
            }

            var type = geom.getType();
            if (type != 'LineString') {
                return;
            }
            var coords = geom.getCoordinates();
            if (!coords) {
                return;
            }
            return coords.length >= 2;
        },

        /**
         * Checks if two LineString geometries are touching at only startpoint and/or endpoint.
         * @param {ol.geom.LineString} lineA The first LineString
         * @param {ol.geom.LineString} lineB The second LineString
         *
         * @returns {Boolean} If lines are touching.
         */
        linesTouchAtStartEndPoint: function (lineA, lineB) {
            var firstA = lineA.getFirstCoordinate();
            var lastA = lineA.getLastCoordinate();

            var firstB = lineB.getFirstCoordinate();
            var lastB = lineB.getLastCoordinate();

            var endStart = Ext.Array.equals(lastA, firstB);
            var endEnd = Ext.Array.equals(lastA, lastB);
            var startStart = Ext.Array.equals(firstA, firstB);
            var startEnd = Ext.Array.equals(firstA, lastB);
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

            var firstB = lineB.getFirstCoordinate();
            var lastB = lineB.getLastCoordinate();

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
            var firstA = lineA.getFirstCoordinate();
            var lastA = lineA.getLastCoordinate();

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
            var staticMe = CpsiMapview.util.Tracing;

            var lengthAc = staticMe.computeLength(a, c);
            var lengthAb = staticMe.computeLength(a, b);
            var dot =
                ((c[0] - a[0]) * (b[0] - a[0]) + (c[1] - a[1]) * (b[1] - a[1])) / lengthAb;
            return Math.abs(lengthAc - dot) < 1e-6 && lengthAc < lengthAb;
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
            var staticMe = CpsiMapview.util.Tracing;
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
                pointB = ringCoords[staticMe.computeModulo(i + 1, ringCoords.length)];

                // check if this is the start segment dot product
                if (staticMe.coordIsOnSegment(startPoint, pointA, pointB)) {
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
                        : ringCoords[staticMe.computeModulo(i + startSegmentIndex, ringCoords.length)];
                pointB = ringCoords[staticMe.computeModulo(i + startSegmentIndex + 1, ringCoords.length)];
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
                pointA = ringCoords[staticMe.computeModulo(startSegmentIndex - i, ringCoords.length)];
                pointB =
                    i === 0
                        ? startPoint
                        : ringCoords[staticMe.computeModulo(startSegmentIndex - i + 1, ringCoords.length)];
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
}
);
