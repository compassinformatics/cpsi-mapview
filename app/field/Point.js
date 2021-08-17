/**
* A custom field for storing point features.
* The field handles loading and serializing features to and from an associated store.
* The linked map layer can have styling properties customized through field properties.
*/
Ext.define('CpsiMapview.field.Point', {
    extend: 'CpsiMapview.field.Feature',

    alias: 'data.field.point',

    /**
     * Override {@link Ext.data.field.Field#serialize}
     * to return a the geometry of a single point feature
     *
     * @param {any} v the field value, this can be set to null as we get the value from the store
     * @param {any} rec
     */
    serialize: function (v, rec) {
        var me = this;
        var featureStore = rec.featureStores[me.name];
        return this.getPointGeometry(featureStore.layer);
    },

    /**
     * Return a single point associated with the layer as a GeoJSON object
     * @param {any} rec
     */
    getPointGeometry: function (pointLayer) {

        var feats, gj = null;

        feats = pointLayer.getSource().getFeatures();

        if (feats.length >= 1) {

            if (feats.length > 1) {
                Ext.log.warn('Multiple points found in the point feature layer');
            }
            var writer = new ol.format.GeoJSON();
            var geom = feats[feats.length - 1].getGeometry(); // get the last created feature
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
            color: 'DarkOrange'
        });

        var stroke = new ol.style.Stroke({
            color: 'Maroon',
            width: 1.25
        });

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 7
            }),
            fill: fill,
            stroke: stroke
        });

        return style;
    },

    /**
    * Create a new ol style for showing points when selected
    *
    * @return {ol.style.Style} The new style
    */
    createSelectStyle: function () {
        return null;
    }
});
