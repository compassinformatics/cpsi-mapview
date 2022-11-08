/**
 * This class is the controller for the DrawingButton.
 */
Ext.define('CpsiMapview.controller.button.DrawingButtonController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'BasiGX.util.Map',
        'BasiGX.util.MsgBox',
        'Ext.menu.Menu',
        'GeoExt.component.FeatureRenderer',
        'GeoExt.data.store.Features',
        'CpsiMapview.controller.button.TracingMixin'
    ],

    alias: 'controller.cmv_drawing_button',

    mixins: [
        'CpsiMapview.controller.button.TracingMixin'
    ],

    /**
     * The OpenLayers map. If not given, will be auto-detected
     */
    map: null,

    /**
     * The BasiGX mapComponent. If not given, will be auto-detected
     */
    mapComponent: null,

    /**
     * Temporary vector layer used while drawing points, lines or polygons
     */
    drawLayer: null,

    /**
     * OpenLayers draw interaction for drawing of lines and polygons
     */
    drawInteraction: null,

    /**
     * OpenLayers modify interaction
     * Used in polygon and point draw mode
     */
    modifyInteraction: null,

    /**
     * OpenLayers snap interaction for allowing easier tracing
     */
    snapInteraction: null,

    /**
     * If user has started to edit a line, this means the first point of a line is already set
     */
    currentlyDrawing: false,

    /**
     * Stores event listener keys to be un-listened to on destroy or button toggle
     */
    listenerKeys: [],

    /**
     * Determines if event handling is blocked.
     */
    //blockedEventHandling: false,

    constructor: function () {
        var me = this;
        me.handleDrawStart = me.handleDrawStart.bind(me);
        me.handleDrawEnd = me.handleDrawEnd.bind(me);
        me.handleModifyEnd = me.handleModifyEnd.bind(me);
        me.handleKeyPress = me.handleKeyPress.bind(me);
        me.callParent(arguments);
    },

    /**
     * Set the layer to store features drawn by the editing
     * tools
     * @param {any} layer
     */
    setDrawLayer: function (layer) {
        var me = this;

        if (!me.map) {
            return;
        }

        if (me.drawLayer) {
            me.map.removeLayer(me.drawLayer);
        }

        me.drawLayer = layer;
        me.setDrawInteraction(layer);
        me.setModifyInteraction(layer);
        me.setSnapInteraction(layer);
    },

    /**
     * Set the map drawing interaction
     * which will allow features to be added to the drawLayer
     * @param {any} layer
     */
    setDrawInteraction: function (layer) {

        var me = this;
        var view = me.getView();

        if (me.drawInteraction) {
            me.map.removeInteraction(me.drawInteraction);
        }

        var drawCondition = function (evt) {
            // the draw interaction does not work with the singleClick condition.
            return ol.events.condition.primaryAction(evt) && ol.events.condition.noModifierKeys(evt);
        };

        var source = layer.getSource();
        var collection = source.getFeaturesCollection();
        var drawInteractionConfig = {
            type: 'LineString',
            features: collection,
            condition: drawCondition,
            style: me.getDrawStyleFunction(),
            snapTolerance: view.getDrawInteractionSnapTolerance()
        };

        me.drawInteraction = new ol.interaction.Draw(drawInteractionConfig);
        me.drawInteraction.on('drawstart', me.handleDrawStart);
        me.drawInteraction.on('drawend', me.handleDrawEnd);

        me.map.addInteraction(me.drawInteraction);
    },

    /**
     * Prepare the styles retrieved from config.
     */
    prepareDrawingStyles: function () {
        var me = this;
        var view = me.getView();

        // ensure styles are applied at right conditions
        view.getDrawBeforeEditingPoint().setGeometry(function (feature) {
            var geom = feature.getGeometry();
            if (!me.currentlyDrawing) {
                return geom;
            }
        });
        view.getDrawStyleStartPoint().setGeometry(function (feature) {
            var geom = feature.getGeometry();
            var coords = geom.getCoordinates();
            var firstCoord = coords[0];
            return new ol.geom.Point(firstCoord);
        });
        view.getDrawStyleEndPoint().setGeometry(function (feature) {
            var coords = feature.getGeometry().getCoordinates();
            if (coords.length > 1) {
                var lastCoord = coords[coords.length - 1];
                return new ol.geom.Point(lastCoord);
            }
        });

        // ensure snap styles are always on top
        view.getSnappedNodeStyle().setZIndex(Infinity);
        view.getSnappedEdgeStyle().setZIndex(Infinity);
    },

    /**
     * Creates the style function for the drawn feature.
     *
     * @returns {Function} The style function for the drawn feature.
     */
    getDrawStyleFunction: function () {
        var me = this;
        var view = me.getView();

        return function (feature) {
            var coordinate = feature.getGeometry().getCoordinates();
            var pixel = me.map.getPixelFromCoordinate(coordinate);

            // remember if we have hit a referenced layer

            var node, edge, polygon, self;

            me.map.forEachFeatureAtPixel(pixel, function (foundFeature, layer) {
                if (layer) {
                    var key = layer.get('layerKey');
                    if (key === view.getNodeLayerKey()) {
                        node = foundFeature;
                    } else if (key === view.getEdgeLayerKey()) {
                        edge = foundFeature;
                    } else if (key === view.getPolygonLayerKey()) {
                        polygon = foundFeature;
                    } else if (me.drawLayer === layer) {
                        // snapping to self drawn feature
                        self = foundFeature;
                    }
                }
            });

            if (node) {
                return view.getSnappedNodeStyle();
            } else if (edge) {
                if (view.getShowVerticesOfSnappedEdge()) {
                    // Prepare style for vertices of snapped edge
                    // we create a MultiPoint from the edge's vertices
                    // and set it as geometry in our style function
                    var geom = edge.getGeometry();
                    var coords = [];
                    if (geom.getType() === 'MultiLineString') {
                        // use all vertices of containing LineStrings
                        var lineStrings = geom.getLineStrings();
                        Ext.each(lineStrings, function (lineString) {
                            var lineStringCoords = lineString.getCoordinates();
                            coords = coords.concat(lineStringCoords);
                        });
                    } else {
                        coords = geom.getCoordinates();
                    }
                    var verticesMultiPoint = new ol.geom.MultiPoint(coords);
                    var snappedEdgeVertexStyle = view.getSnappedEdgeVertexStyle().clone();
                    snappedEdgeVertexStyle.setGeometry(verticesMultiPoint);

                    // combine style for snapped point and vertices of snapped edge
                    return [
                        snappedEdgeVertexStyle,
                        view.getSnappedEdgeStyle()
                    ];
                } else {
                    return view.getSnappedEdgeStyle();
                }
            } else if (polygon) {
                return view.getSnappedPolygonStyle();
            } else if (self) {
                return view.getModifySnapPointStyle();
            } else {
                return me.defaultDrawStyle;
            }
        };
    },

    /**
     * Set the modify interaction, used to modify
     * existing features created in the drawLayer
     * We cannot however simply stop and start redrawing the line, adding directly to the vertices
     * https://stackoverflow.com/questions/45836955/openlayers-3-continue-drawing-the-initial-line-after-drawend-triggered-with-do/45859390#45859390
     * @param {any} layer
     */
    setModifyInteraction: function (layer) {

        var me = this;

        if (me.modifyInteraction) {
            me.map.removeInteraction(me.modifyInteraction);
        }

        var condition = function (evt) {
            // only allow modifying when the CTRL key is pressed, otherwise we cannot add new line
            // segments once the first feature is drawn
            return ol.events.condition.primaryAction(evt) && ol.events.condition.platformModifierKeyOnly(evt);
        };

        // create the modify interaction
        var modifyInteractionConfig = {
            features: layer.getSource().getFeaturesCollection(),
            condition: condition,
            // intentionally pass empty style, because modify style is
            // done in the draw interaction
            style: new ol.style.Style({})
        };
        me.modifyInteraction = new ol.interaction.Modify(modifyInteractionConfig);
        me.map.addInteraction(me.modifyInteraction);
        me.modifyInteraction.on('modifyend', me.handleModifyEnd);

    },

    /**
     * Set the snap interaction used to snap to features
     * @param {any} layer
     */
    setSnapInteraction: function (drawLayer) {

        var me = this;

        if (me.snapInteraction) {
            me.map.removeInteraction(me.snapInteraction);
        }

        // unbind any previous layer event listeners
        me.unBindLayerListeners();

        var snapCollection = new ol.Collection([], {
            unique: true
        });

        var fc = drawLayer.getSource().getFeaturesCollection();

        fc.on('add', function (evt) {
            snapCollection.push(evt.element);
        });

        fc.on('remove', function (evt) {
            snapCollection.remove(evt.element);
        });

        // Adds Features to a Collection, catches and ignores exceptions thrown
        // by the Collection if trying to add a duplicate feature, but still maintains
        // a unique collection of features. Used as an alternative to .extend but ensures
        // any potential errors related to unique features are handled / suppressed.
        var addUniqueFeaturesToCollection = function (collection, features) {
            Ext.Array.each(features, function (f) {
                // eslint-disable-next-line
                try { collection.push(f); } catch (e) { }
            });
        };

        // Checks if a feature exists in layers other than the current layer
        var isFeatureInOtherLayers = function (allLayers, currentLayer, feature) {
            var found = false;
            Ext.Array.each(allLayers, function(layer) {
                if(layer !== currentLayer) {
                    if(layer.getSource().hasFeature(feature)) {
                        found = true;
                    }
                }
            });
            return found;
        };

        // get the layers to snap to
        var view = me.getView();
        var layerKeys = view.getSnappingLayerKeys();
        var allowSnapToHiddenFeatures = view.getAllowSnapToHiddenFeatures();
        var layers = Ext.Array.map(layerKeys, function (key) {
            return BasiGX.util.Layer.getLayersBy('layerKey', key)[0];
        });

        Ext.Array.each(layers, function (layer) {
            var feats = layer.getSource().getFeatures(); // these are standard WFS layers so we use getSource without getFeaturesCollection here
            // add inital features to the snap collection, if the layer is visible
            // or if allowSnapToHiddenFeatures is enabled
            if (layer.getVisible() || allowSnapToHiddenFeatures) {
                addUniqueFeaturesToCollection(snapCollection, feats);
            }

            // Update the snapCollection on addfeature or removefeature
            var addFeatureKey = layer.getSource().on('addfeature', function (evt) {
                if (layer.getVisible() || allowSnapToHiddenFeatures) {
                    addUniqueFeaturesToCollection(snapCollection, [evt.feature]);
                }
            });

            var removefeatureKey = layer.getSource().on('removefeature', function (evt) {
                if (!isFeatureInOtherLayers(layers, layer, evt.feature)) {
                    snapCollection.remove(evt.feature);
                }
            });

            // Update the snapCollection on layer visibility change
            // only handle layer visible change event if snapping to hidden features is disabled
            if (!allowSnapToHiddenFeatures) {
                var changeVisibleKey = layer.on('change:visible', function () {
                    var features = layer.getSource().getFeatures();
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

            me.listenerKeys.push(addFeatureKey, removefeatureKey, changeVisibleKey);
        });

        // vector tile sources cannot be used for snapping as they
        // do not provide a getFeatures function
        // see https://openlayers.org/en/latest/apidoc/module-ol_source_VectorTile-VectorTile.html

        me.snapInteraction = new ol.interaction.Snap({
            features: snapCollection
        });
        me.map.addInteraction(me.snapInteraction);

    },

    getSnappedFeatureId: function (coord, searchLayer) {

        var me = this;
        var extent = ol.extent.boundingExtent([coord]); // still a single point

        var buffer = me.map.getView().getResolution() * 3; // use a 3 pixel tolerance for snapping

        extent = ol.extent.buffer(extent, buffer); // buffer the point as it may have snapped to a different feature than the nodes/edges

        var featureIds = [];

        // find all intersecting node points
        // https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html
        searchLayer.getSource().forEachFeatureIntersectingExtent(extent, function (feat) {
            //<debug>
            // this requires all GeoJSON features used for the layer to have an id property
            Ext.Assert.truthy(feat.getId());
            //</debug>
            featureIds.push(feat.getId());
        });

        // cases where the same feature is loaded into the layer leading to duplicated Ids
        // might be fixed now?
        featureIds = Ext.Array.unique(featureIds);

        if (featureIds.length === 1) {
            return featureIds[0];
        } else {
            if (featureIds.length > 1) {
                // TODO show layerKey instead of featureIds
                Ext.Logger.warn('Multiple features found at ' + coord + ':' + featureIds);
            }
            return null;
        }
    },

    /**
     * Rather than simply creating a new feature each time, attempt to
     * merge contiguous linestrings together if the end of the old line
     * matches the start of the new line
     * @param {any} origGeom
     * @param {any} newGeom
     */
    mergeLineStrings: function (origGeom, newGeom) {
        var newGeomFirstCoord = newGeom.getFirstCoordinate();
        var matchesFirstCoord = Ext.Array.equals(origGeom.getFirstCoordinate(), newGeomFirstCoord);
        var matchesLastCoord = Ext.Array.equals(origGeom.getLastCoordinate(), newGeomFirstCoord);

        if (matchesFirstCoord || matchesLastCoord) {
            var origCoords = origGeom.getCoordinates();
            // if drawing in continued from the start point of the original,
            // the original needs to be reversed to we end up with correct
            // start and end points
            if (matchesFirstCoord) {
                origCoords.reverse();
            }
            var newCoords = newGeom.getCoordinates();
            newGeom.setCoordinates(origCoords.concat(newCoords));
        } else {
            Ext.log('Start / End coordinates differ');
            Ext.log('origGeom start/end coords: ', origGeom.getFirstCoordinate(), origGeom.getLastCoordinate());
            Ext.log('newGeom start coord: ', newGeom.getFirstCoordinate());
        }

        return newGeom;
    },

    /**
     * Handles the drawstart event
     */
    handleDrawStart: function () {
        var me = this;
        me.currentlyDrawing = true;
    },

    /**
     * Handles the drawend event
     * @param {ol.interaction.Draw.Event} evt The OpenLayers draw event containing the features
     */
    handleDrawEnd: function (evt) {
        var me = this;
        var feature = evt.feature;
        var newGeom = feature.getGeometry();

        var drawSource = me.drawLayer.getSource();
        var currentFeature = drawSource.getFeaturesCollection().item(0);

        if (currentFeature) {
            // merge all linestrings to a single linestring
            // this is done in place
            me.mergeLineStrings(currentFeature.getGeometry(), newGeom);
        }

        me.calculateLineIntersections(feature);

        // clear all previous features so only the last drawn feature remains
        drawSource.getFeaturesCollection().clear();

        me.currentlyDrawing = false;
    },

    /**
    * Handles the modifyend event
    * @param {ol.interaction.Draw.Event} evt The OpenLayers draw event containing the features
    */
    handleModifyEnd: function (evt) {
        var me = this;
        var feature = evt.features.item(0);
        me.calculateLineIntersections(feature);
    },

    /**
     * Calculate where the geometry intersects other parts of the network
     * @param {any} newGeom
     */
    calculateLineIntersections: function (feature) {

        var me = this;
        var view = me.getView();

        var newGeom = feature.getGeometry();

        var startCoord = newGeom.getFirstCoordinate();
        var endCoord = newGeom.getLastCoordinate();

        var foundFeatAtStart = false;
        var foundFeatAtEnd = false;

        // get any nodes that the line snaps to

        var nodeLayerKey = view.getNodeLayerKey();
        var startNodeId = null;
        var endNodeId = null;

        if (nodeLayerKey) {
            var nodeLayer = BasiGX.util.Layer.getLayersBy('layerKey', nodeLayerKey)[0];
            startNodeId = me.getSnappedFeatureId(startCoord, nodeLayer);
            endNodeId = me.getSnappedFeatureId(endCoord, nodeLayer);

            foundFeatAtStart = startNodeId ? true : false;
            foundFeatAtEnd = endNodeId ? true : false;
        }

        // now check for any edges at both ends, but only in the case
        // where there are no start and end nodes

        var edgeLayerKey = view.getEdgeLayerKey();
        var startEdgeId = null;
        var endEdgeId = null;

        if (edgeLayerKey) {
            var edgesLayer = BasiGX.util.Layer.getLayersBy('layerKey', edgeLayerKey)[0];

            if (!foundFeatAtStart) {
                startEdgeId = me.getSnappedFeatureId(startCoord, edgesLayer);
                foundFeatAtStart = startEdgeId ? true : false;
            }

            if (!foundFeatAtEnd) {
                endEdgeId = me.getSnappedFeatureId(endCoord, edgesLayer);
                foundFeatAtEnd = endEdgeId ? true : false;
            }
        }

        // finally we will check if we have snapped to a polygon edge
        // this will allow us to create continua based on points around the polygon edge

        var polygonLayerKey = view.getPolygonLayerKey();
        var startPolygonId = null;
        var endPolygonId = null;

        if (polygonLayerKey) {
            var polygonsLayer = BasiGX.util.Layer.getLayersBy('layerKey', polygonLayerKey)[0];

            if (!foundFeatAtStart) {
                startPolygonId = me.getSnappedFeatureId(startCoord, polygonsLayer);
            }

            if (!foundFeatAtEnd) {
                endPolygonId = me.getSnappedFeatureId(endCoord, polygonsLayer);
            }
        }

        var result = {
            startNodeId: startNodeId,
            endNodeId: endNodeId,
            startCoord: startCoord,
            endCoord: endCoord,
            startEdgeId: startEdgeId,
            endEdgeId: endEdgeId,
            startPolygonId: startPolygonId,
            endPolygonId: endPolygonId
        };

        // set the node ids on the edge feature itself
        // as these can be used by a polygon tool / grid
        // the "magic" number -2 indicates a new node should be created
        // for the line, rather than snapping to an existing node
        feature.set('startNodeId', startNodeId ? startNodeId : -2);
        feature.set('endNodeId', endNodeId ? endNodeId : -2);

        // fire an event when the drawing is complete
        var drawSource = me.drawLayer.getSource();
        drawSource.dispatchEvent({ type: 'localdrawend', result: result });
    },

    handleKeyPress: function (evt) {

        var me = this; // bound to the controller in the constructor

        // use DEL to remove last point
        if (evt.keyCode == 46) {
            if (evt.shiftKey === true) {
                // or set focus just on the map as per https://stackoverflow.com/questions/59453895/add-keyboard-event-to-openlayers-map
                // or if the delete key is used in a form it will also remove a point
                me.drawInteraction.removeLastPoint();
            }
        }

        // use ESC to cancel drawing mode
        if (evt.keyCode == 27) {
            me.drawInteraction.finishDrawing();
        }
    },

    /**
     * Main handler which activates or deactivates the interactions and listeners
     * @param {Ext.button.Button} btn The button that has been pressed
     * @param {boolean} pressed The toggle state of the button
     */
    onToggle: function (btn, pressed) {
        var me = this;
        var view = me.getView();

        // guess the map if not given
        if (!me.map) {
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        // use draw layer set in the view
        //<debug>
        Ext.Assert.truthy(view.drawLayer);
        //</debug>
        if (!me.drawLayer) {
            if (view.drawLayer) {
                me.drawLayer = view.drawLayer;
            }
        }

        me.prepareDrawingStyles();

        // set initial style for drawing features
        me.defaultDrawStyle = [
            view.getDrawBeforeEditingPoint(),
            view.getDrawStyleStartPoint(),
            view.getDrawStyleLine(),
            view.getDrawStyleEndPoint(),
        ];
        me.drawLayer.setStyle(me.defaultDrawStyle);

        me.setDrawInteraction(me.drawLayer);
        me.setModifyInteraction(me.drawLayer);
        me.setSnapInteraction(me.drawLayer);

        var viewPort = me.map.getViewport();

        var tracingLayerKeys = view.getTracingLayerKeys();

        if (pressed) {

            me.initTracing(
                tracingLayerKeys,
                me.drawInteraction
            );
            me.drawInteraction.setActive(true);
            me.modifyInteraction.setActive(true);
            me.snapInteraction.setActive(true);
            viewPort.addEventListener('contextmenu', me.contextHandler);
            document.addEventListener('keydown', me.handleKeyPress);
        } else {
            me.cleanupTracing();
            me.drawInteraction.setActive(false);
            me.modifyInteraction.setActive(false);
            me.snapInteraction.setActive(false);
            viewPort.removeEventListener('contextmenu', me.contextHandler);
            document.removeEventListener('keydown', me.handleKeyPress);
        }
    },

    /**
     * Called when new tracing coordinates are available.
     *
     * @param {ol.coordinate.Coordinate[]} appendCoords The new coordinates
     */
    handleTracingResult: function (appendCoords) {
        var me = this;
        me.drawInteraction.removeLastPoint();
        me.drawInteraction.appendCoordinates(appendCoords);
    },

    /**
     * Method shows the context menu on mouse right click
     * @param {Event} evt The browser event
     */
    showContextMenu: function (evt) {
        // suppress default browser behaviour
        evt.preventDefault();

        var me = this.scope;

        var menuItems = [{
            text: 'Clear All',
            handler: function () {
                try {
                    me.drawLayer.getSource().getFeaturesCollection().clear();
                } catch (error) {
                    // sometimes get an error here when trying to clear the features collection
                    // Cannot read properties of null (reading 'findIndexBy')
                    // TODO debug - seems to occur after the layer is reloaded, so we may need to
                    // update the collection on reload? the source still has the same ol_uid
                    Ext.log.error(error);
                }
            }
        }];

        var menu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            renderTo: Ext.getBody(),
            items: menuItems
        });
        menu.showAt(evt.pageX, evt.pageY);
    },

    /**
     * Remove the interaction when this component gets destroyed
     */
    onBeforeDestroy: function () {

        var me = this;
        var btn = me.getView();

        // detoggle button
        me.onToggle(btn, false);

        // fire the button's toggle event so that the defaultClickEnabled property
        // is updated in CpsiMapview.util.ApplicationMixin to re-enable clicks
        btn.pressed = false;
        btn.fireEvent('toggle');


        if (me.drawInteraction) {
            me.map.removeInteraction(me.drawInteraction);
        }

        if (me.modifyInteraction) {
            me.map.removeInteraction(me.modifyInteraction);
        }

        if (me.snapInteraction) {
            me.map.removeInteraction(me.snapInteraction);
        }

        if (me.drawLayer) {
            me.map.removeLayer(me.drawLayer);
        }

        me.unBindLayerListeners();
        me.cleanupTracing();
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
    },

    init: function () {

        var me = this;

        // create an object for the contextmenu eventhandler
        // so it can be removed correctly
        me.contextHandler = {
            handleEvent: me.showContextMenu,
            scope: me
        };
    }
});
