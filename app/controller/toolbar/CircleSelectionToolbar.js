/**
 * This class is the controller for the CircleSelectionToolbar.
 */
Ext.define('CpsiMapview.controller.toolbar.CircleSelectionToolbar', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_circle_selection_toolbar',

    /**
     * Handles the click on the `Apply` button by firing
     * the `circleSelectApply` event of the button that created
     * the toolbar
     */
    handleApply: function () {
        var me = this;
        var feat = me.getView().feature;
        me.fireEvent('circleSelectApply', feat);
    },

    /**
     * Handles the click on the `Cancel` button by firing
     * the `circleSelectCancel` event of the button that created
     * the toolbar
     */
    handleCancel: function () {
        var me = this;
        me.fireEvent('circleSelectCancel');
    },

    /**
     * Gets the radius of the ol circle feature.
     */
    getCurrentRadius: function () {
        var me = this;
        var feat = me.getView().feature;
        var radius;
        if (feat != null) {
            var geom = feat.getGeometry();
            if (geom !== undefined) {
                // geom.getRadius actually is the diameter
                // therefore we have to divide by 2
                radius = geom.getRadius() / 2;
            }
        }
        return radius;
    },

    /**
     * Handles changes in the numberField by applying the value
     * as radius for the ol circle feature
     * @param {Ext.form.field.Number} numberField component that fired the event
     * @param {float} newVal new value of the numberField
     */
    onRadiusChange: function (numberField, newVal) {
        var me = this;
        var feat = me.getView().feature;
        if (feat != null) {
            var geom = me.getView().feature.getGeometry();
            if (geom !== undefined) {
                // geom.setRadius actually is the diameter
                // therefore we have to multiply by 2
                geom.setRadius(newVal * 2);
            }
        }
    },

    /**
     * Sets the unit to the unit of the current projection
     */
    setCurrentUnit: function () {
        var me = this;
        var map = BasiGX.util.Map.getMapComponent().map;
        var unit = map.getView().getProjection().getUnits();
        me.getViewModel().set('unit', unit);
    },

    /**
     * Sets the initial value for the `radius` data field in the ViewModel
     * to the current radius of the ol circle feature
     */
    init: function () {
        var me = this;
        // geom.setRadius actually is the diameter
        // therefore we have to multiply by 2
        var radius = me.getCurrentRadius() * 2;
        me.getViewModel().set('radius', radius);
        me.setCurrentUnit();
    }

});
