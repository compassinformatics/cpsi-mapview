/**
 * This class is a button to minimize all minimizable windows.
 *
 * @class CpsiMapview.view.button.MinimizeAllButton
 */
Ext.define('CpsiMapview.view.button.MinimizeAllButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_minimize_all_button',

    requires: [
        'CpsiMapview.controller.button.MinimizeAllButtonController'
    ],

    tooltip: 'Minimize all windows',

    /**
     * The icon the button should use
     */
    glyph: 'f2d1@FontAwesome',

    /**
     * The controller for this class
     */
    controller: 'cmv_minimize_all_button',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'minimizeAllButton',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        click: 'onClick'
    }
});
