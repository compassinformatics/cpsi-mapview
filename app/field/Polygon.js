/**
* A custom field for storing polygon features.
* The field handles loading and serializing features to and from an associated store.
* The linked map layer can have styling properties customized through field properties.
*/
Ext.define('CpsiMapview.field.Polygon', {
    extend: 'CpsiMapview.field.Feature',

    requires: [
        'BasiGX.util.Map'
    ],

    alias: 'data.field.polygon',

    /**
     * Return a the geometry of a single polygon feature
     */
    serialize: function (v, rec) {
        var me = this;
        var featureStore = rec.featureStores[me.name];
        return this.getPolygonGeometry(featureStore.layer);
    },

    /**
     * Return a single polygon associated with the layer as a GeoJSON object
     * @param {any} rec
     */
    getPolygonGeometry: function (polygonLayer) {

        var feats, gj = null;

        feats = polygonLayer.getSource().getFeatures();
        if (feats.length === 1) {
            var writer = new ol.format.GeoJSON();
            var geom = feats[0].getGeometry();
            if (geom.getType() === 'Circle') {
                // ol.geom.Circle is not supported
                // in GeoJSON https://stackoverflow.com/questions/16942697/geojson-circles-supported-or-not
                // convert to a polygon first
                geom = ol.geom.Polygon.fromCircle(geom);
            }
            gj = writer.writeGeometryObject(geom);
        }

        return gj;
    },

    /**
    * Create a new ol style
    *
    * @return {ol.style.Style} The new style
    */
    createStyle: function () {

        var fill = new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)'
        });

        var stroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
        });

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 5
            }),
            fill: fill,
            stroke: stroke
        });

        return style;
    },

    /**
    * Create a new ol style for showing polygons when selected
    *
    * @return {ol.style.Style} The new style
    */
    createSelectStyle: function () {
        return null;
    }
});
