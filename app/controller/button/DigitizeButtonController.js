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
    snapInteraction: null,

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

    /**
     * Main handler which activates or deactives the interactions and listeners
     * @param {Ext.button.Button} btn The button that has been pressed
     * @param {boolean} pressed The toggle state of the button
     */
    onToggle: function (btn, pressed) {
        var me = this;
        var view = me.getView();

        var deleteCondition = function (evt) {
            return ol.events.condition.singleClick(evt) && ol.events.condition.platformModifierKeyOnly(evt) && !me.blockedEventHandling;
        };

        var clickCondition = function (evt) {
            return ol.events.condition.singleClick(evt) && ol.events.condition.noModifierKeys(evt) && !me.blockedEventHandling;
        };

        var drawCondition = function (evt) {
            // the draw interaction does not work with the singleClick condition.
            return ol.events.condition.primaryAction(evt) && ol.events.condition.noModifierKeys(evt) && !me.blockedEventHandling;
        };

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
                    source: new ol.source.Vector(),
                    displayInLayerSwitcher: false,
                    style: view.getDrawLayerStyle()
                });
                me.map.addLayer(me.drawLayer);
            }
        }

        var type = view.getType();
        // create the draw interaction
        if (!me.drawInteraction) {
            var drawInteractionConfig = {
                type: view.getMulti() ? 'Multi' + type : type,
                source: me.drawLayer.getSource(),
                condition: drawCondition
            };
            if (type === 'Circle') {
                // Circle type does not support "multi", so we make sure that it is set appropriately
                drawInteractionConfig.type = type;
            }
            me.drawInteraction = new ol.interaction.Draw(drawInteractionConfig);
            // register listeners
            me.drawInteraction.on('drawend', type === 'Circle' ? me.handleCircleDrawEnd : me.handleDrawEnd, me);
            me.map.addInteraction(me.drawInteraction);
        }

        // create the modify interaction
        if (!me.modifyInteraction && type !== 'Circle') {
            var modifyInteractionConfig = {
                source: me.drawLayer.getSource(),
                condition: drawCondition,
                deleteCondition: deleteCondition
            };
            me.modifyInteraction = new ol.interaction.Modify(modifyInteractionConfig);
            me.modifyInteraction.on('modifyend', me.handleModifyEnd, me);
            me.map.addInteraction(me.modifyInteraction);
        }

        if (!me.pointerInteraction && type === 'Point') {
            me.pointerInteraction = new ol.interaction.Pointer({
                handleEvent: function (evt) {
                    if (deleteCondition(evt)) {
                        return me.handlePointDelete(evt);
                    }
                    if (clickCondition(evt)) {
                        console.log('click');
                        return me.handlePointClick(evt);
                    }
                    return true;
                }
            });
            me.map.addInteraction(me.pointerInteraction);
        }

        if (!me.snapInteraction && type !== 'Circle') {
            me.snapInteraction = new ol.interaction.Snap({
                source: me.drawLayer.getSource()
            });
            me.map.addInteraction(me.snapInteraction);
        }

        // create a result layer unless one has already been set
        if (!me.resultLayer) {
            if (view.resultLayer) {
                me.resultLayer = view.resultLayer;
            } else {
                me.resultLayer = new ol.layer.Vector({
                    name: 'resultLayer',
                    displayInLayerSwitcher: false,
                    source: new ol.source.Vector(),
                    style: view.getResultLayerStyle()
                });
                me.map.addLayer(me.resultLayer);
            }
        }

        if (pressed) {
            me.drawInteraction.setActive(true);
            if (type !== 'Circle') {
                me.modifyInteraction.setActive(true);
                me.snapInteraction.setActive(true);
            }
            if (type === 'Point') {
                me.pointerInteraction.setActive(true);
                me.drawLayer.setVisible(true);
            }
            me.map.getViewport().addEventListener('contextmenu', me.contextHandler);
        } else {
            me.drawInteraction.setActive(false);
            if (type !== 'Circle') {
                me.modifyInteraction.setActive(false);
                me.snapInteraction.setActive(false);
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
            me.map.getViewport().removeEventListener('contextmenu', me.contextHandler);

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
        var me = this;

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

        var me = this.scope;
        var view = me.getView();

        var radioGroupItems = [];
        if (me.contextMenuGroupsCounter === 0) {
            radioGroupItems.push(me.getRadioGroupItem(0, true));
        } else {
            for (var i = 0; i <= me.contextMenuGroupsCounter; i++) {
                radioGroupItems.push(me.getRadioGroupItem(i, me.activeGroupIdx === i));
            }
        }

        var menuItems;
        if (view.getGroups()) {
            menuItems = [
                {
                    text: 'Start new Group',
                    handler: function () {
                        me.contextMenuGroupsCounter++;
                        me.activeGroupIdx = me.contextMenuGroupsCounter;
                    }
                }, {
                    text: 'Active Group',
                    menu: {
                        name: 'active-group-submenu',
                        items: [{
                            xtype: 'radiogroup',
                            columns: 1,
                            vertical: true,
                            items: radioGroupItems,
                            listeners: {
                                'change': function (radioGroup, newVal) {
                                    me.activeGroupIdx = newVal.radiobutton;
                                    me.updateDrawSource();
                                }
                            }
                        }]
                    }
                }, {
                    text: 'Clear Active Group',
                    handler: function () {
                        me.clearActiveGroup(me.activeGroupIdx);
                    }
                }
            ];
        } else {
            menuItems = [{
                text: 'Clear All',
                handler: function () {
                    me.drawLayer.getSource().clear();
                    me.clearActiveGroup(me.activeGroupIdx);
                }
            }];
        }

        var menu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            renderTo: Ext.getBody(),
            items: menuItems
        });
        menu.showAt(evt.x, evt.y);
    },

    /**
     * Returns all features in the active group from the result layer
     * @returns {ol.Feature[]}
     */
    getActiveGroupFeatures: function () {
        var me = this;
        return this.resultLayer.getSource().getFeatures()
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
     * Handles the drawend event and gets the netsolver result which is passed to `handleFinalResult`
     * @param {ol.interaction.Draw.Event} evt The OpenLayers draw event containing the features
     */
    handleDrawEnd: function (evt) {
        var me = this;
        var view = me.getView();
        var resultPromise;

        me.blockEventHandling();

        switch (view.getType()) {
            case 'Point':
                var points = me.getSolverPoints();
                resultPromise = me.getNetByPoints(points.concat([evt.feature]));
                break;
            case 'Polygon':
                resultPromise = me.getNetByPolygon(evt.feature);
                break;
            case 'Circle':
                resultPromise = me.getNetByCircle(evt.feature);
                break;
            default:
                BasiGX.warn('Please implement your custom handler here for ' + view.getType());
                return;
        }

        resultPromise
            .then(me.handleFinalResult.bind(me))
            .then(undefined, function (err) {
                Ext.log.error(err);
            })
            .then(me.updateDrawSource.bind(me));
    },


    /**
     * Handles the modifyend event and gets the netsolver result which is passed to `handleFinalResult`
     * @param {ol.interaction.Modify.Event} evt The OpenLayers modify event containing the features
     */
    handleModifyEnd: function (evt) {
        var me = this;
        var view = me.getView();
        var resultPromise;

        me.blockEventHandling();

        switch (view.getType()) {
            case 'Point':
                // find modified feature
                var drawFeature = me.map.getFeaturesAtPixel(evt.mapBrowserEvent.pixel, {
                    layerFilter: function (layer) {
                        return layer === me.drawLayer;
                    }
                })[0];

                var index = drawFeature.get('index');
                var points = me.getSolverPoints();

                if (index === points.length - 1) {
                    points.splice(index, 1, drawFeature);
                    resultPromise = me.getNetByPoints(points);
                } else {
                    // we first get the corrected point from the netsolver and then recalculate the whole path
                    resultPromise = me.getNetByPoints([drawFeature])
                        .then(function (features) {
                            if (features) {
                                var newFeature = features[0];
                                newFeature.set('index', index);
                                points.splice(index, 1, newFeature);
                                return me.getNetByPoints(points);
                            }
                        });
                }

                break;
            case 'Polygon':
                resultPromise = me.getNetByPolygon(evt.features.getArray()[0]);
                break;
        }

        resultPromise
            .then(me.handleFinalResult.bind(me))
            .then(undefined, function (err) {
                Ext.log.error(err);
            })
            .then(me.updateDrawSource.bind(me));
    },

    /**
     * Handles a click registered by the pointer interaction if the deleteCondition is met.
     * If it returns false all other interaction at this point are ignored
     * @param {ol.MapBrowserEvent} evt
     */
    handlePointDelete: function (evt) {
        var me = this;

        var features = me.map.getFeaturesAtPixel(evt.pixel, {
            layerFilter: function (layer) {
                return layer === me.drawLayer;
            }
        });
        if (features && features.length) {
            me.blockEventHandling();

            var drawFeature = features[0];

            var points = me.getSolverPoints();
            points.splice(drawFeature.get('index'), 1);

            if (Ext.isEmpty(points)) {
                me.handleFinalResult([]);
                me.updateDrawSource();
            } else {
                me.getNetByPoints(points)
                    .then(me.handleFinalResult.bind(me))
                    .then(undefined, function (err) {
                        Ext.log.error(err);
                    })
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
        var me = this;

        var features = me.map.getFeaturesAtPixel(evt.pixel, {
            layerFilter: function (layer) {
                return layer === me.drawLayer;
            }
        });

        var points = me.getSolverPoints();

        if (features && features.length && features[0] !== points[points.length - 1]) {
            me.blockEventHandling();

            me.getNetByPoints(points.concat([features[0]]))
                .then(me.handleFinalResult.bind(me))
                .then(undefined, function (err) {
                    Ext.log.error(err);
                })
                .then(me.updateDrawSource.bind(me));

            return false;
        }

        return true;
    },

    /**
     * Handles the draw end event of the circle type by getting the feature and passing it
     * to the CircleSelection component
     * @param {DrawEvent} evt The OpenLayers draw event containing the features
     */
    handleCircleDrawEnd: function (evt) {
        var me = this;
        me.blockEventHandling();
        // deactivate the creation of another circle
        me.drawInteraction.setActive(false);
        me.circleToolbar = Ext.create('CpsiMapview.view.toolbar.CircleSelectionToolbar', {
            feature: evt.feature,
        });
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
        var me = this;
        var evt = { feature: feat };
        me.handleDrawEnd(evt);
        me.removeCircleSelectToolbar();
        me.drawInteraction.setActive(true);
    },

    /**
     * Handles the `cancel` event of the CircleSelection by cleaning up the CircleSelection toolbar
     * and enabling the drawing interaction
     */
    onCircleSelectCancel: function () {
        var me = this;
        me.drawLayer.getSource().clear();
        me.removeCircleSelectToolbar();
        me.drawInteraction.setActive(true);
    },

    /**
     * Handles the removal of the CircleSelect toolbar
     */
    removeCircleSelectToolbar: function () {
        var me = this;
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
        var me = this;
        var view = me.getView();
        var format = new ol.format.GeoJSON({
            dataProjection: me.map.getView().getProjection().getCode()
        });
        var jsonParams, searchParams;

        features.forEach(function (feature, index) {
            feature.set('index', index);
        });

        // The Netsolver endpoint expects bbox to be sent within a request.
        // The lower left and upper right coordinates cannot be the same so
        // we have to apply a small buffer on the point geometry to get a
        // small bbox around the clicked point.
        if (view.getPointExtentBuffer()) {
            jsonParams = format.writeFeatures(features.slice(0, -1));
            var extent = features[features.length - 1].getGeometry().getExtent();
            var buffered = ol.extent.buffer(extent, view.getPointExtentBuffer());
            searchParams = 'bbox=' + encodeURIComponent(buffered.join(','));
        } else {
            jsonParams = format.writeFeatures(features);
        }

        return me.doAjaxRequest(jsonParams, searchParams)
            .then(me.parseNetsolverResponse.bind(me));
    },

    /**
     * Asynchronously gets all lines inside the given polygon from the netsolver
     * @param {ol.Feature} feat
     * @returns {Ext.Promise<ol.Feature[]|undefined>}
     */
    getNetByPolygon: function (feat) {
        var me = this;
        var format = new ol.format.GeoJSON({
            dataProjection: me.map.getView().getProjection().getCode()
        });
        var geoJson = format.writeFeature(feat);
        var jsonParams = {
            geometry3857: Ext.JSON.decode(geoJson).geometry
        };
        return me.doAjaxRequest(jsonParams)
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
        var circleAsPolygon = new ol.geom.Polygon.fromCircle(feat.getGeometry());
        var polygonAsFeature = new ol.Feature({ geometry: circleAsPolygon });

        return this.getNetByPolygon(polygonAsFeature);
    },

    /**
     * Parses the netsolver result to openlayers features
     * @param {XMLHttpRequest} response
     * @returns {ol.Feature[]}
     */
    parseNetsolverResponse: function (response) {
        if (response) {
            var me = this;
            var format = new ol.format.GeoJSON();
            var json;

            if (!Ext.isEmpty(response.responseText)) {
                try {
                    json = Ext.decode(response.responseText);
                } catch (e) {
                    BasiGX.error('Could not parse the response: ' +
                        response.responseText);
                    return;
                }
                if (json.success && json.data && json.data.features) {
                    var features = json.data.features;

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
                    BasiGX.error('Could not find features in the response: ' +
                        (json.message ? json.message : JSON.stringify(json)));
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
        var me = this;
        var mapComponent = me.mapComponent || BasiGX.util.Map.getMapComponent();
        var view = me.getView();
        var url = view.getApiUrl();

        if (!url) {
            return;
        }

        if (searchParams) {
            url = Ext.urlAppend(url, searchParams);
        }

        mapComponent.setLoading(true);

        return Ext.Ajax.request({
            url: url,
            method: 'POST',
            jsonData: jsonParams,
            success: function (response) {
                mapComponent.setLoading(false);
                return response;
            },
            failure: function (response) {
                mapComponent.setLoading(false);

                var errorMessage = 'Error while requesting the API endpoint';

                if (response.responseText && response.responseText.message) {
                    errorMessage += ': ' + response.responseText.message;
                }

                BasiGX.error(errorMessage);
            }
        });
    },

    updateDrawSource: function () {
        var me = this;
        var view = me.getView();

        var drawSource = me.drawLayer.getSource();
        var type = view.getType();

        if (type === 'Point') {
            drawSource.clear();

            var drawFeatures = this.getSolverPoints()
                .map(function (feature) {
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

        var me = this;
        var allFeatures = me.resultLayer.getSource().getFeatures();
        var resultLength = 0;

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
            var me = this;

            var originalSolverPoints = me.getSolverPoints();
            var originalLength = me.getResultGeometryLength();

            // get the original solver points before they are removed
            var resultSource = me.resultLayer.getSource();
            // remove all features from the current active group
            var allFeatures = me.resultLayer.getSource().getFeatures();
            Ext.each(allFeatures, function (f) {
                if (f.get('group') === me.activeGroupIdx) {
                    resultSource.removeFeature(f);
                }
            });
            // add the new features for the current active group
            resultSource.addFeatures(features);

            // now get the new solver points once they have been added
            var newSolverPoints = me.getSolverPoints();
            var newLength = 0;

            Ext.each(features, function (f) {
                newLength += f.get('length') ? f.get('length') : 0;
            });

            var modifications = {
                originalLength: originalLength,
                newLength: newLength,
                originalSolverPoints: originalSolverPoints,
                newSolverPoints: newSolverPoints
            };

            // fire a custom event from the source so a listener can be added once
            // all features have been added/removed
            // the event object includes a custom modifications object containing
            // details of before and after the solve
            resultSource.dispatchEvent({ type: 'featuresupdated', modifications: modifications });

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

        var me = this;
        var btn = me.getView();

        // detoggle button
        me.onToggle(btn, false);

        if (me.drawInteraction) {
            me.map.removeInteraction(me.drawInteraction);
        }

        if (me.modifyInteraction) {
            me.map.removeInteraction(me.modifyInteraction);
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
        var me = this;
        var extent = rec.olObject.getGeometry().getExtent();
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
        var me = this;

        var featStore = Ext.create('GeoExt.data.store.Features', {
            layer: this.resultLayer,
            map: me.map
        });

        featStore.filterBy(function (rec) {
            return rec.get('geometry').getType() !== 'Point';
        });

        var view = me.getView();
        var selectStyle = view.getResultLayerSelectStyle();

        if (me.win) {
            me.win.destroy();
        }
        me.win = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
            height: 500,
            width: 300,
            layout: 'fit',
            title: 'Your data',
            name: 'gridwin',
            items: [{
                xtype: 'grid',
                store: featStore,
                columns: [{
                    xtype: 'widgetcolumn',
                    width: 40,
                    widget: {
                        xtype: 'gx_renderer'
                    },
                    onWidgetAttach: function (column, gxRenderer, record) {
                        // update the symbolizer with the related feature
                        var featureRenderer = GeoExt.component.FeatureRenderer;
                        var feature = record.getFeature();
                        gxRenderer.update({
                            feature: feature,
                            symbolizers: featureRenderer.determineStyle(record)
                        });
                    }
                }, {
                    text: 'ID',
                    dataIndex: 'segmentId',
                    flex: 1
                }, {
                    text: 'Code',
                    dataIndex: 'segmentCode',
                    flex: 1
                }, {
                    text: 'Length',
                    dataIndex: 'segmentLength',
                    flex: 1,
                    renderer: function (val) {
                        return Ext.String.format(
                            '{0} m',
                            val.toFixed(0).toString()
                        );
                    }
                }],
                listeners: {
                    'selectionchange': function (grid, selected) {
                        // reset all selections
                        featStore.each(function (rec) {
                            rec.getFeature().setStyle(me.resultLayer.getStyle());
                        });
                        // highlight grid selection in map
                        Ext.each(selected, function (rec) {
                            rec.getFeature().setStyle(selectStyle);
                        });
                    },
                    'cellclick': me.zoomToFeatures,
                    scope: me
                }
            }]
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
        var me = this;

        if (!me.resultLayer) {
            // no results have been returned so nothing to clear
            return;
        }

        var originalSolverPoints = me.getSolverPoints();
        var originalLength = me.getResultGeometryLength();

        var resultSource = me.resultLayer.getSource();

        if (Ext.isEmpty(activeGroupIdx)) {
            // remove all features
            resultSource.clear();
        } else {
            resultSource.getFeatures()
                .filter(function (feature) {
                    return feature.get('group') === activeGroupIdx;
                })
                .forEach(function (feature) {
                    resultSource.removeFeature(feature);
                });
        }

        var modifications = {
            originalLength: originalLength,
            newLength: 0,
            originalSolverPoints: originalSolverPoints,
            newSolverPoints: []
        };

        resultSource.dispatchEvent({ type: 'featuresupdated', modifications: modifications });
        this.updateDrawSource();
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
