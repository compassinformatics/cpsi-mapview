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
    filterMode: 'ADD', // ADD or NEW

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
            me.findQueryLayer();
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
                text: 'Add to selection',
                hidden: true,
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: 'Add to selection',
                            handler: function (menu) {
                                me.filterMode = 'ADD';
                                me.modeSelector.setText(menu.text);
                            }
                        },
                        {
                            text: 'New selection',
                            handler: function (menu) {
                                me.filterMode = 'NEW';
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
     * Function to determine the query layer if not yet defined in class
     */
    findQueryLayer: function () {
        //TODO move to common sub-class
        var me = this;
        var view = me.getView();
        if (!view.queryLayer && view.queryLayerName) {
            view.queryLayer = BasiGX.util.Layer.
                getLayerByName(view.queryLayerName);
        }

        if (!view.queryLayer) {
            Ext.Logger.warn('No queryLayer found in the map for the FeaureSelectionButton with the name: ' + view.queryLayerName);
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
        if (me.filterMode === 'NEW') {
            me.fidsToFilter = [];
        }

        // collect all IDs of clicked features
        me.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
            // add check for correct layer
            if (layer.id === view.queryLayer.id) {

                var source = view.queryLayer.getSource();
                if (source instanceof ol.source.Cluster) {
                    var origFeats = feature.get('features');
                    if (Ext.isArray(origFeats)) {
                        // add all sub-feature due to clustering
                        Ext.each(origFeats, function (origFeat) {
                            //TODO read out ID field
                            me.fidsToFilter.push(origFeat.get('osm_id'));
                        });
                    }
                } else {
                    //TODO read out ID field
                    me.fidsToFilter.push(feature.get('osm_id'));
                }
            }
        });

        var uniqueFids = Ext.Array.unique(me.fidsToFilter);
        if (uniqueFids.length === 0) {
            //TODO inform user or clear filters (mode = "NEW")
            return;
        }

        var extInFilter = new Ext.util.Filter({
            //TODO read out ID field
            property: 'osm_id',
            value   : uniqueFids,
            operator: 'in'
        });

        if (me.filterMode === 'NEW') {
            // removes all filters from grid without reloading WFS store
            view.fireEvent('cmv-reset-grid-filters');
        }
        // sets the ID filter in the grid
        view.fireEvent('cmv-id-filter-set', extInFilter);
    }

});
