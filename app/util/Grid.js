/**
 * Static util class for Grid related operations.
 */
Ext.define('CpsiMapview.util.Grid', {

    statics: {
        /**
         * Gets the grid panel component for this layer if it exists.
         * Otherwise it will be created.
         *
         * @param {ol.layer.Base} layer The layer for which the grid shall be retrieved
         * @returns {CpsiMapview.view.grid.Grid} The grid panel component
         */
        getGridWindow: function (layer) {
            var staticMe = CpsiMapview.util.Grid;
            var gridWindow;
            var gridXType = layer.get('gridXType');
            if (!gridXType) {
                return;
            }

            // we can't keep a reference to the window in this class
            // as a new Ext.menu.Item is created each time the menu is
            // opened - use Ext.ComponentQuery instead
            var existingGrids = Ext.ComponentQuery.query(gridXType + '(true)');

            var gridWindowExists =
                existingGrids.length > 0 &&
                existingGrids[0] &&
                existingGrids[0].up('window');

            if (gridWindowExists) {
                // get the parent window of the grid
                gridWindow = existingGrids[0].up('window');
            } else {
                gridWindow = staticMe.createGridWindow(layer);
            }
            return gridWindow;
        },


        /**
         * Creates a grid window for the layer.
         *
         * @param {ol.layer.Base} layer The layer for which the grid shall be created
         * @returns {CpsiMapview.view.grid.Grid} The grid panel component
         */
        createGridWindow: function (layer) {
            var gridXType = layer.get('gridXType');

            // the Ext.window.Window configuration object
            var windowConfig = {
                minHeight: 600,
                constrain: true,
                layout: 'fit',
                maximizable: true,
                closeAction: 'hide' // don't destroy the window when closed
            };

            Ext.apply(windowConfig, {
                title: layer.get('name'),
                layout: 'fit',
                items: [{
                    xtype: gridXType,
                    // we need to create this store, otherwise Ext will
                    // create a default store that causes interference
                    // between layers with grid
                    // manually setting another store avoids problems like
                    // that setting filters to one layers are applied to
                    // another layer
                    store: Ext.create('Ext.data.Store')
                }],
                listeners: {
                    minimize: Ext.emptyFn,
                    close: function () {
                        // hide the spatial tool only when closed rather than when
                        // minimising the window
                        var me = this;
                        var queryButton = me.down('cmv_spatial_query_button');
                        if (queryButton !== null) {
                            queryButton.fireEvent('hideAssociatedPermanentLayer');
                            queryButton.toggle(false);
                        }
                        // hide the layer with the grid (to hide selections)
                        var grid = me.down('grid');
                        grid.fireEvent('hide');
                    },
                    show: function () {
                        var me = this;
                        var queryButton = me.down('cmv_spatial_query_button');
                        if (queryButton !== null) {
                            queryButton.fireEvent('showAssociatedPermanentLayer');
                        }

                        var grid = me.down('grid');
                        grid.fireEvent('show');
                    }
                }
            });
            var gridWindow = Ext.create('CpsiMapview.view.window.MinimizableWindow', windowConfig);

            // copy any ViewModel properties from the grid on to its containing window
            // this allows helpUrl to be set at the grid level
            var gridViewModelData = gridWindow.down(gridXType).getViewModel().getData();
            // use apply rather than applyIf otherwise the default empty helpUrl is not overwritten
            Ext.apply(gridWindow.getViewModel().getData(), gridViewModelData);
            return gridWindow;
        }
    }
});
