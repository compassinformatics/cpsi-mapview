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
    createParallelFeature: function (map, feature, offset, offsetUnit) {
        const mapProj = map.getView().getProjection().getCode();
        const format = new ol.format.GeoJSON({
            featureProjection: mapProj,
            dataProjection: 'EPSG:4326'
        });
        const geojsonFeature = format.writeFeatureObject(feature);
        let opts = undefined;
        if (offsetUnit !== null && offsetUnit !== undefined) {
            opts = {
                units: offsetUnit
            };
        }
        const parallelGeojsonFeature = turf.lineOffset.lineOffset(
            geojsonFeature.geometry,
            offset,
            opts
        );
        const parallelFeature = format.readFeature(parallelGeojsonFeature);
        return parallelFeature;
    }
});
