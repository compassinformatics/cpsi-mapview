/**
 * This class is the model for the cpsi mapview WFS
 * generic grid class
 *
 */
Ext.define('CpsiMapview.model.grid.Grid', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_grid',

    requires: ['BasiGX.util.Map'],

    /**
     * The following should all be overridden in child classes
     */
    data: {
        vectorLayerKey: null,
        wmsLayerKey: null,
        featureSelectionLayerKey: null, // used as the layer for selecting with the cmv_feature_selection_button
        gridStoreType: null,
        allowFeatureSelection: false,
        // when isSpatialGrid is set to false the 'Select by Shape' button will be hidden
        isSpatialGrid: true,
        usePresetFilters: false,
        clearFiltersVisible: true,
        exportExcelVisible: true,
        exportShapefileVisible: true,
        extraPropertyNames: []
    },

    formulas: {
        map: function () {
            return BasiGX.util.Map.getMapComponent().map;
        },
        isGroupEditingVisible: function () {
            // can be overridden in subclasses
            return false;
        },
        useSimpleSelection: function () {
            return (
                !this.get('allowFeatureSelection') && this.get('isSpatialGrid')
            );
        },
        useAdvancedSelection: function () {
            return (
                this.get('allowFeatureSelection') && this.get('isSpatialGrid')
            );
        }
    }
});
