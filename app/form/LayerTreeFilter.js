/**
 * This is the controller for the {@link CpsiMapview.view.form.LayerTreeFilter} component
 *
 * @class CpsiMapview.controller.form.LayerTreeFilter
 */
Ext.define('CpsiMapview.controller.form.LayerTreeFilter', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_layertreefilter',

    /**
     * Filters the tree by matching the layer's names with the input text.
     *
     * @param {Ext.form.field.Text} textField The textfield
     * @param {String} newVal The new value
     */
    onSearch: function (textField, newVal) {
        var me = this;
        var view = me.getView();

        // show/hide clear trigger button
        if (textField.getValue()) {
            textField.setHideTrigger(false);
        } else {
            textField.setHideTrigger(true);
        }

        var tree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (!tree){
            return;
        }
        var store = tree.getStore();
        if(!store){
            return;
        }

        // remove previous filter if exists
        store.removeFilter(view.TEXT_FILTER_ID);

        var textFilter = new Ext.util.Filter({
            id: view.TEXT_FILTER_ID,
            filterFn: function (node) {
                // always show group layers
                if (node.hasChildNodes()) {
                    return true;
                }
                // check if baselayers should be filtered
                if (!view.getDoFilterBaseLayers() && node.getOlLayerProp('isBaseLayer')){
                    return true;
                }
                // enforce case insensitive matches
                var name = node.getOlLayerProp('name');
                if (!name) {
                    return;
                }
                var text = name.toLowerCase();
                var compare = newVal.toLowerCase();
                return text.includes(compare);
            }
        });
        store.addFilter(textFilter);
    },

    /**
     * Filters the tree by checking the visibility of the layers.
     *
     * @param {Ext.form.field.Field} checkBox The checkbox
     * @param {Boolean} showOnlyVisible If only visible layers should be shown in the tree
     */
    filterVisibleLayers: function (checkBox, showOnlyVisible) {
        var me = this;
        var view = me.getView();

        var tree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (!tree) {
            return;
        }
        var store = tree.getStore();
        if (!store) {
            return;
        }
        if (showOnlyVisible) {
            var visibleLayerFilter = new Ext.util.Filter({
                id: view.VISIBLE_LAYER_FILTER_ID,
                filterFn: function (node) {
                    if (node.hasChildNodes()) {
                        return true;
                    }
                    // check if baselayers should be filtered
                    if (!view.getDoFilterBaseLayers() && node.getOlLayerProp('isBaseLayer')){
                        return true;
                    }
                    var checked = node.get('checked');
                    return checked;
                }
            });

            store.addFilter(visibleLayerFilter);
        } else {
            store.removeFilter(view.VISIBLE_LAYER_FILTER_ID);
        }
    }
});
