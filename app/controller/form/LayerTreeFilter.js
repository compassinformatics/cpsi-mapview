/**
 * This is the controller for the {@link CpsiMapview.view.form.LayerTreeFilter} component
 *
 * @class CpsiMapview.controller.form.LayerTreeFilter
 */
Ext.define('CpsiMapview.controller.form.LayerTreeFilter', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_layertreefilter',

    requires: ['CpsiMapview.util.LayerTreeFilter'],

    /**
     * Clears the textfield for filtering the layer tree.
     *
     * @param {Ext.form.field.Text } textField
     */
    clearText: function (textField) {
        const me = this;
        const view = me.getView();

        textField.setValue('');

        const tree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (!tree) {
            return;
        }
        const store = tree.getStore();
        if (!store) {
            return;
        }

        // remove previous filter if exists
        store.removeFilter(view.TEXT_FILTER_ID);
    },

    /**
     * Updates the filter with the latest input values.
     *
     * @return {void}
     */
    updateFilter: function () {
        const me = this;
        const view = me.getView();
        const vm = view.getViewModel();
        const LayerTreeFilterUtil = CpsiMapview.util.LayerTreeFilter;

        const tree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (!tree) {
            return;
        }
        const store = tree.getStore();
        if (!store) {
            return;
        }

        store.removeFilter(view.FILTER_ID);
        const filter = LayerTreeFilterUtil.createLayerTreeFilter(
            view.FILTER_ID,
            vm.get('hideInvisibleLayers'),
            vm.get('searchText'),
            view.getDoFilterBaseLayers()
        );
        store.addFilter(filter);
    },

    /**
     * Handler for the input field change event.
     *
     * @param {Ext.form.field.Text} textfield The textfield.
     * @param {string} searchText The search text.
     * @return  {void}
     */
    onSearchTextChange: function (textfield, searchText) {
        const treeFilter = textfield.up('cmv_layertreefilter');
        const vm = treeFilter.getViewModel();
        const ctrl = treeFilter.getController();
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
    onCheckboxChange: function (cb, checked) {
        const treeFilter = cb.up('cmv_layertreefilter');
        const vm = treeFilter.getViewModel();
        const ctrl = treeFilter.getController();
        if (!vm || !ctrl) {
            return;
        }
        vm.set('hideInvisibleLayers', checked);
        ctrl.updateFilter();
    }
});
