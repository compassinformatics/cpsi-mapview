/**
 * This class is the controller for the button 'FeatureSelectionButton'
 */
Ext.define('CpsiMapview.controller.button.FeatureSelectionButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_feature_selection_btn',

    requires: ['Ext.window.Toast', 'BasiGX.util.Layer'],

    /**
     * The OpenLayers map. If not given, will be auto-detected.
     * @cfg
     */
    map: null,

    /**
     * The selector UI for the #filterMode. Created in #onBtnToggle.
     * @property {String}
     * @readonly
     */
    modeSelector: null,

    /**
     * The filter mode (set by the user via #modeSelector UI).
     * @property {String}
     * @readonly
     */
    filterMode: 'ADD_TO_SELECTION', // ADD_TO_SELECTION or NEW_SELECTION

    /**
     * The feature IDs (FIDs) used for filtering.
     * @property {Array}
     * @readonly
     */
    fidsToFilter: [],

    constructor: function () {
        const me = this;
        me.onMapClick = me.onMapClick.bind(me);
        me.callParent(arguments);
    },

    init: function () {
        const me = this;
        const ownerGrid = this.getView().up('grid');
        if (ownerGrid) {
            // reset FIDs if grid clears its filters
            ownerGrid.on('cmv-clear-filters', function () {
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
        const me = this;
        const view = me.getView();

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
            view.queryLayer.setVisible(true);
            me.map.on('click', me.onMapClick);
        } else {
            me.modeSelector.hide();
            view.queryLayer.setVisible(false);
            me.map.un('click', me.onMapClick);
        }
    },

    /**
     * Adds the mode selector UI to the toolbar (if not existing) and shows it.
     */
    addModeSelectorUi: function () {
        const me = this;

        if (!me.modeSelector) {
            me.modeSelector = Ext.create('Ext.button.Split', {
                viewModel: me.getViewModel(),
                bind: {
                    text: '{addToSelectionLabel}'
                },
                hidden: false,
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
                        }
                    ]
                })
            });

            const tb = me.getView().up('toolbar');
            const btnGroup = me.getView().up('buttongroup');
            if (tb && btnGroup) {
                btnGroup.add(me.modeSelector);
            }
        }

        me.modeSelector.show();
    },

    /**
     * Function to determine the WFS layer to connect the click handler if not
     * yet defined.
     */
    findWfsLayer: function () {
        const me = this;
        const view = me.getView();
        if (!view.queryLayer && view.vectorLayerKey) {
            view.queryLayer = BasiGX.util.Layer.getLayerBy(
                'layerKey',
                view.vectorLayerKey
            );
        }

        if (!view.queryLayer) {
            Ext.Logger.warn(
                'No queryLayer found in the map for the FeaureSelectionButton with the name: ' +
                    view.queryLayerName
            );
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
        const me = this;
        const view = me.getView();

        // clear FIDs to filter when we have a new selection
        if (me.filterMode === 'NEW_SELECTION') {
            me.fidsToFilter = [];
        }

        // collect all IDs of clicked features
        const clickedFeatureIds = [];
        me.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            // add check for correct layer
            if (layer && view.queryLayer && layer.id === view.queryLayer.id) {
                const source = view.queryLayer.getSource();
                if (source instanceof ol.source.Cluster) {
                    const origFeats = feature.get('features');
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
        const uniqueFids = Ext.Array.unique(me.fidsToFilter);
        const extInFilter = new Ext.util.Filter({
            type: 'fid',
            property: me.idProperty,
            value: uniqueFids,
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
        const me = this;
        const btn = me.getView();

        // detoggle button
        me.onBtnToggle(btn, false);
    }
});
