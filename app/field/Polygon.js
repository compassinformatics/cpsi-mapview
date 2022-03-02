/**
* A custom field for storing polygon features.
* The field handles loading and serializing features to and from an associated store.
* The linked map layer can have styling properties customized through field properties.
*/
Ext.define('CpsiMapview.field.Polygon', {
    extend: 'CpsiMapview.field.Feature',

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
     * Override {@link Ext.data.field.Field#serialize}
     * to return a single polygon associated with the layer as a GeoJSON object
     *
     * @param {any} v the field value, this can be set to null as we get the value from the store
     * @param {any} rec
     */
    getPolygonGeometry: function (polygonLayer) {

        var feats, gj = null;

        feats = polygonLayer.getSource().getFeatures();

        // filter out any non-polygon features
        feats = feats.filter(function (f) {
            return f.getGeometry() instanceof ol.geom.Polygon || f.getGeometry() instanceof ol.geom.Circle;
        });

        if (feats.length >= 1) {

            if (feats.length > 1) {
                Ext.log.warn('Multiple polygons found in the polygon feature layer');
            }
            var writer = new ol.format.GeoJSON();
            var geom = feats[feats.length -1].getGeometry(); // get the last created feature
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
