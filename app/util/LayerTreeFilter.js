/**
 * Util class for working with LayerTreeFilter
 *
 * @class CpsiMapview.util.LayerTreeFilter
 */
Ext.define('CpsiMapview.util.LayerTreeFilter', {
    alternateClassName: 'LayerTreeFilterUtil',

    statics: {
        /**
         * Checks if a group has at least one visible layer.
         *
         * @param {GeoExt.data.model.LayerTreeNode} node The node to check.
         * @return {boolean} True, if group has visible layer. False otherwise.
         */
        groupHasVisibleLayer: function(node) {
            if (node.hasChildNodes()) {
                var hasVisibleLayer = false;
                node.cascade(function (cascadeNode) {
                    // search for any descending node that is checked
                    if (!cascadeNode.hasChildNodes() && cascadeNode.get('checked')) {
                        hasVisibleLayer = true;
                    }
                });
                return hasVisibleLayer;
            } else {
                return true;
            }
        },

        /**
         * Checks if layer is visible.
         *
         * @param {GeoExt.data.model.LayerTreeNode} node The node to check.
         * @param {boolean} filterBaseLayers True, if baselayers should be filtered. False otherwise.
         * @return {boolean} True, if layer is visible. False otherwise.
         */
        isLayerVisible: function(node, filterBaseLayers) {
            if (node.hasChildNodes()) {
                return true;
            }
            // check if baselayers should be filtered
            if (!filterBaseLayers && node.getOlLayerProp('isBaseLayer')) {
                return true;
            }
            var checked = node.get('checked');
            return checked;
        },

        /**
         * Checks if a search text can be found in the layer name.
         *
         * @param {GeoExt.data.model.LayerTreeNode} node The node to check.
         * @param {string} searchText The search text.
         * @param {boolean} filterBaseLayers True, if baselayers should be filtered. False otherwise.
         * @return {boolean} True, if search text was found in layer name. False otherwise.
         */
        isSearchTextInLayerName: function(node, searchText, filterBaseLayers) {
            // always show group layers
            if (node.hasChildNodes()) {
                return true;
            }
            // check if baselayers should be filtered
            if (!filterBaseLayers && node.getOlLayerProp('isBaseLayer')) {
                return true;
            }
            var name = node.get('text');
            if (!name) {
                return;
            }
            // enforce case insensitive matches
            var text = name.toLowerCase();
            var compare = searchText.toLowerCase();
            return text.includes(compare);
        }
    }
});
