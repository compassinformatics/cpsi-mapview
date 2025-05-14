/**
 * This class is the controller for the ParallelLine.
 */
Ext.define('CpsiMapview.controller.window.ParallelLineWindow', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_parallel_line_window',

    requires: ['BasiGX.view.component.Map'],

    selectInteraction: null,

    layer: null,

    onSelectFeatureToggle: function (btn, toggled) {
        const me = this;
        const view = me.getView();
        const vm = view.getViewModel();
        const map = BasiGX.view.component.Map.guess().getMap();
        if (toggled) {
            const interactionConfig = view.interactionConfig
                ? view.interactionConfig
                : {};
            this.selectInteraction = new ol.interaction.Select(
                interactionConfig
            );
            this.selectInteraction.on('select', function (evt) {
                const selectedFeature = evt.selected[0];
                vm.set('selectedFeature', selectedFeature);
            });
            map.addInteraction(this.selectInteraction);
        } else {
            if (!this.selectInteraction) {
                return;
            }
            map.removeInteraction(this.selectInteraction);
            this.selectInteraction = null;
        }
    },

    onParallelLineCreated: function (newLineFeature) {
        if (this.layer === null) {
            this.layer = new ol.layer.Vector();
            const map = BasiGX.view.component.Map.guess().getMap();
            if (map) {
                map.addLayer(this.layer);
            }
        }
        const source = new ol.source.Vector({
            features: [newLineFeature]
        });
        this.layer.setSource(source);
    },

    onBeforeDestroy: function () {
        // remove select interaction
        this.onSelectFeatureToggle(null, false);
    }
});
