/**
 * Util class for Cpsi layers
 */
Ext.define('CpsiMapview.util.Layer', {
    requires: [
        'BasiGX.util.Map'
    ],
    statics: {
        TIME_DEPENDENT_ATTRIBUTE_NAME: 'isTimeDedendent',

        /**
         * Function to get all time dependent layers in map
         * @param {ol.collection} collection (optional) an OpenLayers layer collection
         * @returns {ol.Layer[]} An array of time dependent layers
         */
        getTimeDependentLayers: function(collection) {
            var me = this;
            var matchingLayers = [];
            var layers;

            if (!Ext.isEmpty(collection)) {
                layers = collection.getArray ?
                    collection.getArray() : collection;
            } else {
                var map = BasiGX.util.Map.getMapComponent().getMap();
                layers = map.getLayers().getArray();
            }

            Ext.each(layers, function (layer) {
                if (layer.get(me.TIME_DEPENDENT_ATTRIBUTE_NAME) === true &&
                    layer instanceof ol.layer.Base) {
                    matchingLayers.push(layer);
                    return false;
                }
            });
            return matchingLayers;
        }
    }
});
