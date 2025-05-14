/**
 * Util class for working with LayerTreeFilter
 *
 * @class CpsiMapview.util.LayerTreeFilter
 */
Ext.define('CpsiMapview.util.LayerTreeFilter', {
    alternateClassName: 'LayerTreeFilterUtil',

    requires: ['Ext.util.Filter'],

    statics: {
        /**
         * Checks if layer is visible.
         *
         * @param {GeoExt.data.model.LayerTreeNode} node The node to check.
         * @param {boolean} filterBaseLayers True, if baselayers should be filtered. False otherwise.
         * @return {boolean} True, if layer is visible. False otherwise.
         */
        isLayerVisible: function (node, filterBaseLayers) {
            // check if baselayers should be filtered
            if (!filterBaseLayers && node.getOlLayerProp('isBaseLayer')) {
                return true;
            }
            const checked = node.get('checked');
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
        isSearchTextInLayerName: function (node, searchText, filterBaseLayers) {
            // check if baselayers should be filtered
            if (!filterBaseLayers && node.getOlLayerProp('isBaseLayer')) {
                return true;
            }
            const name = node.get('text');
            if (!name) {
                return;
            }
            // enforce case insensitive matches
            const text = name.toLowerCase();
            const compare = searchText.toLowerCase();
            return text.includes(compare);
        },

        /**
         * Creates a filter for the layer tree.
         *
         * @param {string} id The id for the filter.
         * @param {boolean} hideInvisibleLayers True, if invisible layers should be hidden. False otherwise.
         * @param {string} searchText The search text to filter by.
         * @param {boolean} filterBaseLayers True, if base layers should be filtered. False otherwise.
         * @return {Ext.util.Filter} The created filter.
         */
        createLayerTreeFilter: function (
            id,
            hideInvisibleLayers,
            searchText,
            filterBaseLayers
        ) {
            const staticMe = CpsiMapview.util.LayerTreeFilter;
            const filter = Ext.util.Filter({
                id: id,
                filterFn: function (node) {
                    const isLeaf = !node.hasChildNodes();
                    if (isLeaf) {
                        if (hideInvisibleLayers) {
                            const isVisible = staticMe.isLayerVisible(
                                node,
                                filterBaseLayers
                            );
                            if (!isVisible) {
                                return false;
                            }
                        }
                        if (searchText) {
                            const isMatch = staticMe.isSearchTextInLayerName(
                                node,
                                searchText,
                                filterBaseLayers
                            );
                            if (!isMatch) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            return filter;
        }
    }
});
