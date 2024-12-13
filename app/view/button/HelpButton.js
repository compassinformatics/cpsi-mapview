/**
 * This class is a button to open the system help
 *
 * @class CpsiMapview.view.button.HelpButton
 */
Ext.define('CpsiMapview.view.button.HelpButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_help_button',

    requires: [
        'CpsiMapview.controller.button.HelpButtonController'
    ],

    tooltip: 'Open the Help System',

    /**
     * The icon the button should use
     */
    iconCls: 'x-fa fa-question-circle',

    /**
     * The controller for this class
     */
    controller: 'cmv_help_button',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'helpButton',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        click: 'onHelp'
    }
});
