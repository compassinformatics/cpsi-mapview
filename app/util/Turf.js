/**
 * Util class for working with turf.js
 *
 * @class CpsiMapview.util.Turf
 */
Ext.define('CpsiMapview.util.Turf', {
    alternateClassName: 'TurfUtil',

    singleton: true,

    /**
     * Creates a parallel feature with given offset.
     *
     * @param {ol.Map} map The map.
     * @param {ol.Feature} feature The base feature.
     * @param {number} offset The intended offset.
     * @param {string} offsetUnit The unit of the offset.
     * @returns {ol.Feature} The parallel feature.
     */
    createParallelFeature: function(map, feature, offset, offsetUnit) {
        var mapProj = map.getView().getProjection().getCode();
        var format = new ol.format.GeoJSON({
            featureProjection: mapProj,
            dataProjection: 'EPSG:4326'
        });
        var geojsonFeature = format.writeFeatureObject(feature);
        var opts = undefined;
        if (offsetUnit !== null && offsetUnit !== undefined) {
            opts = {
                units: offsetUnit
            };
        }
        var parallelGeojsonFeature = turf.lineOffset.lineOffset(
            geojsonFeature.geometry, offset, opts
        );
        var parallelFeature = format.readFeature(parallelGeojsonFeature);
        return parallelFeature;
    }
});
