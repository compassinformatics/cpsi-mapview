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

    /**
     * Changes the visibility of any of the layers associated
     * with the form (layers are defined in the viewmodel)
     * @param {boolean} show
     */
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

    /**
     * Hides the layers associated with the form when the
     * form is hidden
     * */
    onHide: function () {
        if (this.syncLayerWindowVisibility) {
            this.toggleLayerVisibility(false);
        }
    },

    /**
     * Shows the layers associated with the form when the
     * form is hidden
     * */
    onWindowShow: function () {
        if (this.syncLayerWindowVisibility) {
            this.toggleLayerVisibility(true);
        }
    }
});