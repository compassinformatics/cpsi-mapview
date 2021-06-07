/**
* A model mixin to create feature stores for feature related fields
* (custom fields such as CpsiMapview.field.Line and CpsiMapview.field.Polygon
* Any fields which contain features will automatically have a featureStore
* created and added to featureStores property e.g. featureStores.edges
*/
Ext.define('CpsiMapview.model.FeatureStoreMixin', {
    extend: 'Ext.Mixin',
    requires: [
        'GeoExt.data.store.Features',
        'BasiGX.util.Map'
    ],
    mixinConfig: {
        before: {
            // ensure stores are created before convert functions are run
            constructor: 'createFeatureStores',
            destroy: 'destroyFeatureStores'
        }
    },

    /**
     * The default buffer distance to use when zooming to points
     */
    extentBuffer: 100,

    /**
    Return the extent of all features associated with the model
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

        // if the extent is a single point then buffer it by the extentBuffer property
        if (bounds) {
            if (bounds[3] - bounds[1] === 0 || bounds[2] - bounds[0] === 0) {
                bounds = ol.extent.buffer(bounds, me.extentBuffer);
            }
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

        var cfg = field.featureStoreConfig || {};
        var featModel = cfg.model || 'GeoExt.data.model.Feature';


        var style = field.createStyle();
        var selectStyle = field.createSelectStyle();

        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: new ol.Collection()
            }),
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

        return Ext.create('GeoExt.data.store.Features', {
            model: featModel,
            layer: vectorLayer,
            filters: filters
        });
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
     * These need to be created before the model
     * constructor so that the featurestore is ready when any convert functions are run.
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
                case (f.type === 'point' || f.superclass.type == 'point'):

                    me.featureStores[f.name] = me.createFeatureStore(f);
                    break;
                default:
                    break;
            }

        });
    }

});
