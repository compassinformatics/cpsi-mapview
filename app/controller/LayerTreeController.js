/**
 * The controller for the {@link CpsiMapview.view.LayerTree}
 *
 * @class CpsiMapview.controller.LayerTreeController
 */
Ext.define('CpsiMapview.controller.LayerTreeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_layertree',

    requires: [
        'BasiGX.util.Map',
        'BasiGX.util.Layer',
        'CpsiMapview.data.model.LayerTreeNode',
        'CpsiMapview.view.main.Map',
        'CpsiMapview.util.Layer'
    ],

    statics: {
        /**
         * Detects the original tree node config from tree.json file for a
         * layer identified by the given layerKey.
         *
         * @param {String} layerKey Identifier of the layer to get node conf for
         * @param {Object} childNodeConf Conf to start with (root if not given)
         */
        getTreeNodeConf: function (layerKey, childNodeConf) {
            let nodeConf = null;
            const staticMe = CpsiMapview.controller.LayerTreeController;
            if (!childNodeConf) {
                childNodeConf = CpsiMapview.treeConfig;
            }

            if (childNodeConf.id === layerKey) {
                return childNodeConf;
            } else {
                // exit for leafs
                if (childNodeConf.leaf === true) {
                    return null;
                }
                // iterate recursively over all child nodes
                for (let i = 0; i < childNodeConf.children.length; i += 1) {
                    const currentChild = childNodeConf.children[i];
                    // Search in the current child
                    nodeConf = staticMe.getTreeNodeConf(layerKey, currentChild);

                    // Return result immediately if the node conf has been found
                    if (nodeConf !== null) {
                        return nodeConf;
                    }
                }
            }

            return nodeConf;
        }
    },

    /**
     * Mode in order to steer how the layers in tree will be structured.
     * At the moment 'BASELAYER_OVERLAY' will divide the layers in 2 folders
     * 'Base Layers' and 'Overlays' (depending on their property 'isBaseLayer').
     * All other settings will result in a flat layer list.
     *
     * @cfg {String}
     */
    structureMode: null,

    /**
     * Shows if the event 'cmv-init-layersadded' has been fired or not.
     *
     * @property {Boolean}
     * @private
     */
    initLayersAdded: false,

    /**
     * Holds the default values for tree nodes of the config file tree.json.
     * Will be set in #makeLayerStore function.
     *
     * @private
     * @readonly
     */
    treeConfDefaults: {},

    constructor: function () {
        const me = this;

        const mapPanel = CpsiMapview.view.main.Map.guess();

        mapPanel.on('cmv-init-layersadded', function () {
            me.initLayersAdded = true;
            me.autoConnectToMap(); // connect after all the layers have been loaded to the map
        });

        Ext.GlobalEvents.on('login', function () {
            me.filterLayersByRole();
        });

        Ext.GlobalEvents.on('logout', function () {
            me.filterLayersByRole();
        });
    },

    /**
     * Guesses the mapcomponent and assigns the appropriate layers store, if one
     * could be guessed.
     */
    autoConnectToMap: function () {
        const me = this;

        const mapComp = BasiGX.util.Map.getMapComponent();
        me.map = mapComp && mapComp.getMap();

        if (me.map) {
            me.makeLayerStore();
        }
    },

    /**
     * This method assigns an instance of the GeoExt class
     * `GeoExt.data.store.LayersTree` based on the connected OL #map to the view. The layers
     * of the `ol.Map` are restructured and divided into groups based on the
     * JSON tree structure loaded in #loadTreeStructure. This assures that
     * the layers will appear in different folders in this TreePanel
     * (as defined in the tree structure JSON).
     */
    makeLayerStore: function () {
        const me = this;

        const treeJsonPromise = me.loadTreeStructure();
        treeJsonPromise.then(function (treeJson) {
            // save defaults for tree nodes from config
            me.treeConfDefaults = treeJson.defaults || {};

            // get the root layer group holding the grouped map layers
            const rootLayerGroup = me.getGroupedLayers(treeJson.treeConfig);

            me.map.set('layerTreeRoot', rootLayerGroup);
            me.map.getLayers().insertAt(0, rootLayerGroup);

            // create a new LayerStore from the grouped layers
            const groupedLayerTreeStore = Ext.create(
                'GeoExt.data.store.LayersTree',
                {
                    model: 'CpsiMapview.data.model.LayerTreeNode',
                    layerGroup: rootLayerGroup,
                    // filters are applied from bottom to top
                    // necessary for filtering empty layer groups
                    filterer: 'bottomup'
                }
            );
            me.getView().setStore(groupedLayerTreeStore);

            // update possible switchlayers when collapsing their parent folder
            // otherwise the node text would be wrong/empty
            me.getView()
                .getRootNode()
                .on('beforeexpand', me.updateSwitchLayerNodes, me);

            me.getView()
                .getRootNode()
                .cascade(function (node) {
                    // apply properties for tree node from corresponding tree-conf
                    if (node.getOlLayer()) {
                        const origTreeNodeConf =
                            node.getOlLayer().get('_origTreeConf') || {};
                        me.applyTreeConfigsToNode(node, origTreeNodeConf);

                        // We are creating the gridWindow here already, to ensure that
                        // any preset filter will be applied directly, without having to
                        // open the gridWindow first.
                        const gridWindow = CpsiMapview.util.Grid.getGridWindow(
                            node.getOlLayer()
                        );
                        if (gridWindow) {
                            const grid = gridWindow.down('grid');
                            if (grid) {
                                grid.fireEvent('applypresetfilters');
                            }
                        }
                    }
                });

            // preserve tree config to access later on
            CpsiMapview.treeConfig = treeJson.treeConfig;

            // inform subscribers that LayerTree is ready
            me.getView().fireEvent('cmv-init-layertree', me);
        });

        // fallback in case loading the JSON tree structure failed:
        // create a flat store holding all map layers at one hierarchy
        treeJsonPromise.catch(function () {
            Ext.Logger.warn(
                'Loading of JSON structure for LayerTree failed' +
                    '- creating flat layer hierarchy as fallback'
            );

            const layerTreeStore = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup:
                    me.map.get('layerTreeRoot') || me.map.getLayerGroup()
            });

            me.getView().setStore(layerTreeStore);

            // inform subscribers that LayerTree is ready
            me.getView().fireEvent('cmv-init-layertree', me);
        });
    },

    /**
     * Loads the JSON tree structure from 'resources/data/layers/tree.json'.
     *
     * @return {Ext.Promise} Promise resolving once the JSON is loaded
     */
    loadTreeStructure: function () {
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        return app.getResourcePaths().then(function (resourcePaths) {
            return new Ext.Promise(function (resolve, reject) {
                Ext.Ajax.request({
                    url: resourcePaths.treeConfig,
                    method: 'GET',
                    success: function (response) {
                        const respJson = Ext.decode(response.responseText);
                        resolve(respJson);
                    },
                    failure: function (response) {
                        reject(response.status);
                    }
                });
            });
        });
    },

    /**
     * Ensures tree and map only contain layers for which
     * the user has the required roles to see.
     */
    filterLayersByRole: function () {
        const me = this;
        const store = me.getView().getStore();
        if (!store) {
            return;
        }
        store.filterBy(function (record) {
            const requiredRoles = record.get('requiredRoles');
            if (
                requiredRoles &&
                Ext.isArray(requiredRoles) &&
                requiredRoles.length
            ) {
                const showNode =
                    CpsiMapview.util.RoleManager.hasAtLeastOneRequiredRole(
                        requiredRoles
                    );
                return showNode;
            }
            return true;
        });
    },

    /**
     * Re-groups the layers of the #map, so they are put into a folder hierarchy
     * based on the given tree structure loaded in #loadTreeStructure.
     * For each folder an OL layer group is created and gets aggregated in a
     * root layer group.
     *
     * @param  {Object} treeJson LayerTree structure
     * @return {ol.layer.Group}  Root layer group
     */
    getGroupedLayers: function (treeConfJson) {
        const me = this;

        // wrapping all under the 'root' node aggregating all together
        const rootLayerGroup = new ol.layer.Group({
            name: 'root',
            layers: []
        });
        // recursively create the OL layer group by the given tree structure
        me.createOlLayerGroups(treeConfJson.children, rootLayerGroup);

        return rootLayerGroup;
    },

    /**
     * Creates recursively the OL layer groups for the given tree structure and
     * puts them all together in the given parent group so they get folders in the LayerTree.
     * Layers are directly put to the given parent group so they appear as "leafs" in the LayerTree.
     *
     * @param  {Object} treeNodesJson Child section of the LayerTree structure
     * @param  {ol.layer.Group} parentGroup The parent group to put children (another groups / layers) into
     */
    createOlLayerGroups: function (treeNodeChilds, parentGroup) {
        const me = this;
        // go over all passed in tree child nodes
        Ext.each(treeNodeChilds, function (child) {
            // apply defaults for tree nodes from config
            const generalDefaults = me.treeConfDefaults.general || {};
            Ext.applyIf(child, generalDefaults);

            // respect "isLeaf" for legacy reasons (but recommended using "leaf")
            const isLeaf = Ext.isDefined(child.isLeaf)
                ? child.isLeaf
                : child.leaf;
            // layer groups --> folders in tree
            if (isLeaf !== true) {
                // create empty layer group for this level
                const layerGroup = new ol.layer.Group({
                    name: child.title,
                    layers: []
                });

                // preserve the original tree JSON config to re-use it later on
                layerGroup.set('_origTreeConf', child);

                const parentLayers = parentGroup.getLayers();
                parentLayers.insertAt(0, layerGroup);

                // recursion
                me.createOlLayerGroups(child.children, layerGroup);
            } else {
                // layers --> leafs in tree
                const mapLyr = BasiGX.util.Layer.getLayerBy(
                    'layerKey',
                    child.id
                );

                if (mapLyr) {
                    // apply tree config to OL layer
                    // needed since the LayerTreeNode model derives them from OL layer
                    me.applyTreeConfigsToOlLayer(mapLyr, child);

                    // preserve the original tree JSON config to re-use it later on
                    mapLyr.set('_origTreeConf', child);

                    // add OL layer to parent OL LayerGroup
                    me.map.removeLayer(mapLyr);
                    parentGroup.getLayers().insertAt(0, mapLyr);
                } else {
                    //<debug>

                    // get the layers config object
                    const app = Ext.getApplication
                        ? Ext.getApplication()
                        : Ext.app.Application.instance;
                    const layerJson = app.layerJson;

                    // any switch layers not in the resolution when the app is loaded will be missing
                    // so we check for layer keys in the config JSON

                    const childLayers = Ext.Array.pluck(
                        layerJson.layers,
                        'layers'
                    ).filter(Boolean);
                    const allLayers = Ext.Array.merge(
                        Ext.Array.flatten(childLayers),
                        layerJson.layers
                    );
                    const layerKeys = Ext.Array.pluck(allLayers, 'layerKey');

                    if (!Ext.Array.indexOf(layerKeys, child.id) === -1) {
                        Ext.Logger.warn(
                            'Layer with layerKey ' +
                                child.id +
                                ' not found in map layers'
                        );
                    }
                    //</debug>
                }
            }
        });
    },

    /**
     * Applies the values from the tree layer config to OL the given
     * OL layer.
     *
     * @param {ol.layer.Base} olLayer The OL layer to apply tree conf values to
     * @param {Object} treeNodeConf The tree node layer config JSON
     */
    applyTreeConfigsToOlLayer: function (olLayer, treeNodeConf) {
        // name gets transformed to text on the layer tree node
        olLayer.set('name', treeNodeConf.text);
        // description gets transformed to qtip on the layer tree node
        olLayer.set('description', treeNodeConf.qtip);
        // descTitle gets transformed to qtitle on the layer tree node
        olLayer.set('descTitle', treeNodeConf.text);
        // changes the icon in the layer tree leaf
        olLayer.set('iconCls', treeNodeConf.iconCls);
    },

    /**
     * Applies the values from the tree layer config to the given
     * tree node instance.
     *
     * @param {Ext.data.NodeInterface} node The tree node to apply tree conf values to
     * @param {Object} treeNodeConf The tree node layer config JSON
     */
    applyTreeConfigsToNode: function (node, treeNodeConf) {
        node.set('cls', treeNodeConf.cls);
        node.set(
            'expandable',
            Ext.isDefined(treeNodeConf.expandable)
                ? treeNodeConf.expandable
                : true
        );
        node.set('glyph', treeNodeConf.glyph);
        node.set('icon', treeNodeConf.icon);
        node.set('qshowDelay', treeNodeConf.qshowDelay);

        node.set('text', treeNodeConf.text);
        node.set('requiredRoles', treeNodeConf.requiredRoles);

        // expand configured folders in this tree
        node.set('expanded', treeNodeConf.expanded);

        // hide checkbox on tree node if configured
        // setting checked to undefined has no effect since GeoExt.data.model.LayerTreeNode
        // overwrites this with the layer's visibility.
        if (treeNodeConf.checked === false) {
            node.addCls('cpsi-tree-no-checkbox');
        }
    },

    /**
     * Adds configuration to updated switch layer nodes.
     *
     * Ensures all layer information is transfered to the new
     * switch layer after the switch event
     *
     * @param {Ext.data.TreeModel} groupNode The folder node that is expanded
     */
    updateSwitchLayerNodes: function (groupNode) {
        const me = this;
        groupNode.cascade(function (child) {
            const layer = child.getOlLayer();
            if (!layer || !layer.get('isSwitchLayer')) {
                // we only care about switch layers
                return;
            }
            // the configuration for the tree node got lost during
            // the switch. We read it again from the layer and apply
            // it to the node.
            const origTreeNodeConf =
                child.getOlLayer().get('_origTreeConf') || {};
            me.applyTreeConfigsToNode(child, origTreeNodeConf);
        });
    },

    /**
     * This reacts on toggling the add wms Button in the layertree. It shows a window with an AddWmsForm.
     * @param {Ext.button.Button} button
     * @param {boolean} pressed
     */
    onAddWmsToggle: function (button, pressed) {
        const me = this;

        if (pressed) {
            if (!this.addWmsWindow) {
                this.addWmsWindow = Ext.create(me.getView().addWmsWindowConfig);
                this.addWmsWindow.on('close', function () {
                    button.setPressed(false);
                });
            }
            this.addWmsWindow.show();
        } else if (this.addWmsWindow) {
            this.addWmsWindow.close();
        }
    },

    /**
     * This reacts on toggling the add arcgisrest Button in the layertree. It shows a window with an AddArcGISRestForm.
     * @param {Ext.button.Button} button
     * @param {boolean} pressed
     */
    onAddArcGISRestToggle: function (button, pressed) {
        const me = this;

        if (pressed) {
            if (!this.addArcGISRestWindow) {
                this.addArcGISRestWindow = Ext.create(
                    me.getView().addArcGISRestWindowConfig
                );
                this.addArcGISRestWindow.on('close', function () {
                    button.setPressed(false);
                });
            }
            this.addArcGISRestWindow.show();
        } else if (this.addArcGISRestWindow) {
            this.addArcGISRestWindow.close();
        }
    },

    /**
     * Destroy any associated windows when this component gets destroyed
     */
    onBeforeDestroy: function () {
        if (this.addWmsWindow) {
            this.addWmsWindow.destroy();
            this.addWmsWindow = null;
        }
        if (this.addArcGISRestWindow) {
            this.addArcGISRestWindow.destroy();
            this.addArcGISRestWindow = null;
        }
    },

    /**
     * Updates the UI of childNodes of an expanded item
     * @param {CpsiMapview.data.model.LayerTreeNode} LayerTreeNode
     */
    updateExpandedItemChildNodesUI: function (layerTreeNode) {
        Ext.each(layerTreeNode.childNodes, function (node) {
            const layer = node.getOlLayer();
            if (layer.get('isWms') || layer.get('isWfs') || layer.get('isVt')) {
                CpsiMapview.util.Layer.updateLayerNodeUI(layer, false);
            }
        });
    }
});
