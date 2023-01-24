/**
 * Plugin to change opacity and font style of a layer tree node
 * if assigned layer is not in range
 */
Ext.define('CpsiMapview.plugin.TreeColumnInResolutionRange', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_tree_inresolutionrange',
    pluginId: 'cmv_tree_inresolutionrange',

    statics: {
        LINE_BREAK: '<br class="cpsi-resolution-range-popup-br" />'
    },

    /**
     * Initialize TreeColumnInResolutionRange plugin
     * @param {Ext.grid.column.Column} column The column to register the plugin
     *     for
     * @private
     */
    init: function(column) {
        var me = this;
        if (!(column instanceof Ext.grid.column.Column)) {
            Ext.log.warn('Plugin shall only be applied to instances of' +
                  ' Ext.grid.column.Column');
            return;
        }
        var mapComponent = BasiGX.util.Map.getMapComponent();
        mapComponent.getStore().setChangeLayerFilterFn(me.changeLayerFilterFn);

        var map = mapComponent.getMap();
        var mapView = map.getView();

        mapView.on('change:resolution', function() {
            me.updateTreeNode(mapView);
        });

        me.cmp.up('treepanel').on('cmv-init-layertree', function () {
            me.updateTreeNode(mapView);
        });

        me.cmp.up('treepanel').on('boxready', function (tp) {
            if (tp.getStore().count()) {
                map.getView().dispatchEvent('change:resolution');
            }
        });
    },

    /**
     * Custom change layer filter function to be applied to store
     * @param {GeoExt.data.model.Layer} record An GeoExt layer model instance
     * @private
     */
    changeLayerFilterFn: function (record) {
        var layer = this;
        return layer.id === record.getOlLayer().id;
    },

    /**
     * When resolution changes in map: update tree nodes if needed
     * @param {ol.View} mapView The OL map view
     */
    updateTreeNode: function (mapView) {
        var me = this;
        var unit = mapView.getProjection().getUnits();
        var resolution = mapView.getResolution();
        var treepanel = me.cmp.up('treepanel');
        var nodeStore = treepanel.getStore();
        var treeNodes = nodeStore.getData();
        Ext.each(treeNodes.items, function (node) {
            var inRange = me.layerInResolutionRange(node.getOlLayer(), resolution);
            node[inRange ? 'removeCls' : 'addCls']('cpsi-tree-node-disabled');
            var descriptionBefore = node.getOlLayer().get('description');
            var description = me.getTooltipText(node, inRange, unit);
            var changed = description !== descriptionBefore;
            node.getOlLayer().set('description', description);
            if (changed) {
                node.set('qtip', description);
            }
        });
        // This triggers the rendering if any existing StyleSwitcherRadioGroups
        treepanel.fireEvent('itemupdate');
    },

    /**
     * Check if layer is visible in current resolution range
     *
     * @param {ol.layer.Base} layer The OpenLayers layer
     * @param {Number} currentRes The current map resolution
     *
     * @returns {Boolean} layer is in resolution range?
     */
    layerInResolutionRange: function (layer, currentRes) {
        if (!layer || !currentRes) {
            // It is questionable what we should return in this case, I opted for
            // false, since we cannot sanely determine a correct answer.
            return false;
        }
        var layerMinRes = layer.getMinResolution(); // default: 0 if unset
        var layerMaxRes = layer.getMaxResolution(); // default: Infinity if unset
        // minimum resolution is inclusive, maximum resolution exclusive
        var within = currentRes >= layerMinRes && currentRes < layerMaxRes;
        return within;
    },

    /**
     * Get tooltip text for node
     *
     * @param {Ext.data.NodeInterface} node The layer tree node
     * @param {Boolean} inRange Is layer in range
     * @param {String} unit The unit defined in current map projection
     *
     * @returns {String} The toolip text valid for current range
     */
    getTooltipText: function (node, inRange, unit) {
        var staticMe = CpsiMapview.plugin.TreeColumnInResolutionRange;
        if (!Ext.isDefined(node.originalQtip)) {
            node.originalQtip = node.getOlLayer().get('description') || '';
        }

        if (inRange) {
            return node.originalQtip.length > 0 ? node.originalQtip : undefined;
        }

        var currentTip = node.getOlLayer().get('description');
        if (currentTip && (currentTip.indexOf(staticMe.LINE_BREAK) > -1 ||
            currentTip.indexOf('Visible') > -1)) {
            return currentTip;
        }

        var description = this.enhanceTooltip(node.getOlLayer(), unit);
        return description;
    },

    /**
     * Adds scale restriction information to decription text
     * @param {ol.layer.Base} layer The OpenLayers layer
     * @param {String} unit The unit defined in current map projection
     *
     * @returns {String} The enhanced toolip text
     */
    enhanceTooltip: function (layer, unit) {
        var staticMe = CpsiMapview.plugin.TreeColumnInResolutionRange;
        var scale = '', maxScale, minScale;
        maxScale = BasiGX.util.Map.getScaleForResolution(layer.getMaxResolution(), unit);
        minScale = BasiGX.util.Map.getScaleForResolution(layer.getMinResolution(), unit);
        if (maxScale) {
            // round to nearest 10
            maxScale = Math.round(maxScale / 10) * 10;
            maxScale = Ext.util.Format.number(maxScale, '0,000');
        }
        if (minScale) {
            // round both to nearest 10
            minScale = Math.round(minScale / 10) * 10;
            minScale = Ext.util.Format.number(minScale, '0,000');
        }

        if (maxScale && minScale) {
            scale = Ext.String.format('Visible between <b>1:{0}</b> and <b>1:{1}</b>', minScale, maxScale);
        } else {
            if (maxScale) {
                scale = Ext.String.format('Visible at <b>1:{0}</b> and above', maxScale);
            }
            if (minScale) {
                scale = Ext.String.format('Visible at <b>1:{0}<b> and below', minScale);
            }
        }
        return layer.get('description') ?
            (layer.get('description').trim() + staticMe.LINE_BREAK + scale) :
            scale;
    }

});
