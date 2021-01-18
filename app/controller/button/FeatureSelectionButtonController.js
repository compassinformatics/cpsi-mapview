/**
* This class is the controller for the button 'FeatureSelectionButton'
 */
Ext.define('CpsiMapview.controller.button.FeatureSelectionButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_feature_selection_btn',

    requires: ['Ext.window.Toast'],

    /**
    * The OpenLayers map. If not given, will be auto-detected.
    * @cfg
    */
    map: null,

    /**
     * The selector UI for the #filterMode. Created in #onBtnToggle.
     * @property
     * @readonly
     */
    modeSelector: null,

    /**
     * The filter mode (set by the user via #modeSelector UI).
     * @property
     * @readonly
     */
    filterMode: 'ADD_TO_SELECTION', // ADD_TO_SELECTION or NEW_SELECTION

    /**
     * The feature IDs (FIDs) used for filtering.
     * @property
     * @readonly
     */
    fidsToFilter: [],


    init: function () {
        var me = this;
        var ownerGrid = this.getView().up('grid');
        if (ownerGrid) {
            // reset FIDs if grid clears its filters
            ownerGrid.on('cmv-clear-filters', function() {
                me.fidsToFilter = [];
            });
        }
    },

    /**
     * Activates this tool.
     * Adds a click handler to the map and tries to detect the IDs of the
     * clicked features. Builds a filter object for the ("where ID IN(1,2,3))
     * and forwards it to the grid so it gets applied to the underlying WFS.
     *
     * @param {Ext.button.Button} btn The toggled button.
     * @param {Boolean} pressed The toggle state.
     */
    onBtnToggle: function (btn, pressed) {
        var me = this;
        var view = me.getView();

        if (view.map && view.map instanceof ol.Map) {
            me.map = view.map;
        } else {
            // guess map as fallback
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        if (!view.queryLayer) {
            me.findWfsLayer();
        }

        if (pressed) {
            // create and show selector UI
            me.addModeSelectorUi();
            me.map.on('click', me.onMapClick, me);
        } else {
            me.modeSelector.hide();
            me.map.un('click', me.onMapClick, me);
        }

    },

    /**
     * Adds the mode selector UI to the toolbar (if not existing) and shows it.
     */
    addModeSelectorUi: function () {
        var me = this;

        if (!me.modeSelector) {
            me.modeSelector = Ext.create('Ext.button.Split', {
                viewModel: me.getViewModel(),
                bind: {
                    text: '{addToSelectionLabel}'
                },
                hidden: true,
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            bind: {
                                text: '{addToSelectionLabel}'
                            },
                            handler: function (menu) {
                                me.filterMode = 'ADD_TO_SELECTION';
                                me.modeSelector.setText(menu.text);
                            }
                        },
                        {
                            bind: {
                                text: '{newSelectionLabel}'
                            },
                            handler: function (menu) {
                                me.filterMode = 'NEW_SELECTION';
                                me.modeSelector.setText(menu.text);
                            }
                        },
                    ]
                })
            });

            var tb = me.getView().up('toolbar');
            var segBtn = me.getView().up('segmentedbutton');
            if (tb && segBtn) {
                var segBtnPos = tb.items.indexOf(segBtn);
                var afterSegBtnPos = segBtnPos + 1;
                tb.insert(afterSegBtnPos, me.modeSelector);
            }
        }

        me.modeSelector.show();
    },

    /**
     * Function to determine the WFS layer to connect the click handler if not
     * yet defined.
     */
    findWfsLayer: function () {
        var me = this;
        var view = me.getView();

        if (!view.queryLayer && view.vectorLayerKey) {
            view.queryLayer = BasiGX.util.Layer.getLayerBy(
                'layerKey', view.vectorLayerKey
            );
        }

        if (!view.queryLayer) {
            Ext.Logger.warn('No queryLayer found in the map for the FeaureSelectionButton with the name: ' + view.queryLayerName);
        } else {
            // save the ID property name for future use
            me.idProperty = view.queryLayer.get('idProperty');
        }

    },

    /**
     * Handles map click for selection of features.
     *
     * @param {ol.MapBrowserEvent} evt The OL event
     */
    onMapClick: function (evt) {
        var me = this;
        var view = me.getView();

        // clear FIDs to filter when we have a new selection
        if (me.filterMode === 'NEW_SELECTION') {
            me.fidsToFilter = [];
        }

        // collect all IDs of clicked features
        var clickedFeatureIds = [];
        me.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            // add check for correct layer
            if (layer && view.queryLayer && (layer.id === view.queryLayer.id)) {

                var source = view.queryLayer.getSource();
                if (source instanceof ol.source.Cluster) {
                    var origFeats = feature.get('features');
                    if (Ext.isArray(origFeats)) {
                        // add all sub-feature due to clustering
                        Ext.each(origFeats, function (origFeat) {
                            me.fidsToFilter.push(origFeat.get(me.idProperty));
                            clickedFeatureIds.push(origFeat.get(me.idProperty));
                        });
                    }
                } else {
                    // "normal" layers without clustering
                    me.fidsToFilter.push(feature.get(me.idProperty));
                    clickedFeatureIds.push(feature.get(me.idProperty));
                }
            }
        });

        // inform that no feature was hit on the map
        if (clickedFeatureIds.length === 0) {
            if (view.showNoSelectionMessage) {
                Ext.toast('No feature(s) at clicked position.', null, 'br');
            }

            view.fireEvent('cmv-no-feature-selected', view);
            return;
        }

        // create ExtJS "IN" filter with unique values
        var uniqueFids = Ext.Array.unique(me.fidsToFilter);
        var extInFilter = new Ext.util.Filter({
            property: me.idProperty,
            value   : uniqueFids,
            operator: 'in'
        });

        if (me.filterMode === 'NEW_SELECTION') {
            // removes all filters from grid without reloading WFS store
            view.fireEvent('cmv-reset-grid-filters');
        }
        // sets the ID filter in the grid
        view.fireEvent('cmv-id-filter-set', extInFilter);
    },

    onBeforeDestroy: function () {
        var me = this;
        var btn = me.getView();

        // detoggle button
        me.onBtnToggle(btn, false);
    }

});
