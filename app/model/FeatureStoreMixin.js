/**
* A model mixin to create feature stores for feature related fields
*/
Ext.define('CpsiMapview.model.FeatureStoreMixin', {
    extend: 'Ext.Mixin',
    requires: [
        'GeoExt.data.store.Features',
        'BasiGX.util.Map'
    ],
    mixinConfig: {
        after: {
            constructor: 'createFeatureStores'
        },
        before: {
            destroy: 'destroyFeatureStores'
        }
    },

    /**
    Zoom to the extent of all features associated with the model
    */
    getRecordBounds: function () {

        var bounds, layerExtent;
        var me = this;

        if (me.featureStores) {
            Ext.Object.each(me.featureStores, function (key, fs) {

                if (fs.layer.getSource().getFeatures().length > 0) {
                    layerExtent = fs.layer.getSource().getExtent();

                    if (bounds) {
                        ol.extent.extend(bounds, layerExtent);
                    }
                    else {
                        bounds = layerExtent;
                    }
                }
            });
        }

        return bounds;
    },

    /**
     * Create a new feature store
     *
     * @param {Ext.data.Model} model A model to use when loading features
     * @return {GeoExt.data.store.Features} The new feature store
     */
    createFeatureStore: function (field) {

        var me = this;

        var cfg = field.featureStoreConfig || {};
        var featModel = cfg.model || 'GeoExt.data.model.Feature';


        var style = field.createStyle();
        var selectStyle = field.createSelectStyle();

        var vectorLayer = new ol.layer.Vector({
            displayInLayerSwitcher: false,
            source: new ol.source.Vector(),
            style: style,
            selectStyle: selectStyle // note selectStyle is a custom property and not a ol.layer.Vector option
        });

        // add a vector layer that will be linked to the store
        var mapCmp = BasiGX.util.Map.getMapComponent();

        if (mapCmp) {
            mapCmp.getMap().addLayer(vectorLayer);
        }

        var filters = [];

        if (field.defaultFeatureFilter) {
            filters.push(field.defaultFeatureFilter);
        }

        var featStore = Ext.create('GeoExt.data.store.Features', {
            model: featModel,
            layer: vectorLayer,
            filters: filters,
            // ensure that any changes to layers are persisted back to the model
            // to trigger validation
            listeners: {
                add: function (store, features) {
                    me.set(field.name, features, { convert: false });
                },
                clear: function () {
                    me.set(field.name, null, { convert: false });
                },
                remove: function (store) {
                    var features = store.getRange(); // get all remaining features
                    me.set(field.name, features, { convert: false });
                }
            }
        });
        return featStore;
    },

    /**
     * Clean up all the layer stores and layers created by the mixin
     **/
    destroyFeatureStores: function () {
        var me = this;

        if (me.featureStores) {
            Ext.Object.each(me.featureStores, function (key, fs) {

                var mapCmp = BasiGX.util.Map.getMapComponent();

                if (mapCmp) {
                    mapCmp.getMap().removeLayer(fs.layer);
                }

                fs.destroy();
            });
        }
    },

    /**
     * For any feature based fields create an associated feature store
     **/
    createFeatureStores: function () {
        var me = this;

        if (!me.featureStores) {
            me.featureStores = {};
        }

        Ext.each(me.getFields(), function (f) {

            switch (true) {
                case (f.type === 'line' || f.superclass.type == 'line'):
                case (f.type === 'polygon' || f.superclass.type == 'polygon'):
                    me.featureStores[f.name] = me.createFeatureStore(f);
                    break;
                default:
                    break;
            }

        });
    }

});