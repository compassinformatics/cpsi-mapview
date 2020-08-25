/**
* A custom field for linking OpenLayers features
* The field handles loading to an associated store.
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
            featureStore.layer.getSource().addFeatures(features);
        }

        return data;
    }

});
