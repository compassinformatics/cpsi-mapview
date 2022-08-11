/**
 * This is the controller for the {@link CpsiMapview.view.form.LayerTreeFilter} component
 *
 * @class CpsiMapview.controller.form.LayerTreeFilter
 */
Ext.define('CpsiMapview.controller.form.LayerTreeFilter', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_layertreefilter',

    requires: [
        'CpsiMapview.util.LayerTreeFilter'
    ],

    /**
     * Updates the filter with the latest input values.
     *
     * @return {void}
     */
    updateFilter: function() {
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var LayerTreeFilterUtil = CpsiMapview.util.LayerTreeFilter;
        var filterBaseLayers = view.getDoFilterBaseLayers();

        var tree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (!tree) {
            return;
        }
        var store = tree.getStore();
        if (!store) {
            return;
        }

        store.removeFilter(view.FILTER_ID);
        var filter = Ext.util.Filter({
            id: view.FILTER_ID,
            filterFn: function(node) {
                var isLeaf = !node.hasChildNodes();
                if (isLeaf) {
                    if (vm.get('hideInvisibleLayers')) {
                        var isVisible = LayerTreeFilterUtil.isLayerVisible(node, filterBaseLayers);
                        if (!isVisible) {
                            return false;
                        }
                    }
                    if (vm.get('searchText')) {
                        var isMatch = LayerTreeFilterUtil.isSearchTextInLayerName(node, vm.get('searchText'), filterBaseLayers);
                        if (!isMatch) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }
        });
        store.addFilter(filter);
    },

    /**
     * Handler for the input field change event.
     *
     * @param {Ext.form.field.Text} textfield The textfield.
     * @param {string} searchText The search text.
     * @return  {void}
     */
    onSearchTextChange: function(textfield, searchText) {
        var treeFilter = textfield.up('cmv_layertreefilter');
        var vm = treeFilter.getViewModel();
        var ctrl = treeFilter.getController();
        if (!vm || !ctrl) {
            return;
        }
        vm.set('searchText', searchText);
        ctrl.updateFilter();
    },

    /**
     * Handler for the checkbox change event.
     *
     * @param {Ext.form.field.Checkbox} cb The checkbox.
     * @param {boolean} checked True, if checked. False otherwise.
     * @return {void}
     */
    onCheckboxChange: function(cb, checked) {
        var treeFilter = cb.up('cmv_layertreefilter');
        var vm = treeFilter.getViewModel();
        var ctrl = treeFilter.getController();
        if (!vm || !ctrl) {
            return;
        }
        vm.set('hideInvisibleLayers', checked);
        ctrl.updateFilter();
    }
});
