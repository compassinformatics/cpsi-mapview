/**
* A custom field for storing line features
* The field handles loading and serializing features to and from an associated store.
* The linked map layer can have styling properties customized through field properties.
*/
Ext.define('CpsiMapview.field.Line', {
    extend: 'CpsiMapview.field.Feature',

    alias: 'data.field.line',

    /**
     * Colors and sizes for the default point and line styles
     */
    styleDefaults: {
        lineColor: '#FFFC17',
        pointColor: '#E9AB17',
        radius: 5,
        width: 4
    },

    /**
     * Colors and sizes for the point and line selection styles
     */
    selectStyleDefaults: {
        lineColor: 'red',
        pointColor: 'red'
    },

    /**
     * Filter to apply to the feature store
     */
    defaultFeatureFilter: function (rec) {
        // only display LineString and MultiLineString in an associated feature grid
        var geomType = rec.getFeature().getGeometry().getType();
        return (Ext.Array.contains(['LineString', 'MultiLineString'], geomType));
    },

    /**
     * Return simplified feature properties rather than full GeoJSON
     */
    serialize: function (v, rec) {

        var me = this;
        var featureStore = rec.featureStores ? rec.featureStores[me.name] : null;
        return me.getFeatureAttributes(featureStore);
    },

    /**
     * Create an array containing feature properties
     */
    getFeatureAttributes: function (featureStore) {

        var feats = featureStore.getRange();
        var recs = [];

        Ext.each(feats, function (s) {
            recs.push(s.data);
        });

        return recs;
    },

    /**
    * Create a new ol style for showing points and lines
    *
    * @return {ol.style.Style} The new style
    */
    createPointLineStyle: function (lineColor, pointColor) {

        var me = this;

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: me.styleDefaults.radius,
                fill: new ol.style.Fill({
                    color: pointColor
                }),
                stroke: new ol.style.Stroke({
                    color: lineColor
                })
            }),
            width: me.styleDefaults.width,
            stroke: new ol.style.Stroke({
                color: lineColor
            }),
            fill: new ol.style.Fill({
                color: pointColor
            }),
        });

        return style;
    },

    /**
    * Create a new ol style
    *
    * @return {ol.style.Style} The new style
    */
    createStyle: function () {

        var me = this;
        var cfg = me.featureStoreConfig;

        var lineColor = cfg.lineColor || me.styleDefaults.lineColor;
        var pointColor = cfg.pointColor || me.styleDefaults.pointColor;

        return me.createPointLineStyle(lineColor, pointColor);
    },

    /**
    * Create a new ol style for showing points and lines when selected
    *
    * @return {ol.style.Style} The new style
    */
    createSelectStyle: function () {

        var me = this;
        var cfg = me.featureStoreConfig;

        var lineColor = cfg.selectLineColor || me.selectStyleDefaults.lineColor;
        var pointColor = cfg.selectPointColor || me.selectStyleDefaults.pointColor;

        return me.createPointLineStyle(lineColor, pointColor);

    }
});
