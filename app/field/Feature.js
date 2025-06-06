/**
 * A custom field for linking OpenLayers features
 * The field handles loading GeoJSON from a web service into a store associated with the field.
 * The field value itself will be set to an array of OpenLayers features.
 * The field value is set both in the convert function below, and also by
 * CpsiMapview.model.FeatureStoreMixin with the `add`, `clear`, and `remove`
 * listeners on the FeatureStore. This triggers any field validation which may be
 * set.
 */
Ext.define('CpsiMapview.field.Feature', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.feature',

    // ensure the data is sent to the server
    // https://docs.sencha.com/extjs/6.7.0/modern/Ext.data.field.Field.html#cfg-persist
    persist: true,

    allowNull: true,

    /**
     * Load GeoJSON features into the field's feature store
     */
    convert: function (data, rec) {
        const me = this;
        let features = null;
        const featureStore = rec.featureStores
            ? rec.featureStores[me.name]
            : null;

        if (featureStore && data) {
            features = new ol.format.GeoJSON().readFeatures(data);
            // wrap an edit session around updating the field when first loaded
            // to ensure the model is not marked as dirty
            rec.beginEdit();
            const layerSource = featureStore.layer.getSource();
            layerSource.getFeaturesCollection().clear();
            layerSource.addFeatures(features);
            rec.endEdit();
        }

        return features;
    },

    /**
     * Create a default style for the layer associated with the feature field
     *
     * @template
     */
    createStyle: Ext.emptyFn,

    /**
     * Create a selection style for the layer associated with the feature field
     *
     * @template
     */
    createSelectStyle: Ext.emptyFn
});
