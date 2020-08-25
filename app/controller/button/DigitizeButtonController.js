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
     * Used in polygon draw mode only
     */
    modifyInteraction: null,

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
     * Main handler which activates or deactives the interactions and listeners
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
                    displayInLayerSwitcher: false
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
                condition: function (e) {
                    // enable drawing with left mouse only
                    return e.originalEvent && e.originalEvent.buttons === 1;
                }
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
        if (type === 'Polygon' && !me.modifyInteraction) {
            var modifyInteractionConfig = {
                source: me.drawLayer.getSource(),
                deleteCondition: function (e) {
                    return e.type === 'click' && e.originalEvent.ctrlKey;
                }
            };
            me.modifyInteraction = new ol.interaction.Modify(modifyInteractionConfig);
            me.modifyInteraction.on('modifyend', me.handleDrawEnd, me);
            me.map.addInteraction(me.modifyInteraction);
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
            if (type === 'Polygon') {
                me.modifyInteraction.setActive(true);
            }
            if (me.getView().getUseContextMenu()) {
                me.map.getViewport().addEventListener('contextmenu', me.contextHandler);
            }
        } else {
            if (type === 'Polygon') {
                me.modifyInteraction.setActive(false);
            }
            if (type === 'Circle' && me.circleToolbar != null) {
                me.removeCircleSelectToolbar();
            }
            if (me.getView().getUseContextMenu()) {
                me.map.getViewport().removeEventListener('contextmenu', me.contextHandler);
            }
            me.drawInteraction.setActive(false);

            if (me.getView().getResetOnToggle()) {
                me.drawLayer.getSource().clear();
                if (me.resultLayer) {
                    me.resultLayer.getSource().clear();
                }
                // reset context menu entries
                me.activeGroupIdx = 0;
                me.contextMenuGroupsCounter = 0;
            }
        }
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

        var radioGroupItems = [];
        if (me.contextMenuGroupsCounter === 0) {
            radioGroupItems.push(me.getRadioGroupItem(0, true));
        } else {
            for (var i = 0; i <= me.contextMenuGroupsCounter; i++) {
                radioGroupItems.push(me.getRadioGroupItem(i, me.activeGroupIdx === i));
            }
        }
        var menu = Ext.create('Ext.menu.Menu', {
            width: 100,
            plain: true,
            renderTo: Ext.getBody(),
            items: [{
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
                            }
                        }
                    }]
                }
            }]
        });
        menu.showAt(evt.x, evt.y);
    },

    /**
     * Handles the draw end event by getting the features and passing them
     * to the `prepareRequestParams` function
     * @param {DrawEvent} evt The OpenLayers draw event containing the features
     */
    handleDrawEnd: function (evt) {
        // evt.feature if filled after drawend, only contains current finished feature.
        // evt.features is set on modifyend and will contain all the current features of that geom-type
        var feat = evt.feature ? evt.feature : evt.features.getArray();
        this.prepareRequestParams(feat);
    },

    /**
     * Handles the draw end event of the circle type by getting the feature and passing it
     * to the CircleSelection component
     * @param {DrawEvent} evt The OpenLayers draw event containing the features
     */
    handleCircleDrawEnd: function (evt) {
        var me = this;
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
     * @param {ol.Feature} feat
     */
    onCircleSelectCancel: function () {
        var me = this;
        me.removeLastDigitizeFeature();
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
     * Prepares the API request with the given features and calls the `doAjaxRequest` method.
     * If you need custom handling, just overwrite this method.
     * @param {array[ol.Feature]|ol.Feature} feat The feature or array of features
     *   that should be used in the request
     */
    prepareRequestParams: function (feat) {
        var me = this;
        var view = me.getView();
        var type = view.getType();
        var format = new ol.format.GeoJSON({
            dataProjection: me.map.getView().getProjection().getCode()
        });
        var searchParams;
        var jsonParams;
        if (type === 'Point') {
            var feats = me.resultLayer.getSource().getFeatures();
            if (Ext.isEmpty(feats)) {
                jsonParams = format.writeFeatures([]);
            } else {
                jsonParams = format.writeFeatures(feats.filter(function (f) {
                    // parse all features that are of type point and that
                    // have the property `group` set to the current active
                    // group index (which defaults to 0 if not set).
                    return f.getGeometry().getType() === 'Point' &&
                        f.get('group') === me.activeGroupIdx;
                }));
            }
            // The Netsolver endpoint expects bbox to be sent within a request.
            // The lower left and upper right coordinates cannot be the same so
            // we have to apply a small buffer on the point geometry to get a
            // small bbox around the clicked point.
            if (view.getPointExtentBuffer()) {
                var extent = feat.getGeometry().getExtent();
                var buffered = ol.extent.buffer(extent, view.getPointExtentBuffer());
                searchParams = 'bbox=' + encodeURIComponent(buffered.join(','));
            }
        }
        else if (view.getType() === 'LineString') {
            BasiGX.warn('Please implement your custom handler here for LineStrings');
        }
        else if (view.getType() === 'Polygon') {
            var geoJson = Ext.isArray(feat) ?
                format.writeFeature(feat[0]) :
                format.writeFeature(feat);
            jsonParams = {
                geometry3857: Ext.JSON.decode(geoJson).geometry
            };
        }
        else if (type === 'Circle') {
            // ol circle objects consist of a center coordinate and a radius in the
            // unit of the projection. In order to convert it into a geoJSON, we have
            // to convert the circle to a polygon first.
            var circleAsPolygon = new ol.geom.Polygon.fromCircle(feat.getGeometry());
            var polygonAsFeature = new ol.Feature({ geometry: circleAsPolygon });
            var polyGeoJson = format.writeFeature(polygonAsFeature);
            jsonParams = {
                geometry3857: Ext.JSON.decode(polyGeoJson).geometry
            };
        }
        me.doAjaxRequest(jsonParams, searchParams);
    },

    /**
     * Issues an Ext.Ajax.request against the configured endpoint with
     * the given params. Returned features will be added to the result
     * layer, and the drawn features will be removed. Additionally,
     * an event is fired with the response features to allow other
     * components to make use of them.
     * @param {object} jsonParams Object containing the params to send
     * @param {string} searchParams The serarchParams which will be
     *   appended to the request url
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

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            jsonData: jsonParams,
            callback: function () {
                mapComponent.setLoading(false);
            },
            success: me.handleApiResponse.bind(me),
            failure: function (response) {
                me.removeLastDigitizeFeature();

                var errorMessage = 'Error while requesting the API endpoint';

                if (response.responseText && response.responseText.message) {
                    errorMessage += ': ' + response.responseText.message;
                }

                BasiGX.error(errorMessage);
            }
        });
    },

    /**
     * Parses the response with the GeoJSON Format of OpenLayers.
     * Features will get set a new property `group` in order
     * to maintain their membership to the current selected group.
     * @param {string} response The response from the API. This method
     * expects features in GeoJSON format.
     */
    handleApiResponse: function (response) {
        var me = this;
        var view = me.getView();
        var format = new ol.format.GeoJSON();
        var json;

        if (!Ext.isEmpty(response.responseText)) {
            try {
                json = Ext.decode(response.responseText);
            } catch (e) {
                me.removeLastDigitizeFeature();

                BasiGX.error('Could not parse the response: ' +
                    response.responseText);
                return;
            }
            if (json.success && json.data && json.data.features) {
                var features = json.data.features;
                var olFeatsForActiveGroup = [];
                Ext.each(features, function (feat) {
                    // api will respond with non unique ids, which
                    // will collide with OpenLayers feature ids not
                    // being unique. Thats why we delete it here.
                    delete feat.id;
                    // set the current active group as property
                    feat.properties.group = me.activeGroupIdx;
                    olFeatsForActiveGroup.push(format.readFeature(feat));
                });
                // remove all features from the current active group
                var allFeatures = me.resultLayer.getSource().getFeatures();
                Ext.each(allFeatures, function (f) {
                    if (f.get('group') === me.activeGroupIdx) {
                        me.resultLayer.getSource().removeFeature(f);
                    }
                });
                // add the new features for the current active group
                me.resultLayer.getSource().addFeatures(olFeatsForActiveGroup);

                var drawSource = me.drawLayer.getSource();
                if (view.getClearDrawnFeature()) {
                    drawSource.clear();
                } else if (drawSource.getFeatures().length > 1) {
                    // keep the last drawn feature and remove the first (older) one
                    drawSource.removeFeature(drawSource.getFeatures()[0]);
                }
                // The response from the API, parsed as OpenLayers features, will be
                // fired here and the event can be used applicationwide to access
                // and handle the feature response.
                me.getView().fireEvent('responseFeatures', olFeatsForActiveGroup);
            } else {
                me.removeLastDigitizeFeature();

                BasiGX.error('Could not find features in the response: ' +
                    (json.message ? json.message : JSON.stringify(json)));
            }
        } else {
            BasiGX.error('Response was empty');
        }
    },

    /**
     * Removes the last drawn feature from the vector source (and from the map).
     */
    removeLastDigitizeFeature: function () {
        var me = this;
        var source = me.drawLayer.getSource();
        var features = source.getFeatures();

        if (features && features.length > 0) {
            var lastFeature = features[features.length - 1];
            source.removeFeature(lastFeature);
        }
    },

    /**
     * Remove the interaction when this component gets destroyed
     */
    onBeforeDestroy: function () {
        if (this.drawInteraction) {
            this.map.removeInteraction(this.drawInteraction);
        }
        if (this.modifyInteraction) {
            this.map.removeInteraction(this.modifyInteraction);
        }
        if (this.drawLayer) {
            this.map.removeLayer(this.drawLayer);
        }
        if (this.resultLayer) {
            this.map.removeLayer(this.resultLayer);
        }

        if (this.circleToolbar) {
            this.circleToolbar.destroy();
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
     * @param {*} response
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

        var selectStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'red'
                }),
                stroke: new ol.style.Stroke({
                    color: 'red'
                })
            }),
            width: 2,
            fill: new ol.style.Fill({
                color: 'red'
            }),
            stroke: new ol.style.Stroke({
                color: 'red'
            })
        });

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
