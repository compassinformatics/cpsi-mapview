Ext.define('CpsiMapview.controller.LayerTreeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_layertree',

    requires: [
        'BasiGX.util.Map',
        'BasiGX.util.Layer',
        'CpsiMapview.data.model.LayerTreeNode'
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
            var nodeConf = null;
            var staticMe = CpsiMapview.controller.LayerTreeController;
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
                for (var i = 0; i < childNodeConf.children.length; i += 1) {
                    var currentChild = childNodeConf.children[i];
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
        var me = this;

        var mapPanel = CpsiMapview.view.main.Map.guess();

        mapPanel.on('cmv-init-layersadded', function () {
            me.initLayersAdded = true;
            me.autoConnectToMap(); // connect after all the layers have been loaded to the map
        });
    },

    /**
     * Guesses the mapcomponent and assigns the appropriate layers store, if one
     * could be guessed.
     */
    autoConnectToMap: function () {

        var me = this;

        var mapComp = BasiGX.util.Map.getMapComponent();
        me.map = mapComp && mapComp.getMap();

        if (me.map) {
            var store = me.makeLayerStore();
            me.getView().setStore(store);
        }
    },

    /**
     * This method will return an instance of the GeoExt class
     * `GeoExt.data.store.LayersTree` based on the connected OL #map. The layers
     * of the `ol.Map` are restructured and divided into groups based on the
     * JSON tree structure loaded in #loadTreeStructure. This assures that
     * the layers will appear in different folders in this TreePanel
     * (as defined in the tree structure JSON).
     *
     * @return {GeoExt.data.store.LayersTree} The created store.
     */
    makeLayerStore: function () {
        var me = this;

        // filter function for LayerTreeStore to hide unwanted layers in tree
        var layerFilter = function (layerRec) {
            var layer = layerRec.getOlLayer();
            if (layer) {
                // neither displayInLayerSwitcher=false (our flag) nor
                // bp_displayInLayerSwitcher=false (flag of BasiGX)
                return layer.get('displayInLayerSwitcher') !== false &&
                    layer.get('bp_displayInLayerSwitcher') !== false;
            }
        };

        var treeJsonPromise = me.loadTreeStructure();
        treeJsonPromise.then(function (treeJson) {
            // save defaults for tree nodes from config
            me.treeConfDefaults = treeJson.defaults || {};

            // get the root layer group holding the grouped map layers
            var rootLayerGroup = me.getGroupedLayers(treeJson.treeConfig);

            me.map.setLayerGroup(rootLayerGroup);
            // create a new LayerStore from the grouped layers
            var groupedLayerTreeStore = Ext.create('GeoExt.data.store.LayersTree', {
                model: 'CpsiMapview.data.model.LayerTreeNode',
                layerGroup: me.map.getLayerGroup(),
                filters: layerFilter
            });
            me.getView().setStore(groupedLayerTreeStore);

            me.getView().getRootNode().cascade(function (node) {
                // apply properties for tree node from corresponding tree-conf
                if (node.getOlLayer()) {
                    var origTreeNodeConf = node.getOlLayer().get('_origTreeConf') || {};
                    me.applyTreeConfigsToNode(node, origTreeNodeConf);
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
            Ext.Logger.warn('Loading of JSON structure for LayerTree failed' +
                '- creating flat layer hierarchy as fallback');

            var layerTreeStore = Ext.create('GeoExt.data.store.LayersTree', {
                layerGroup: me.map.getLayerGroup(),
                filters: layerFilter
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
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: 'resources/data/layers/tree.json',
                method: 'GET',
                success: function (response) {
                    var respJson = Ext.decode(response.responseText);
                    resolve(respJson);
                },
                failure: function (response) {
                    reject(response.status);
                }
            });
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
        var me = this;

        // wrapping all under the 'root' node aggregating all together
        var rootLayerGroup = new ol.layer.Group({
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
        var me = this;
        // go over all passed in tree childs nodes
        Ext.each(treeNodeChilds, function (child) {
            // apply defaults for tree nodes from config
            var generalDefaults = me.treeConfDefaults.general || {};
            Ext.applyIf(child, generalDefaults);

            // respect "isLeaf" for legacy reasons (but recommended using "leaf")
            var isLeaf = Ext.isDefined(child.isLeaf) ? child.isLeaf : child.leaf;
            // layer groups --> folders in tree
            if (isLeaf !== true) {
                // create empty layer group for this level
                var layerGroup = new ol.layer.Group({
                    name: child.title,
                    layers: [],
                });

                // preserve the original tree JSON config to re-use it later on
                layerGroup.set('_origTreeConf', child);

                var parentLayers = parentGroup.getLayers();
                parentLayers.insertAt(0, layerGroup);

                // recursion
                me.createOlLayerGroups(child.children, layerGroup);
            } else {
                // layers --> leafs in tree
                var mapLyr = BasiGX.util.Layer.getLayerBy('layerKey', child.id);

                if (mapLyr) {
                    // apply tree config to OL layer
                    // needed since the LayerTreeNode model derives them from OL layer
                    me.applyTreeConfigsToOlLayer(mapLyr, child);

                    // preserve the original tree JSON config to re-use it later on
                    mapLyr.set('_origTreeConf', child);

                    // add OL layer to parent OL LayerGroup
                    parentGroup.getLayers().insertAt(0, mapLyr);

                } else {
                    Ext.Logger.warn('Layer with layerKey ' + child.id + ' not found in map layers');
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
        node.set('expandable', Ext.isDefined(treeNodeConf.expandable) ? treeNodeConf.expandable : true);
        node.set('glyph', treeNodeConf.glyph);
        node.set('icon', treeNodeConf.icon);
        node.set('qshowDelay', treeNodeConf.qshowDelay);

        node.set('text', treeNodeConf.text);

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
     * This reacts on toggling the add wms Button in the layertree. It shows a window with an AddWmsForm.
     * @param {Ext.button.Button} button
     * @param {boolean} pressed
     */
    onAddWmsToggle: function (button, pressed) {
        var me = this;

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
    * Destroy any associated windows when this component gets destroyed
    */
    onBeforeDestroy: function () {
        if (this.addWmsWindow) {
            this.addWmsWindow.destroy();
            this.addWmsWindow = null;
        }
    }
});
