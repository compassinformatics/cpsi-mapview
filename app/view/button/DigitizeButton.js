/**
 * This class is the digitize button of cpsi mapview application
 * It can be used e.g. for the zone tool
 */
/**
 * Digitize Button
 *
 * @class CpsiMapview.view.button.DigitizeButton
 */
Ext.define('CpsiMapview.view.button.DigitizeButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_digitize_button',

    requires: [
        'CpsiMapview.model.button.DigitizeButtonModel',
        'CpsiMapview.controller.button.DigitizeButtonController'
    ],

    /**
     * The viewModel for this class
     */
    viewModel: 'cmv_digitize_button',

    /**
     * The controller for this class
     */
    controller: 'cmv_digitize_button',

    /**
     * The icon used for the button
     */
    glyph: 'xf040@FontAwesome',

    config: {
        /**
         * The type to draw. Can be Point, Polygon, LineString or Circle
         */
        type: 'Point',

        /**
         * Allow drawing of multi-geometries?
         */
        multi: false,

        /**
         * URL needs to be set on instanciation of button
         */
        apiUrl: null,

        /**
         * Should the tool use groups?
         */
        groups: false,

        /**
         * The default style to use for the result layer
         */
        resultLayerStyle: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'yellow'
                }),
                stroke: new ol.style.Stroke({
                    color: 'orange'
                })
            }),
            width: 4,
            fill: new ol.style.Fill({
                color: 'yellow'
            }),
            stroke: new ol.style.Stroke({
                color: 'orange'
            })
        }),

        /**
         * If set higher than 0 and type is set to `Point`,
         * the request URL gets appended with a `bbox`
         * parameter, which is calculated by the point and
         * this buffer in units of the maps projection.
         * Internally, this uses the `buffer` method of ol.extent
         */
        pointExtentBuffer: 0,

        /**
         * Set a layer to store the solver results
         * If not set a layer will be created and added to the map automatically
         */
        resultLayer: null,

        /**
         * Set a layer to store the features drawn by a user (points, polygons_
         * If not set a layer will be created and added to the map automatically
         */
        drawLayer: null,

        /**
        * Should the results and draw layers be reset if the
        * tool is deactivated?
        */
        resetOnToggle: true
    },

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'digitizeButton',

    /**
     * The name of the toggleGroup
     * Activates the toggle behaviour of the button
     */
    toggleGroup: 'digitize',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onToggle',
        beforedestroy: 'onBeforeDestroy'
    }
});
