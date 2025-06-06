/**
 * This class is the controller for the DigitizeButton.
 */
Ext.define('CpsiMapview.controller.button.DigitizeButtonController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'BasiGX.util.Map',
        'BasiGX.util.MsgBox',
        'Ext.menu.Menu',
        'CpsiMapview.view.window.MinimizableWindow',
        'GeoExt.component.FeatureRenderer',
        'GeoExt.data.store.Features',
        'CpsiMapview.view.toolbar.CircleSelectionToolbar'
    ],

    alias: 'controller.cmv_digitize_button',

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
     * Temporary vector layer used to display the response features
     */
    resultLayer: null,

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
     * OpenLayers pointer interaction for deleting points
     */
    pointerInteraction: null,

    /**
     * OpenLayers snap interaction for better vertex selection
     */
    snapVertexInteraction: null,

    /**
     * OpenLayers snap interaction for better edge selection
     */
    snapEdgeInteraction: null,

    /**
     * CircleToolbar that will be set
     * when pressing a button of type `Circle`
     */
    circleToolbar: null,

    /**
     * Parent to add the circleToolbar to. MUST
     * implement the method `addDocked()`.
     */
    circleToolbarParent: null,

    /**
     * The index of the currently active group
     * Only used when `useContextMenu` is true
     */
    activeGroupIdx: 0,

    /**
     * The counter reflecting the number of groups
     * the user has created through the context menu
     */
    contextMenuGroupsCounter: 0,

    /**
     * Determines if event handling is blocked.
     */
    blockedEventHandling: false,

    constructor: function () {
        const me = this;

        me.handleDrawEnd = me.handleDrawEnd.bind(me);
        me.handleLocalDrawEnd = me.handleLocalDrawEnd.bind(me);
        me.handleCircleDrawEnd = me.handleCircleDrawEnd.bind(me);
        me.handleModifyEnd = me.handleModifyEnd.bind(me);

        me.callParent(arguments);
    },

    /**
     * Set the layer to store features drawn by the editing
     * tools
     * @param {any} layer
     */
    setDrawLayer: function (layer) {
        const me = this;

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
     * Set the layer used to store features returned
     * by the digitising services
     * @param {any} layer
     */
    setResultLayer: function (layer) {
        const me = this;

        if (!me.map) {
            return;
        }

        if (me.resultLayer) {
            me.map.removeLayer(me.resultLayer);
        }

        me.resultLayer = layer;
    },

    /**
     * Set the map drawing interaction
     * which will allow features to be added to the drawLayer
     * @param {any} layer
     */
    setDrawInteraction: function (layer) {
        const me = this;
        const view = me.getView();
        const type = view.getType();

        if (me.drawInteraction) {
            me.map.removeInteraction(me.drawInteraction);
        }

        const drawCondition = function (evt) {
            // the draw interaction does not work with the singleClick condition.
            return (
                ol.events.condition.primaryAction(evt) &&
                ol.events.condition.noModifierKeys(evt) &&
                !me.blockedEventHandling
            );
        };

        const drawInteractionConfig = {
            type: view.getMulti() ? 'Multi' + type : type,
            source: layer.getSource(),
            condition: drawCondition
        };

        if (type === 'Circle') {
            // Circle type does not support "multi", so we make sure that it is set appropriately
            drawInteractionConfig.type = type;
        }

        me.drawInteraction = new ol.interaction.Draw(drawInteractionConfig);

        // register listeners when connected to a backend service
        if (view.getApiUrl()) {
            me.drawInteraction.on(
                'drawend',
                type === 'Circle' ? me.handleCircleDrawEnd : me.handleDrawEnd
            );
        } else {
            me.drawInteraction.on('drawend', me.handleLocalDrawEnd);
        }

        me.map.addInteraction(me.drawInteraction);
    },

    /**
     * Set the modify interaction, used to modify
     * existing features created in the drawLayer
     * @param {any} layer
     */
    setModifyInteraction: function (layer) {
        const me = this;
        const view = me.getView();
        const type = view.getType();

        if (me.modifyInteraction) {
            me.map.removeInteraction(me.modifyInteraction);
        }

        const drawCondition = function (evt) {
            // the modify interaction does not work with the singleClick condition.
            return (
                ol.events.condition.primaryAction(evt) &&
                ol.events.condition.noModifierKeys(evt) &&
                !me.blockedEventHandling
            );
        };

        const deleteCondition = function (evt) {
            return (
                ol.events.condition.primaryAction(evt) &&
                ol.events.condition.platformModifierKeyOnly(evt) &&
                !me.blockedEventHandling
            );
        };

        // create the modify interaction
        if (type !== 'Circle') {
            const modifyInteractionConfig = {
                features: layer.getSource().getFeaturesCollection(),
                condition: drawCondition,
                deleteCondition: deleteCondition
            };
            me.modifyInteraction = new ol.interaction.Modify(
                modifyInteractionConfig
            );
            // add listeners when connected to a backend service
            if (view.getApiUrl()) {
                me.modifyInteraction.on('modifyend', me.handleModifyEnd);
            }
            me.map.addInteraction(me.modifyInteraction);
        }
    },

    /**
     * Create the pointer interaction used to delete
     * and add solver points
     * */
    setPointerInteraction: function () {
        const me = this;
        const view = me.getView();
        const type = view.getType();

        if (me.pointerInteraction) {
            me.map.removeInteraction(me.pointerInteraction);
        }

        if (type === 'Point') {
            const clickCondition = function (evt) {
                return (
                    ol.events.condition.primaryAction(evt) &&
                    ol.events.condition.noModifierKeys(evt) &&
                    !me.blockedEventHandling
                );
            };

            const deleteCondition = function (evt) {
                return (
                    ol.events.condition.primaryAction(evt) &&
                    ol.events.condition.platformModifierKeyOnly(evt) &&
                    !me.blockedEventHandling
                );
            };

            me.pointerInteraction = new ol.interaction.Pointer({
                handleEvent: function (evt) {
                    // fire an event to handle drag event ends for local drawing
                    if (evt.type === 'pointerup') {
                        if (!view.getApiUrl()) {
                            const drawSource = me.drawLayer.getSource();
                            drawSource.dispatchEvent({ type: 'localdrawend' });
                        }
                    }

                    if (deleteCondition(evt)) {
                        return me.handlePointDelete(evt);
                    }
                    if (clickCondition(evt)) {
                        // allow local drawing of features with no API calls
                        if (!view.getApiUrl()) {
                            return true;
                        }
                        return me.handlePointClick(evt);
                    }
                    return true;
                }
            });
            me.map.addInteraction(me.pointerInteraction);
        }
    },

    /**
     * Set the snap interaction used to snap to features
     * already in the drawLayer
     * @param {any} layer
     */
    setSnapInteraction: function (layer) {
        const me = this;
        const view = me.getView();
        const type = view.getType();

        if (me.snapVertexInteraction) {
            me.map.removeInteraction(me.snapVertexInteraction);
        }

        if (me.snapEdgeInteraction) {
            me.map.removeInteraction(me.snapEdgeInteraction);
        }

        if (type !== 'Circle') {
            me.snapVertexInteraction = new ol.interaction.Snap({
                source: layer.getSource()
            });
            me.map.addInteraction(me.snapVertexInteraction);
            me.snapEdgeInteraction = new ol.interaction.Snap({
                features: me.resultLayer.getSource().getFeaturesCollection(),
                vertex: false
            });
            me.map.addInteraction(me.snapEdgeInteraction);
        }
    },

    /**
     * Main handler which activates or deactivates the interactions and listeners
     * @param {Ext.button.Button} btn The button that has been pressed
     * @param {boolean} pressed The toggle state of the button
     */
    onToggle: function (btn, pressed) {
        const me = this;
        const view = me.getView();
        const type = view.getType();

        // guess the map if not given
        if (!me.map) {
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        // use default cmv_map Ext.panel.Panel for circle toolbar if not defined
        if (!me.circleToolbarParent) {
            me.circleToolbarParent = Ext.ComponentQuery.query('cmv_map')[0];
        }

        // create a temporary draw layer unless one has already been set

        if (!me.drawLayer) {
            if (view.drawLayer) {
                me.drawLayer = view.drawLayer;
            } else {
                me.drawLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    })
                });

                // apply any draw style set from the view
                const drawStyle = view.getDrawLayerStyle();
                if (drawStyle) {
                    me.drawLayer.setStyle(drawStyle);
                }
                me.map.addLayer(me.drawLayer);
            }
        }

        // create a result layer unless one has already been set
        if (!me.resultLayer) {
            if (view.resultLayer) {
                me.resultLayer = view.resultLayer;
            } else {
                me.resultLayer = new ol.layer.Vector({
                    name: 'resultLayer',
                    source: new ol.source.Vector({
                        features: new ol.Collection()
                    }),
                    style: view.getResultLayerStyle()
                });
                me.map.addLayer(me.resultLayer);
            }
        }

        me.setDrawInteraction(me.drawLayer);
        me.setModifyInteraction(me.drawLayer);
        me.setPointerInteraction();
        me.setSnapInteraction(me.drawLayer);

        if (pressed) {
            me.drawInteraction.setActive(true);
            if (type !== 'Circle') {
                me.modifyInteraction.setActive(true);
                me.snapVertexInteraction.setActive(true);
                me.snapEdgeInteraction.setActive(true);
            }
            if (type === 'Point') {
                me.pointerInteraction.setActive(true);
                me.drawLayer.setVisible(true);
            }
            me.map
                .getViewport()
                .addEventListener('contextmenu', me.contextHandler);
        } else {
            me.drawInteraction.setActive(false);
            if (type !== 'Circle') {
                me.modifyInteraction.setActive(false);
                me.snapVertexInteraction.setActive(false);
                me.snapEdgeInteraction.setActive(false);
            }
            if (type === 'Point') {
                me.pointerInteraction.setActive(false);
                // hide/show the draw layer based on if the tool is active
                // but leave circle/polygon features visible
                me.drawLayer.setVisible(false);
            }
            if (type === 'Circle' && me.circleToolbar != null) {
                me.removeCircleSelectToolbar();
            }
            me.map
                .getViewport()
                .removeEventListener('contextmenu', me.contextHandler);

            if (me.getView().getResetOnToggle()) {
                me.drawLayer.getSource().clear();
                me.clearActiveGroup();
                // reset context menu entries
                me.activeGroupIdx = 0;
                me.contextMenuGroupsCounter = 0;
            }
        }
    },

    blockEventHandling: function () {
        const me = this;

        me.blockedEventHandling = true;

        setTimeout(function () {
            me.blockedEventHandling = false;
        }, 300);
    },

    /**
     * Returns an Ext.form.field.Radio for the context menu
     * @param {number} idx The index that is used as value and label of the radio
     * @param {boolean} checked Boolean indicating if the radio shall be checked
     * @returns {object} An config object to create an Ext.form.field.Radio
     */
    getRadioGroupItem: function (idx, checked) {
        return {
            boxLabel: 'Group ' + (idx + 1).toString(),
            name: 'radiobutton',
            inputValue: idx,
            checked: checked
        };
    },

    /**
     * Method shows the context menu on mouse right click
     * @param {Event} evt The browser event
     */
    showContextMenu: function (evt) {
        // suppress default browser behaviour
        evt.preventDefault();

        const me = this.scope;
        const view = me.getView();

        const radioGroupItems = [];
        if (me.contextMenuGroupsCounter === 0) {
            radioGroupItems.push(me.getRadioGroupItem(0, true));
        } else {
            for (let i = 0; i <= me.contextMenuGroupsCounter; i++) {
                radioGroupItems.push(
                    me.getRadioGroupItem(i, me.activeGroupIdx === i)
                );
            }
        }

        let menuItems;
        if (view.getGroups()) {
            menuItems = [
                {
                    text: 'Start new Group',
                    handler: function () {
                        me.contextMenuGroupsCounter++;
                        me.activeGroupIdx = me.contextMenuGroupsCounter;
                    }
                },
                {
                    text: 'Active Group',
                    menu: {
                        name: 'active-group-submenu',
                        items: [
                            {
                                xtype: 'radiogroup',
                                columns: 1,
                                vertical: true,
                                items: radioGroupItems,
                                listeners: {
                                    change: function (radioGroup, newVal) {
                                        me.activeGroupIdx = newVal.radiobutton;
                                        me.updateDrawSource();
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    text: 'Clear Active Group',
                    handler: function () {
                        me.clearActiveGroup(me.activeGroupIdx);
                    }
                }
            ];
        } else {
            menuItems = [
                {
                    text: 'Clear All',
                    handler: function () {
                        me.drawLayer.getSource().clear();
                        me.clearActiveGroup(me.activeGroupIdx);
                    }
                }
            ];
        }

        const menu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            renderTo: Ext.getBody(),
            items: menuItems
        });
        menu.showAt(evt.pageX, evt.pageY);
    },

    /**
     * Returns all features in the active group from the result layer
     * @returns {ol.Feature[]}
     */
    getActiveGroupFeatures: function () {
        const me = this;
        return this.resultLayer
            .getSource()
            .getFeatures()
            .filter(function (feature) {
                return feature.get('group') === me.activeGroupIdx;
            });
    },

    /**
     * Returns only the solver points from the result layer in correct order
     * @returns {ol.Feature[]}
     */
    getSolverPoints: function () {
        return this.getActiveGroupFeatures()
            .filter(function (feature) {
                return feature.getGeometry() instanceof ol.geom.Point;
            })
            .sort(function (a, b) {
                return a.get('index') - b.get('index');
            });
    },

    /**
     * Handles the drawend event when using the feature to draw features that don't require
     * sending or returning any data from a back-end service
     * @param {ol.interaction.Draw.Event} evt The OpenLayers draw event containing the features
     */
    handleLocalDrawEnd: function () {
        const me = this;

        const drawSource = me.drawLayer.getSource();
        // clear all previous features so only the last drawn feature remains
        drawSource.clear();
        // fire an event when the drawing is complete
        drawSource.dispatchEvent({ type: 'localdrawend' });
    },

    /**
     * Handles the drawend event and gets the netsolver result which is passed to `handleFinalResult`
     * @param {ol.interaction.Draw.Event} evt The OpenLayers draw event containing the features
     */
    handleDrawEnd: function (evt) {
        const me = this;
        const view = me.getView();
        let resultPromise;

        me.blockEventHandling();

        switch (view.getType()) {
            case 'Point': {
                const points = me.getSolverPoints();
                resultPromise = me.getNetByPoints(points.concat([evt.feature]));
                break;
            }
            case 'Polygon':
                resultPromise = me.getNetByPolygon(evt.feature);
                break;
            case 'Circle':
                resultPromise = me.getNetByCircle(evt.feature);
                break;
            default:
                BasiGX.warn(
                    'Please implement your custom handler here for ' +
                        view.getType()
                );
                return;
        }

        resultPromise
            .then(me.handleFinalResult.bind(me))
            .then(me.updateDrawSource.bind(me));
    },

    /**
     * Handles the modifyend event and gets the netsolver result which is passed to `handleFinalResult`
     * @param {ol.interaction.Modify.Event} evt The OpenLayers modify event containing the features
     */
    handleModifyEnd: function (evt) {
        const me = this;
        const view = me.getView();
        let resultPromise;

        me.blockEventHandling();

        switch (view.getType()) {
            case 'Point': {
                // find modified feature
                const drawFeature = me.map.getFeaturesAtPixel(
                    evt.mapBrowserEvent.pixel,
                    {
                        layerFilter: function (layer) {
                            return layer === me.drawLayer;
                        }
                    }
                )[0];

                const index = drawFeature.get('index');
                const points = me.getSolverPoints();

                if (index === points.length - 1) {
                    points.splice(index, 1, drawFeature);
                    resultPromise = me.getNetByPoints(points);
                } else {
                    // we first get the corrected point from the netsolver and then recalculate the whole path
                    resultPromise = me
                        .getNetByPoints([drawFeature])
                        .then(function (features) {
                            if (features) {
                                const newFeature = features[0];
                                newFeature.set('index', index);
                                points.splice(index, 1, newFeature);
                                return me.getNetByPoints(points);
                            }
                        });
                }

                break;
            }
            case 'Polygon':
                resultPromise = me.getNetByPolygon(evt.features.getArray()[0]);
                break;
        }

        resultPromise
            .then(me.handleFinalResult.bind(me))
            .then(me.updateDrawSource.bind(me));
    },

    /**
     * Handles a click registered by the pointer interaction if the deleteCondition is met.
     * If it returns false all other interaction at this point are ignored
     * @param {ol.MapBrowserEvent} evt
     */
    handlePointDelete: function (evt) {
        const me = this;

        const features = me.map.getFeaturesAtPixel(evt.pixel, {
            layerFilter: function (layer) {
                return layer === me.drawLayer;
            }
        });
        if (features.length > 0) {
            me.blockEventHandling();

            const drawFeature = features[0];

            const points = me.getSolverPoints();
            points.splice(drawFeature.get('index'), 1);

            if (Ext.isEmpty(points)) {
                me.handleFinalResult([]);
                me.updateDrawSource();
            } else {
                me.getNetByPoints(points)
                    .then(me.handleFinalResult.bind(me))
                    .then(me.updateDrawSource.bind(me));
            }

            return false;
        } else {
            return true;
        }
    },

    /**
     * Handles the click registered by the pointer interaction.
     * If it returns false all other interaction at this point are ignored
     * @param {ol.MapBrowserEvent} evt
     */
    handlePointClick: function (evt) {
        const me = this;

        const features = me.map.getFeaturesAtPixel(evt.pixel, {
            layerFilter: function (layer) {
                return layer === me.drawLayer;
            }
        });

        const points = me.getSolverPoints();

        if (features.length > 0 && features[0] !== points[points.length - 1]) {
            // for pointerdown and pointerup events we simply want to return
            // we only want to create a new point on a user click
            if (evt.type !== 'singleclick') {
                return true;
            }

            me.blockEventHandling();

            // to allow loops to be created we need to allow users to click on the
            // start point to add a duplicate end point

            me.getNetByPoints(points.concat([features[0]]))
                .then(me.handleFinalResult.bind(me))
                .then(me.updateDrawSource.bind(me));

            return false;
        } else {
            // allow edges to be selected by clicking on them
            // by temporarily setting a blockedEventHandling flag
            const hasEdge = me.map.hasFeatureAtPixel(evt.pixel, {
                layerFilter: function (layer) {
                    return layer === me.resultLayer;
                }
            });
            if (hasEdge) {
                me.blockEventHandling();
            }
            return !hasEdge;
        }
    },

    /**
     * Handles the draw end event of the circle type by getting the feature and passing it
     * to the CircleSelection component
     * @param {DrawEvent} evt The OpenLayers draw event containing the features
     */
    handleCircleDrawEnd: function (evt) {
        const me = this;
        me.blockEventHandling();
        // deactivate the creation of another circle
        me.drawInteraction.setActive(false);
        me.circleToolbar = Ext.create(
            'CpsiMapview.view.toolbar.CircleSelectionToolbar',
            {
                feature: evt.feature
            }
        );
        me.circleToolbar.getController().on({
            circleSelectApply: me.onCircleSelectApply,
            circleSelectCancel: me.onCircleSelectCancel,
            scope: me
        });
        me.circleToolbarParent.addDocked(me.circleToolbar);
    },

    /**
     * Handles the `apply` event of the CircleSelection by passing the created circle
     * to the `handleDrawEnd` function. Also handles the cleanup of the CircleSelection toolbar
     * and enables the drawing interaction
     * @param {ol.Feature} feat
     */
    onCircleSelectApply: function (feat) {
        const me = this;
        const evt = { feature: feat };
        me.handleDrawEnd(evt);
        me.removeCircleSelectToolbar();
        me.drawInteraction.setActive(true);
    },

    /**
     * Handles the `cancel` event of the CircleSelection by cleaning up the CircleSelection toolbar
     * and enabling the drawing interaction
     */
    onCircleSelectCancel: function () {
        const me = this;
        me.drawLayer.getSource().clear();
        me.removeCircleSelectToolbar();
        me.drawInteraction.setActive(true);
    },

    /**
     * Handles the removal of the CircleSelect toolbar
     */
    removeCircleSelectToolbar: function () {
        const me = this;
        me.circleToolbarParent.removeDocked(me.circleToolbar);
        me.circleToolbar = null;
    },

    /**
     * Asynchronously gets a path between the given points from the netsolver.
     * @param {ol.Feature[]} features Expects the features in the correct order for solving. The coordinates of the last
     *      feature will get corrected by the netsolver. The other coordinates need to be valid coordinates for the
     *      netsolver (i.e. already corrected points)
     * @returns {Ext.Promise<ol.Feature[]|undefined>}
     */
    getNetByPoints: function (features) {
        const me = this;
        const view = me.getView();
        const format = new ol.format.GeoJSON({
            dataProjection: me.map.getView().getProjection().getCode()
        });
        let jsonParams, searchParams;

        features.forEach(function (feature, index) {
            feature.set('index', index);
        });

        // The Netsolver endpoint expects bbox to be sent within a request.
        // The lower left and upper right coordinates cannot be the same so
        // we have to apply a small buffer on the point geometry to get a
        // small bbox around the clicked point.
        if (view.getPointExtentBuffer()) {
            jsonParams = format.writeFeatures(features.slice(0, -1));
            const extent = features[features.length - 1]
                .getGeometry()
                .getExtent();
            const buffered = ol.extent.buffer(
                extent,
                view.getPointExtentBuffer()
            );
            searchParams = 'bbox=' + encodeURIComponent(buffered.join(','));
        } else {
            jsonParams = format.writeFeatures(features);
        }

        return me
            .doAjaxRequest(jsonParams, searchParams)
            .then(me.parseNetsolverResponse.bind(me));
    },

    /**
     * Asynchronously gets all lines inside the given polygon from the netsolver
     * @param {ol.Feature} feat
     * @returns {Ext.Promise<ol.Feature[]|undefined>}
     */
    getNetByPolygon: function (feat) {
        const me = this;
        const srs = me.map.getView().getProjection().getCode();
        const format = new ol.format.GeoJSON({
            dataProjection: srs
        });
        const geoJson = format.writeFeature(feat);
        const jsonParams = {};
        const geometryParamName = 'geometry' + srs.replace('EPSG:', '');
        jsonParams[geometryParamName] = Ext.JSON.decode(geoJson).geometry;
        return me
            .doAjaxRequest(jsonParams)
            .then(me.parseNetsolverResponse.bind(me));
    },

    /**
     * Asynchronously gets all lines inside the given circle from the netsolver
     * @param {ol.Feature} feat
     * @returns {Ext.Promise<ol.Feature[]|undefined>}
     */
    getNetByCircle: function (feat) {
        // ol circle objects consist of a center coordinate and a radius in the
        // unit of the projection. In order to convert it into a geoJSON, we have
        // to convert the circle to a polygon first.
        const circleAsPolygon = new ol.geom.Polygon.fromCircle(
            feat.getGeometry()
        );
        const polygonAsFeature = new ol.Feature({ geometry: circleAsPolygon });

        return this.getNetByPolygon(polygonAsFeature);
    },

    /**
     * Parses the netsolver result to openlayers features
     * @param {XMLHttpRequest} response
     * @returns {ol.Feature[]}
     */
    parseNetsolverResponse: function (response) {
        if (response) {
            const me = this;
            const format = new ol.format.GeoJSON();
            let json;

            if (!Ext.isEmpty(response.responseText)) {
                try {
                    json = Ext.decode(response.responseText);
                } catch (e) {
                    BasiGX.error(
                        'Could not parse the response: ' + response.responseText
                    );
                    Ext.log.error(e);
                    return;
                }
                if (json.success && json.data && json.data.features) {
                    const features = json.data.features;

                    return features.map(function (feat) {
                        // api will respond with non unique ids, which
                        // will collide with OpenLayers feature ids not
                        // being unique. That's why we delete it here.
                        delete feat.id;
                        // set the current active group as property
                        feat.properties.group = me.activeGroupIdx;
                        return format.readFeature(feat);
                    });
                } else {
                    Ext.toast({
                        html:
                            'No features found at this location' +
                            (json.message ? ' (' + json.message + ')' : ''),
                        title: 'No Features',
                        width: 200,
                        align: 'br'
                    });
                }
            } else {
                BasiGX.error('Response was empty');
            }
        }
    },

    /**
     * Issues an Ext.Ajax.request against the configured endpoint with
     * the given params.
     * @param {object} jsonParams Object containing the params to send
     * @param {string} searchParams The serarchParams which will be
     *   appended to the request url
     * @returns {Ext.request.Base}
     */
    doAjaxRequest: function (jsonParams, searchParams) {
        const me = this;
        const mapComponent =
            me.mapComponent || BasiGX.util.Map.getMapComponent();
        const view = me.getView();
        let url = view.getApiUrl();

        if (!url) {
            return;
        }

        if (searchParams) {
            url = Ext.urlAppend(url, searchParams);
        }

        mapComponent.setLoading(true);

        return new Ext.Promise(function (resolve) {
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                jsonData: jsonParams,
                success: function (response) {
                    mapComponent.setLoading(false);
                    resolve(response);
                },
                failure: function (response) {
                    mapComponent.setLoading(false);

                    if (response.aborted !== true) {
                        let errorMessage =
                            'Error while requesting the API endpoint';

                        if (
                            response.responseText &&
                            response.responseText.message
                        ) {
                            errorMessage +=
                                ': ' + response.responseText.message;
                        }

                        BasiGX.error(errorMessage);
                    }
                }
            });
        });
    },

    updateDrawSource: function () {
        const me = this;
        const view = me.getView();

        const drawSource = me.drawLayer.getSource();
        const type = view.getType();

        if (type === 'Point') {
            drawSource.clear();

            const drawFeatures = this.getSolverPoints().map(function (feature) {
                return feature.clone();
            });
            drawSource.addFeatures(drawFeatures);
        } else if (type === 'Polygon' || type === 'Circle') {
            if (drawSource.getFeatures().length > 1) {
                // keep the last drawn feature and remove the oldest one
                // it seems that the a half-completed draw polygon can consist of multiple features
                drawSource.removeFeature(drawSource.getFeatures()[0]);
            }
        }
    },

    /***
     * Get the total length of all features in the results layer
     * If a feature does not have a length property it will be assumed to
     * have a length of 0 (for example points)
     * */
    getResultGeometryLength: function () {
        const me = this;
        const allFeatures = me.resultLayer.getSource().getFeatures();
        let resultLength = 0;

        Ext.each(allFeatures, function (f) {
            if (f.get('group') === me.activeGroupIdx) {
                resultLength += f.get('length') ? f.get('length') : 0;
            }
        });

        return resultLength;
    },

    /**
     * Handles the final result from netsolver.
     * Features will get set a new property `group` in order
     * to maintain their membership to the current selected group.
     * A responseFeatures event is fired.
     * @param {undefined|ol.Feature[]} features The features returned from the API.
     */
    handleFinalResult: function (features) {
        if (features) {
            const me = this;

            const originalSolverPoints = me.getSolverPoints();
            const originalLength = me.getResultGeometryLength();

            // get the original solver points before they are removed
            const resultSource = me.resultLayer.getSource();
            // remove all features from the current active group
            const allFeatures = me.resultLayer
                .getSource()
                .getFeatures()
                .slice(0);
            Ext.each(allFeatures, function (f) {
                if (f.get('group') === me.activeGroupIdx || !f.get('group')) {
                    if (!f.get('group')) {
                        // the property must be updated before removing the feature, or it is readded to the store
                        f.set('group', me.activeGroupIdx);
                    }
                    resultSource.removeFeature(f);
                }
            });

            // add the new features for the current active group
            resultSource.addFeatures(features);

            // now get the new solver points once they have been added
            const newSolverPoints = me.getSolverPoints();
            let newLength = 0;

            Ext.each(features, function (f) {
                newLength += f.get('length') ? f.get('length') : 0;
            });

            const newEdgeCount = features.filter(function (feature) {
                return feature.getGeometry() instanceof ol.geom.LineString;
            }).length;

            const modifications = {
                originalLength: originalLength,
                newLength: newLength,
                newEdgeCount: newEdgeCount,
                originalSolverPoints: originalSolverPoints,
                newSolverPoints: newSolverPoints,
                toolType: me.getView().type
            };

            // fire a custom event from the source so a listener can be added once
            // all features have been added/removed
            // the event object includes a custom modifications object containing
            // details of before and after the solve
            resultSource.dispatchEvent({
                type: 'featuresupdated',
                modifications: modifications
            });

            // The response from the API, parsed as OpenLayers features, will be
            // fired here and the event can be used application-wide to access
            // and handle the feature response.
            me.getView().fireEvent('responseFeatures', features);
        }
    },

    /**
     * Remove the interaction when this component gets destroyed
     */
    onBeforeDestroy: function () {
        const me = this;
        const btn = me.getView();

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

        if (me.pointerInteraction) {
            me.map.removeInteraction(me.pointerInteraction);
        }

        if (me.snapVertexInteraction) {
            me.map.removeInteraction(me.snapVertexInteraction);
        }

        if (me.snapEdgeInteraction) {
            me.map.removeInteraction(me.snapEdgeInteraction);
        }

        if (me.drawLayer) {
            me.map.removeLayer(me.drawLayer);
        }

        if (me.resultLayer) {
            me.map.removeLayer(me.resultLayer);
        }

        if (me.circleToolbar) {
            me.circleToolbar.destroy();
        }
    },

    /**
     * Zooms the map to the extent of the clicked feature
     * Method may be removed as its actually a showcase, like `onResponseFeatures`
     */
    zoomToFeatures: function (grid, td, index, rec) {
        const me = this;
        const extent = rec.olObject.getGeometry().getExtent();
        me.map.getView().fit(extent, {
            size: me.map.getSize(),
            padding: [5, 5, 5, 5]
        });
    },

    /**
     * Showcasing the handling of the response features by adding them
     * to an `GeoExt.data.store.Features` and showing them in a grid.
     * Method may be removed as its actually a showcase, like `zoomToFeatures`
     */
    onResponseFeatures: function () {
        // the code below is just a show case representing how the response
        // features can be used within a feature grid.
        const me = this;

        const featStore = Ext.create('GeoExt.data.store.Features', {
            layer: this.resultLayer,
            map: me.map
        });

        featStore.filterBy(function (rec) {
            return rec.get('geometry').getType() !== 'Point';
        });

        const view = me.getView();
        const selectStyle = view.getResultLayerSelectStyle();

        if (me.win) {
            me.win.destroy();
        }
        me.win = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
            height: 500,
            width: 300,
            layout: 'fit',
            title: 'Your data',
            name: 'gridwin',
            items: [
                {
                    xtype: 'grid',
                    store: featStore,
                    selModel: {
                        type: 'featurerowmodel',
                        mode: 'MULTI',
                        allowDeselect: true,
                        mapSelection: true,
                        selectStyle: selectStyle,
                        map: me.map
                    },
                    columns: [
                        {
                            xtype: 'widgetcolumn',
                            width: 40,
                            widget: {
                                xtype: 'gx_renderer'
                            },
                            onWidgetAttach: function (
                                column,
                                gxRenderer,
                                record
                            ) {
                                // update the symbolizer with the related feature
                                const featureRenderer =
                                    GeoExt.component.FeatureRenderer;
                                const feature = record.getFeature();
                                gxRenderer.update({
                                    feature: feature,
                                    symbolizers:
                                        featureRenderer.determineStyle(record)
                                });
                            }
                        },
                        {
                            text: 'ID',
                            dataIndex: 'segmentId',
                            flex: 1
                        },
                        {
                            text: 'Code',
                            dataIndex: 'segmentCode',
                            flex: 1
                        },
                        {
                            text: 'Length',
                            dataIndex: 'segmentLength',
                            flex: 1,
                            renderer: function (val) {
                                return Ext.String.format(
                                    '{0} m',
                                    val.toFixed(0).toString()
                                );
                            }
                        }
                    ]
                }
            ]
        });
        me.win.showAt(100, 100);
    },

    /**
     * Clears all features of the active group from the result source
     * and fire a custom featuresupdated event
     * If no activeGroupIdx is supplied then all features are removed from the
     * resultLayer
     */
    clearActiveGroup: function (activeGroupIdx) {
        const me = this;
        const view = me.getView();

        if (!me.resultLayer) {
            // no results have been returned so nothing to clear
            return;
        }

        const originalSolverPoints = me.getSolverPoints();
        const originalLength = me.getResultGeometryLength();

        const resultSource = me.resultLayer.getSource();

        if (view.getGroups() === true) {
            resultSource
                .getFeatures()
                .slice(0)
                .filter(function (feature) {
                    return feature.get('group') === activeGroupIdx;
                })
                .forEach(function (feature) {
                    resultSource.removeFeature(feature);
                });
        } else {
            // remove all features
            resultSource.clear();
        }

        const modifications = {
            originalLength: originalLength,
            newLength: 0,
            originalSolverPoints: originalSolverPoints,
            newSolverPoints: []
        };

        resultSource.dispatchEvent({
            type: 'featuresupdated',
            modifications: modifications
        });
        me.updateDrawSource();

        // also fire a view event
        me.getView().fireEvent('responseFeatures', []);
    },

    init: function () {
        const me = this;

        // create an object for the contextmenu eventhandler
        // so it can be removed correctly
        me.contextHandler = {
            handleEvent: me.showContextMenu,
            scope: me
        };
    }
});
