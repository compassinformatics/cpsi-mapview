/**
 * Util class for switchLayer related functions.
 *
 * @class CpsiMapview.util.SwitchLayer
 */
Ext.define('CpsiMapview.util.SwitchLayer', {
    alternateClassName: 'SwitchLayerUtil',
    singleton: true,

    requires: ['CpsiMapview.util.Layer'],

    /** The possible states of the layer switch */
    switchStates: {
        ABOVE_SWITCH_RESOLUTION: 'cmv_above_switch_resolution',
        BELOW_SWITCH_RESOLUTION: 'cmv_below_switch_resolution'
    },

    /**
     * Loops through all layers, identifies switch layers
     * and replaces them if required
     *
     * @param {Number} resolution The new resolution
     */
    handleSwitchLayerOnResolutionChange: function (resolution) {
        var staticMe = CpsiMapview.util.SwitchLayer;

        var layerCollection = BasiGX.util.Map.getMapComponent().getMap().getLayers();

        staticMe.checkSwitchLayersRecursively(layerCollection, resolution);
    },

    /**
     * Traverses layertree including subgroups and
     * changes switch layers if necessary
     * @param {ol.Collection} layerCollection the layers of the map
     * @param {Number} mapResolution the resolution of the map
     */
    checkSwitchLayersRecursively: function (layerCollection, mapResolution) {
        var staticMe = CpsiMapview.util.SwitchLayer;

        layerCollection.forEach(function (layerOrGroup, index) {

            if (layerOrGroup instanceof ol.layer.Layer &&
                layerOrGroup.get('isSwitchLayer')) {
                var switchLayer = layerOrGroup;
                var switchConfiguration = switchLayer.get('switchConfiguration');
                // get precomputed switch resolution from layer config
                var switchResolution = switchConfiguration.switchResolution;
                var currentSwitchType = switchLayer.get('currentSwitchType');

                var switchNecessary = staticMe.isLayerSwitchNecessary(
                    currentSwitchType,
                    switchResolution,
                    mapResolution
                );

                if (switchNecessary) {
                    staticMe.changeInternalLayer(layerCollection, switchLayer, index);
                }
            }

            else if (layerOrGroup instanceof ol.layer.Group) {
                var newOverlayCollection = layerOrGroup.getLayers();
                staticMe.checkSwitchLayersRecursively(newOverlayCollection, mapResolution);
            }
        });
    },

    /**
     * Changes a switchlayer from one internal layer to the other.
     *
     * Creates a new layer, copies the properties and add it to the layer
     * collection.
     *
     * @param {ol.Collection} layerCollection The layer collection
     * @param {ol.layer.Layer} switchLayer The switchLayer to change
     * @param {Number} index the index of the switchLayer in the collection
     */
    changeInternalLayer: function (layerCollection, switchLayer, index) {
        var staticMe = CpsiMapview.util.SwitchLayer;

        // complete any load events for the layer so the BasiGX.view.MapLoadingStatusBar
        // decrements correctly

        var originalSource = switchLayer.getSource();

        if (originalSource instanceof ol.source.Image) {
            originalSource.dispatchEvent('imageloadend');
        } else if (originalSource instanceof ol.source.Tile) {
            originalSource.dispatchEvent('tileloadend');
        } else if (originalSource instanceof ol.source.Vector) {
            originalSource.dispatchEvent('vectorloadend');
        }

        var switchConfiguration = switchLayer.get('switchConfiguration');
        // restore current layer visibility
        switchConfiguration.visibility = switchLayer.getVisible();
        // also apply current filter and selected style

        var noStyle = true;
        var newLayer = LayerFactory.createSwitchLayer(switchConfiguration, noStyle);

        // add original tree config (from tree.json) to new layer
        var origTreeNodeConf = newLayer.get('_origTreeConf');
        if (!origTreeNodeConf) {
            origTreeNodeConf = CpsiMapview.controller.LayerTreeController.getTreeNodeConf(newLayer.get('layerKey'));
            newLayer.set('_origTreeConf', origTreeNodeConf);
        }

        var newLayerSource = newLayer.getSource();
        // store filters for either layer type so they can be retrieved when switching
        var filters = originalSource.get('additionalFilters');
        newLayerSource.set('additionalFilters', filters);

        var activatedStyle = switchLayer.get('activatedStyle');

        // TODO: fix this warning and ensure a style is set
        if (!activatedStyle) {
            Ext.Logger.warn('activatedStyle not set for ' + switchLayer.get('layerKey'));
            activatedStyle = '';
        }

        newLayer.set('activatedStyle', activatedStyle);

        if (newLayer.get('isWms')) {
            // check if a label STYLES parameter was added --> keep this
            // the STYLES value (SLD) for the labels
            var labelClassName = newLayer.get('labelClassName');
            var wmsStyleList = activatedStyle;

            if (newLayer.get('labelsActive') === true) {
                wmsStyleList += ',' + labelClassName;
            }

            if (filters && filters.length > 0) {
                var ogcFilters = CpsiMapview.util.Layer.convertAndCombineFilters(filters);
                newLayerSource.getParams().FILTER = GeoExt.util.OGCFilter.combineFilters(ogcFilters, 'And', true, '1.1.0');
            }

            // ensure there is a filter for every layer listed in the WMS request (required by MapServer)
            var wmsFilterUtil = CpsiMapview.util.WmsFilter;
            var wmsFilterString = wmsFilterUtil.getWmsFilterString(newLayerSource.getParams());

            // apply new style parameter and reload layer
            var newParams = {
                STYLES: wmsStyleList,
                FILTER: wmsFilterString,
                TIMESTAMP: Ext.Date.now()
            };
            newLayerSource.updateParams(newParams);
        } else if (newLayer.get('isWfs') || newLayer.get('isVt')) {
            // load and parse SLD and apply it to layer
            if (newLayer.getVisible()) {
                LayerFactory.loadSld(newLayer);
            }
        } else {
            Ext.Logger.info('Layer type not supported in StyleSwitcherRadioGroup');
        }

        // `overlayCollection.setAt(0, newLayer)` causes strange
        // errors for some unknown reason. `setAt` at other indexes
        // as `0` seem to work fine. In case of `setAt(0, ... )`,
        // the change seems to be forwarded to the treeStore but
        // the change does not apply to the overlayCollection
        // itself. Or maybe the change is temporarily applied, but
        // immediately reverted afterwards.
        // this is a workaround
        layerCollection.insertAt(index + 1, newLayer);
        layerCollection.removeAt(index);

        // the configuration for the tree node got lost during the
        // switch. We add them again.
        var treePanel = Ext.ComponentQuery.query('treepanel')[0];
        treePanel.getController().applyTreeConfigsToOlLayer(newLayer, origTreeNodeConf);

        staticMe.updateLayerTreeForSwitchLayers();

        // ensure the layer appears as filtered in the tree
        CpsiMapview.util.Layer.updateLayerNodeUI(newLayer);
    },

    /**
     * Checks if the switch layer has to be replaced
     *
     * @param {String} currentSwitchType The type of the current switch
     * @param {Number} switchResolution The switchResolution of the layer
     * @param {Number} resolution The resolution of the map view
     *
     * @returns {Boolean} If layerswitch is necessary
     */
    isLayerSwitchNecessary: function (currentSwitchType, switchResolution, resolution) {
        var staticMe = CpsiMapview.util.SwitchLayer;
        // logic that checks when a switch layer needs to be replaced
        var mapviewBelowSwitchResolution = (resolution < switchResolution);
        var mapViewAboveSwitchResolution = !mapviewBelowSwitchResolution;

        var createCloseView = (mapviewBelowSwitchResolution && (currentSwitchType === staticMe.switchStates.ABOVE_SWITCH_RESOLUTION));
        var createFarAwayView = (mapViewAboveSwitchResolution && (currentSwitchType === staticMe.switchStates.BELOW_SWITCH_RESOLUTION));

        return createCloseView || createFarAwayView;
    },


    /**
     * Updates the switch layer items of the layer tree. This is
     * necessary when switch layers get replaced.
     */
    updateLayerTreeForSwitchLayers: function () {
        var treePanel = Ext.ComponentQuery.query('treepanel')[0];
        var treeStore = treePanel.getStore();
        var treeNodes = treeStore.getData();

        Ext.each(treeNodes.items, function (node) {
            var switchConf = node.getOlLayer().get('switchConfiguration');

            // only change for switch layers
            if (switchConf) {
                // apply tree node text from tree config
                var origTreeNodeConf = node.getOlLayer().get('_origTreeConf');
                node.set('text', origTreeNodeConf.text);
                // also set original iconCls
                node.set('iconCls', origTreeNodeConf.iconCls);
                // trigger UI updates (e.g. tree node plugins)
                node.triggerUIUpdate();
            }
        });
    }
});

