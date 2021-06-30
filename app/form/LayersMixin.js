/**
 * A mixin to handle hiding and showing layers associated with an edit model
 *
 * @class CpsiMapview.form.LayersMixin
 */
Ext.define('CpsiMapview.form.LayersMixin', {
    extend: 'Ext.Mixin',

    requires: ['BasiGX.util.Map'],

    // hide/show the form layer with the form
    syncLayerWindowVisibility: false,

    // see https://docs.sencha.com/extjs/6.7.0/classic/Ext.Mixin.html

    mixinConfig: {
        after: {
            // the CpsiMapview.controller.window.MinimizableWindow
            // already has a onShow function so we add an additional
            // function with a different name or it is ignored
            // (as the mixin takes lower priority)
            onShow: 'onWindowShow',
            hide: 'onHide'
        }
    },

    toggleLayerVisibility: function (show) {

        var vm = this.getView().getViewModel();

        var layer = vm.get('resultLayer');

        if (layer) {
            layer.setVisible(show);
        }

        // if the form also has a polygon layer for selection
        // then hide this also
        var polygonLayer = vm.get('polygonLayer');

        if (polygonLayer) {
            polygonLayer.setVisible(show);
        }
    },

    onHide: function () {
        if (this.syncLayerWindowVisibility) {
            this.toggleLayerVisibility(false);
        }
    },

    onWindowShow: function () {
        if (this.syncLayerWindowVisibility) {
            this.toggleLayerVisibility(true);
        }
    },

    onEdgeSelectionChange: function (grid, selected) {

        var vm = this.getView().getViewModel();

        // reset all selections
        // setting the style to null defaults to using the layer style
        grid.store.each(function (rec) {
            rec.getFeature().setStyle(null);
        });

        var selectStyle = vm.get('selectStyle');

        if (selectStyle) {
            // highlight grid selection in map
            Ext.each(selected, function (rec) {
                rec.getFeature().setStyle(selectStyle);
            });
        }
    }
});