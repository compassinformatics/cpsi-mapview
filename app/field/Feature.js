/**
* A custom field for linking OpenLayers features
* The field handles loading to an associated store.
* The field itself will be set to an array of OpenLayers features.
* This is set both in the convert function below, and also by
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

        var me = this;
        var features = null;
        var featureStore = rec.featureStores ? rec.featureStores[me.name] : null;

        if (featureStore && data) {
            features = (new ol.format.GeoJSON().readFeatures(data));
            // wrap an edit session around updating the field when first loaded
            // to ensure the model is not marked as dirty
            rec.beginEdit();
            featureStore.layer.getSource().addFeatures(features);
            rec.endEdit();
            // Ext.Assert.falsey(rec.dirty);
        }

        return features;
    }

});
