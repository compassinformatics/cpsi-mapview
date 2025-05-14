/**
 * This class is a button to open a prompt allowing
 * permalinks to entered and zoomed to, without reloading the application
 *
 * @class CpsiMapview.view.button.PermalinkButton
 */
Ext.define('CpsiMapview.view.button.PermalinkButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_permalink_button',

    requires: ['CpsiMapview.controller.button.PermalinkButtonController'],

    tooltip: 'Zoom to a Permalink',

    /**
     * The icon the button should use
     */
    iconCls: 'x-fa fa-anchor',

    /**
     * The controller for this class
     */
    controller: 'cmv_permalink_button',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'permalinkButton',

    config: {
        /**
         * Width of the associated Ext.Msg.prompt dialog
         */
        dialogWidth: 400
    },
    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        click: 'onPermalinkClick'
    }
});
