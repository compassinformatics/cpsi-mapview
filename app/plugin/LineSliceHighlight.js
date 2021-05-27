/**
 * With this plugin slices of LineString geometries can be highlighted.
 */
Ext.define('CpsiMapview.plugin.LineSliceHighlight', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_line_slice_highlight',
    pluginId: 'cmv_line_slice_highlight',

    /**
     * @type {ol.StyleFunction|ol.style.Style}
     */
    style: null,

    init: function () {
        this.style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                width: 2
            })
        });
    },

    /**
     * Calculates the slice of geometry from start to end
     * @param {ol.geom.LineString} geometry
     * @param {number} start in m
     * @param {number} end in m
     * @returns {ol.geom.LineString}
     */
    calculateSlice: function (geometry, start, end) {
        var length = 0;
        var coordinates = [];
        geometry.forEachSegment(function (a, b) {
            var segment = new ol.geom.LineString([a, b]);
            var segmentLength = ol.sphere.getLength(segment);
            if (length <= start && start < length + segmentLength) {
                // start is in this segment
                coordinates.push(segment.getCoordinateAt((start - length) / segmentLength));
            }
            if (start <= length + segmentLength && length + segmentLength <= end) {
                // the endpoint of the segment is between start and end
                // openlayers forEachSegment reuses the arrays for the coordinates so it needs to be cloned
                coordinates.push(b.slice());
            }
            if (length <= end && end < length + segmentLength) {
                // end is in this segment
                coordinates.push(segment.getCoordinateAt((end - length) / segmentLength));
            }

            length += segmentLength;
        });
        return new ol.geom.LineString(coordinates);
    },

    /**
     * This methods highlights a slice of the given LineString geometry between start and end.
     * @param {ol.geom.LineString} geometry
     * @param {number} start
     * @param {number} end
     */
    highlightSlice: function (geometry, start, end) {
        var map = BasiGX.util.Map.getMapComponent().map;

        if (!this.layer) {
            this.layer = new ol.layer.Vector({
                style: this.style,
                source: new ol.source.Vector(),
                map: map
            });
        } else {
            this.layer.getSource().clear();
        }

        var feature = new ol.Feature(this.calculateSlice(geometry, start, end));

        this.layer.getSource().addFeature(feature);
    },

    /**
     * This method removes the current highlight from the map.
     */
    removeHighlight: function () {
        if (this.layer) {
            this.layer.setMap(null);
            this.layer = null;
        }
    },

    /**
     * This method set the style for the highlight.
     * @param {ol.style.Style} style
     */
    setStyle: function (style) {
        this.style = style;
        if (this.layer) {
            this.layer.setStyle(style);
        }
    },

    /**
     * Remove any highlights and cleanup
     */
    destroy: function () {
        this.removeHighlight();
        this.style = null;
        this.callParent();
    }
});
