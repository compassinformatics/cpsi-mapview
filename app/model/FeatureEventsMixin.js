/**
 * A model mixin that keeps map layers in sync with related models.
 * Any associated WMS layer or WFS layer that contains the updated
 * feature is automatically refreshed.
 * In addition the model is saved a `modelsaved` event is fired to allow for custom hooks.
 *
 * Example configuration settings on a model:
 *
 *  syncLayerKeys: ['LAYER1_KEY_WMS', 'LAYER2_KEY_WMS']  // associated WMS layers
 *  syncStoreIds: ['GridStore1', 'GridStore2'] // associated grid store aliases
 *
 */
Ext.define('CpsiMapview.model.FeatureEventsMixin', {
    requires: [
        'Ext.data.proxy.Rest', // without this the production apps don't work
        'CpsiMapview.util.Layer'
    ],
    extend: 'Ext.Mixin',

    mixins: {
        observable: 'Ext.util.Observable'
    },

    mixinConfig: {
        on: {
            constructor: function () {
                // Ext.mixin.Observable requires the constructor to be called
                // https://docs.sencha.com/extjs/6.7.0/classic/Ext.mixin.Observable.html
                this.mixins.observable.constructor.call(this);
            }
        },
        before: {
            save: 'onSave'
        }
    },

    /**
     * When the model is saved refresh any layers that are linked to the model
     * Note this will also be fired when a model is successfully deleted
     * */
    onModelSaved: function () {
        var me = this;
        var layerUtil = CpsiMapview.util.Layer;

        // update associated layers
        Ext.each(me.syncLayerKeys, function (k) {
            var layers = BasiGX.util.Layer.getLayersBy('layerKey', k);
            if (layers.length > 0) {
                var layer = layers[0];
                layerUtil.layerRefresh(layer);
            } else {
                //<debug>
                // if a switch layer is used then it may not yet have been created
                // so we check for its twin layer
                var switchLayerFound = false;
                var type = k.endsWith('_WMS') ? '_WMS' : '_WFS';
                var altType = k.endsWith('_WMS') ? '_WFS' : '_WMS';
                var altLayerKey = k.replace(type, altType);

                switchLayerFound = !Ext.isEmpty(BasiGX.util.Layer.getLayersBy('layerKey', altLayerKey));

                if (switchLayerFound === false) {
                    Ext.log.error('layerKey "' + k + '" in syncLayerKeys invalid for ' + me.$className);
                }
                //</debug>
            }
        });

        // update associated WFS stores (grid stores)
        Ext.each(me.syncStoreIds, function (k) {
            var store = Ext.data.StoreManager.lookup(k);
            if (store) {
                store.reload();
            } else {
                //<debug>
                // store may not be found if it has not yet been created
                // so check if it can be created by the supplied alias
                if (!Ext.ClassManager.getByAlias('store.' + k)) {
                    Ext.log.error('Store alias "' + k + '" in syncStoreIds not found for '
                        + me.$className);
                }
                //</debug>
            }
        });

        me.fireEvent('modelsaved');
    },

    /**
     * Add the mixin `onModelSaved` function to any save success callbacks
     * */
    onSave: function (options) {
        var me = this;

        if (options.success) {
            // last parameter sets the scope for the additional function
            options.success = Ext.Function.createSequence(options.success, me.onModelSaved, me);
        } else {
            options.success = me.onModelSaved;
        }
    }
});
