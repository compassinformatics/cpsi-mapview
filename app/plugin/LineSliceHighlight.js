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

    constructor: function (config) {
        this.callParent([config]);
        if (config && config.style) {
            this.style = config.style;
        }
    },

    init: function () {
        if (!this.style) {
            this.style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                })
            });
        }
    },

    /**
     * Measure a segment in the units the chainages are expressed in.
     *
     * @param {ol.geom.LineString} segment
     * @param {ol.proj.Projection} projection
     * @returns {number} length in metres
     */
    getSegmentLength: function (segment, projection) {
        if (projection && projection.getUnits() === 'degrees') {
            return ol.sphere.getLength(segment, {
                projection: projection.getCode()
            });
        }
        if (projection && projection.getCode() === 'EPSG:3857') {
            // Web Mercator grid distances are inflated by 1/cos(latitude),
            // so planar length is not usable here
            return ol.sphere.getLength(segment, { projection: 'EPSG:3857' });
        }
        return segment.getLength();
    },

    /**
     * Calculates the slice of geometry from start to end
     * @param {ol.geom.LineString} geometry
     * @param {number} start in m
     * @param {number} end in m
     * @param {ol.proj.Projection} projection projection of the geometry
     * @returns {ol.geom.LineString}
     */
    calculateSlice: function (geometry, start, end, projection) {
        const me = this;
        let length = 0;
        const coordinates = [];
        geometry.forEachSegment(function (a, b) {
            const segment = new ol.geom.LineString([a, b]);
            const segmentLength = me.getSegmentLength(segment, projection);
            if (length <= start && start < length + segmentLength) {
                // start is in this segment
                coordinates.push(
                    segment.getCoordinateAt((start - length) / segmentLength)
                );
            }
            if (
                start <= length + segmentLength &&
                length + segmentLength <= end
            ) {
                // the endpoint of the segment is between start and end
                // OpenLayers forEachSegment reuses the arrays for the coordinates so it needs to be cloned
                coordinates.push(b.slice());
            }
            if (length <= end && end < length + segmentLength) {
                // end is in this segment
                coordinates.push(
                    segment.getCoordinateAt((end - length) / segmentLength)
                );
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
     * @param {ol.Map} [map] defaults to the application's main map
     */
    highlightSlice: function (geometry, start, end, map) {
        if (!map) {
            map = BasiGX.util.Map.getMapComponent().map;
        }

        const projection = map.getView().getProjection();

        if (!this.layer) {
            this.layer = new ol.layer.Vector({
                style: this.style,
                source: new ol.source.Vector(),
                map: map
            });
        } else {
            this.layer.getSource().clear();
        }

        const feature = new ol.Feature(
            this.calculateSlice(geometry, start, end, projection)
        );

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
