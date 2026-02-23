/**
 * A mixin to add snapping functionality to a drawing or digitizing tool.
 *
 * @class CpsiMapview.controller.button.SnappingMixin
 */
Ext.define('CpsiMapview.controller.button.SnappingMixin', {
    extend: 'Ext.Mixin',

    requires: ['BasiGX.util.Layer'],

    /**
     * OpenLayers snap interaction for allowing easier tracing
     */
    snapInteraction: null,

    /**
     * Stores event listener keys to be un-listened to on destroy or button toggle
     */
    listenerKeys: [],

    /**
     * Set the snap interaction used to snap to features
     * @param {any} drawLayer
     */
    setSnapInteraction: function (drawLayer) {
        const me = this;

        if (me.snapInteraction) {
            me.map.removeInteraction(me.snapInteraction);
        }

        // unbind any previous layer event listeners
        me.unBindLayerListeners();

        const snapCollection = new ol.Collection([], {
            unique: true
        });

        if (drawLayer) {
            const fc = drawLayer.getSource().getFeaturesCollection();

            fc.on('add', function (evt) {
                snapCollection.push(evt.element);
            });

            fc.on('remove', function (evt) {
                snapCollection.remove(evt.element);
            });
        }

        // Adds Features to a Collection, catches and ignores exceptions thrown
        // by the Collection if trying to add a duplicate feature, but still maintains
        // a unique collection of features. Used as an alternative to .extend but ensures
        // any potential errors related to unique features are handled / suppressed.
        const addUniqueFeaturesToCollection = function (collection, features) {
            Ext.Array.each(features, function (f) {
                try {
                    collection.push(f);
                } catch {
                    // ol.Collection throws if a duplicate is added - this is expected and can be ignored
                }
            });
        };

        // Checks if a feature exists in layers other than the current layer
        const isFeatureInOtherLayers = function (
            allLayers,
            currentLayer,
            feature
        ) {
            let found = false;
            Ext.Array.each(allLayers, function (layer) {
                if (layer !== currentLayer) {
                    if (layer.getSource().hasFeature(feature)) {
                        found = true;
                    }
                }
            });
            return found;
        };

        // get the layers to snap to
        const view = me.getView();
        const layerKeys = view.getSnappingLayerKeys();
        const allowSnapToHiddenFeatures = view.getAllowSnapToHiddenFeatures();
        const layers = Ext.Array.map(layerKeys, function (key) {
            return BasiGX.util.Layer.getLayersBy('layerKey', key)[0];
        });

        Ext.Array.each(layers, function (layer) {
            const feats = layer.getSource().getFeatures(); // these are standard WFS layers so we use getSource without getFeaturesCollection here
            // add initial features to the snap collection, if the layer is visible
            // or if allowSnapToHiddenFeatures is enabled
            if (layer.getVisible() || allowSnapToHiddenFeatures) {
                addUniqueFeaturesToCollection(snapCollection, feats);
            }

            // Update the snapCollection on addfeature or removefeature
            const addFeatureKey = layer
                .getSource()
                .on('addfeature', function (evt) {
                    if (layer.getVisible() || allowSnapToHiddenFeatures) {
                        addUniqueFeaturesToCollection(snapCollection, [
                            evt.feature
                        ]);
                    }
                });

            const removefeatureKey = layer
                .getSource()
                .on('removefeature', function (evt) {
                    if (!isFeatureInOtherLayers(layers, layer, evt.feature)) {
                        snapCollection.remove(evt.feature);
                    }
                });

            // Update the snapCollection on layer visibility change
            // only handle layer visible change event if snapping to hidden features is disabled

            let changeVisibleKey = null;

            if (!allowSnapToHiddenFeatures) {
                changeVisibleKey = layer.on('change:visible', function () {
                    const features = layer.getSource().getFeatures();
                    if (layer.getVisible()) {
                        addUniqueFeaturesToCollection(snapCollection, features);
                    } else {
                        Ext.Array.each(features, function (f) {
                            if (!isFeatureInOtherLayers(layers, layer, f)) {
                                snapCollection.remove(f);
                            }
                        });
                    }
                });
            }

            me.listenerKeys.push(addFeatureKey, removefeatureKey);

            if (changeVisibleKey) {
                me.listenerKeys.push(changeVisibleKey);
            }
        });

        // vector tile sources cannot be used for snapping as they
        // do not provide a getFeatures function
        // see https://openlayers.org/en/latest/apidoc/module-ol_source_VectorTile-VectorTile.html

        me.snapInteraction = new ol.interaction.Snap({
            features: snapCollection
        });
        me.map.addInteraction(me.snapInteraction);
    },

    /**
     * Remove event listeners by key, for each key in the listenerKeys array
     *
     */
    unBindLayerListeners: function () {
        Ext.Array.each(this.listenerKeys, function (key) {
            ol.Observable.unByKey(key);
        });
        this.listenerKeys = [];
    }
});
