/**
 * This class is the split by click button of cpsi mapview application
 * It can be used e.g. for the public/private splits tool
 */
/**
 * SplitByClick Button
 *
 * @class CpsiMapview.view.button.SplitByClickButton
 */
Ext.define('CpsiMapview.view.button.SplitByClickButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_split_by_click_button',

    requires: [
        'CpsiMapview.model.button.SplitByClickButtonModel',
        'CpsiMapview.controller.button.SplitByClickButtonController'
    ],

    /**
     * The viewModel for this class
     */
    viewModel: 'cmv_split_by_click_button',

    /**
     * The controller for this class
     */
    controller: 'cmv_split_by_click_button',

    /**
     * The icon (scissors) used for the button
     */
    glyph: 'xf0c4@FontAwesome',

    config: {

        /**
         * URL needs to be set on instantiation of button
         */
        apiUrl: null,

        /**
         * If set higher than 0 the request URL gets appended with a `bbox`
         * parameter, which is calculated by the point and
         * this buffer in units of the maps projection.
         * Internally, this uses the `buffer` method of ol.extent
         */
        pointExtentBuffer: 50,

        /**
         * Set a layer to store the split results
         * If not set a layer will be created and added to the map automatically
         */
        resultLayer: null
    },

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'splitByClickButton',

    /**
     * The name of the toggleGroup
     * Activates the toggle behaviour of the button
     */
    toggleGroup: 'map',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onToggle',
        beforedestroy: 'onBeforeDestroy'
    }
});
