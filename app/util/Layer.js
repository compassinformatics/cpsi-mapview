/**
 * Util class for working with map layers
 *
 * @class CpsiMapview.util.Layer
 */
Ext.define('CpsiMapview.util.Layer', {
    alternateClassName: 'LayerUtil',
    requires: ['GeoExt.util.OGCFilter', 'CpsiMapview.util.WmsFilter'],
    singleton: true,

    /**
     * Update a vector tile layer parameter to be sent to the server
     * With MapServer MVT layers use the WMS protocol, but in OpenLayers these
     * parameters are added to a URL template
     * @param {any} layer
     * @param {any} newParams
     */
    updateVectorTileParameters: function (layer, newParams) {
        const source = layer.getSource();
        const params = CpsiMapview.util.WmsFilter.getWmsParams(layer);

        Ext.apply(params, newParams);

        const urlParts = source.getUrls()[0].split('?');

        // use decodeURI to the template holders in the url e.g. {width} are not encoded to %7Bwidth%7D
        const queryString = decodeURI(Ext.Object.toQueryString(params));
        const newUrl = Ext.String.format('{0}?{1}', urlParts[0], queryString);

        // don't use setUrl as this seems to replace the setTileUrlFunction function
        // set in CpsiMapview.factory.Layer
        source.urls[0] = newUrl;
        source.refresh();
    },

    /**
     * Executed when this menu item is clicked.
     * Forces redraw of the connected layer.
     */
    layerRefresh: function (layer) {
        let source = layer.getSource();

        // mostly WMS layers
        if (layer.get('isWms') === true) {
            const params = source.getParams();
            params.TIMESTAMP = Ext.Date.now();
            source.updateParams(params);
            source.refresh();
        } else if (layer.get('isVt') === true) {
            CpsiMapview.util.Layer.updateVectorTileParameters(layer, {
                TIMESTAMP: Ext.Date.now()
            });
        } else if (layer.get('isWfs') === true) {
            if (source instanceof ol.source.Cluster) {
                // for clustered layers we need to get the original source - see #203
                source = source.getSource();
            }
            // for WFS trigger reload of source
            source.set('timestamp', Ext.Date.now());
            source.refresh();
        } else {
            // only refresh for other layers and sources (to not loose data)
            source.refresh();
        }

        // also refresh the layer node, which updates any legend which may be broken
        // if a user's access token expires
        const layerUtil = CpsiMapview.util.Layer;
        layerUtil.updateLayerNodeUI(layer);
    },

    /**
     * Update any associated layer tree node to indicate that the layer is filtered or unfiltered
     * @param {any} layer
     * @param {boolean} triggerUIUpdate
     */
    updateLayerNodeUI: function (layer, triggerUIUpdate) {
        // default the triggerUIUpdate param to true if not set
        if (typeof triggerUIUpdate === 'undefined') {
            triggerUIUpdate = true;
        }

        // Get a reference to the layer trees
        // we will only ever have one layer tree for an application

        const treePanel = Ext.ComponentQuery.query('cmv_layertree:first')[0];

        if (!treePanel) {
            Ext.log.warn(
                'No cmv_layertree found in the application (updateLayerNodeUI)'
            );
            return;
        }

        const node = treePanel.getNodeForLayer(layer);

        if (!node) {
            return;
        }

        let hasFilters = false;

        if (layer.get('isWms') || layer.get('isVt')) {
            const params = CpsiMapview.util.WmsFilter.getWmsParams(layer);
            if (params.FILTER) {
                hasFilters = true;
            }
        } else if (layer.get('isWfs') === true) {
            let source = layer.getSource();
            if (source instanceof ol.source.Cluster) {
                // for clustered layers we need to get the original source - see #203
                source = source.getSource();
            }
            hasFilters = !Ext.isEmpty(
                CpsiMapview.util.Layer.getWfsFilters(source)
            );
        } else {
            Ext.log.warn('Layer type not recognized (updateLayerNodeUI)');
        }

        const originalGlyph = layer.get('_origTreeConf')
            ? layer.get('_origTreeConf').glyph
            : null;
        const expandedGlyph = 'f0b0';
        if (hasFilters) {
            // only set the glyph and class if needed - better for performance
            if (node.get('glyph') !== expandedGlyph) {
                node.set('glyph', expandedGlyph);
                node.addCls('cpsi-tree-node-filtered');
            }
        } else {
            // only set the glyph and class if needed - better for performance
            if (node.get('glyph') !== originalGlyph) {
                // revert to the original glyph if set on the layer
                node.set('glyph', originalGlyph);
                node.removeCls('cpsi-tree-node-filtered');
            }
        }

        if (triggerUIUpdate) {
            node.triggerUIUpdate();
        }
    },

    /**
     * Convert an array of Ext.util.Filter into OGC filters
     * taking into account when filters should be combined.
     *
     * For example when we use the cmv_feature_selection_btn a list of IDs with an IN filter is created
     * we need to use OR when these are combined with a spatial filter
     *
     * @param {any} allFilters
     *
     * @returns {Array} An array of all filters associated with the source as OGC FES
     *                 strings
     */
    convertAndCombineFilters: function (allFilters) {
        allFilters = Ext.clone(allFilters); // make a copy so the original array is unaffected
        const allOgcFilters = [];

        const fidFilter = Ext.Array.findBy(allFilters, function (f) {
            if (f.type === 'fid') {
                return true;
            }
        });

        // check for any polygons created using the grid tools to filter features
        // spatially
        const spatialFilter = Ext.Array.findBy(allFilters, function (f) {
            if (f.type === 'spatial') {
                return true;
            }
        });

        // if we have a combination of fid and spatial filters then these should be combined
        // as an OR query rather than AND to allow features to be selected outside the polygon

        if (fidFilter && spatialFilter) {
            Ext.Array.remove(allFilters, fidFilter);
            Ext.Array.remove(allFilters, spatialFilter);

            const idOgcFilterBody =
                GeoExt.util.OGCFilter.getOgcFilterBodyFromExtJsFilterObject(
                    fidFilter,
                    '2.0.0'
                );
            const spatialOgcFilter =
                GeoExt.util.OGCFilter.getOgcFilterBodyFromExtJsFilterObject(
                    spatialFilter,
                    '2.0.0'
                );

            // now combine the fid and spatial filters with using OR rather than AND
            allOgcFilters.push(
                GeoExt.util.OGCFilter.combineFilterBodies(
                    [idOgcFilterBody, spatialOgcFilter],
                    'Or',
                    false,
                    '2.0.0'
                )
            );
        }

        // for the remaining property features set by the grid convert from ExtJS filters to OGC FES strings
        Ext.each(allFilters, function (addFilter) {
            if (typeof addFilter === 'string') {
                // timeFilters have already been converted to OGC FEX strings
                //<debug>
                Ext.Assert.truthy(Ext.String.startsWith(addFilter, '<ogc:'));
                //</debug>
                allOgcFilters.push(addFilter);
            } else {
                const ogcUtil = GeoExt.util.OGCFilter;
                const serializedFilter =
                    ogcUtil.getOgcFilterBodyFromExtJsFilterObject(
                        addFilter,
                        '2.0.0'
                    );
                allOgcFilters.push(serializedFilter);
            }
        });

        return allOgcFilters;
    },

    /**
     * Get all filters that can be associated with a WFS layer
     * These include the timeslider, numeric sliders and
     * also the various filters that can be set from the cmv_grid
     * */
    getWfsFilters: function (layerSource) {
        let allFilters = [];

        // get filters from the cmv_timeslider
        const timeFilters = layerSource.get('timeFilters');
        if (!Ext.isEmpty(timeFilters)) {
            allFilters = Ext.Array.merge(allFilters, timeFilters);
        }

        // get any filters from the cmv_numericattributeslider

        let numericFilters = layerSource.get('numericFilters');

        if (!Ext.isEmpty(numericFilters)) {
            numericFilters = BasiGX.util.WFS.unwrapFilter(numericFilters);
            allFilters = Ext.Array.merge(allFilters, numericFilters);
        }

        // now check for all the filters that can be set by the grid

        const additionalFilters = layerSource.get('additionalFilters');

        if (!Ext.isEmpty(additionalFilters)) {
            allFilters = Ext.Array.merge(allFilters, additionalFilters);
        }

        return allFilters;
    },

    /**
     * Creates custom filters for a vector source based on
     * all the components which can set filters on a source
     *
     *
     * @param {ol.source.Vector}  Vector layer source
     *
     * @returns {Array} An array of all filters associated with the source as OGC FES
     *                  strings
     */
    filterVectorSource: function (layerSource) {
        const allFilters = CpsiMapview.util.Layer.getWfsFilters(layerSource);
        return CpsiMapview.util.Layer.convertAndCombineFilters(allFilters);
    }
});
