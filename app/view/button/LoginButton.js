/**
 * This class is a button to login
 *
 * @class CpsiMapview.view.button.LoginButton
 */
Ext.define('CpsiMapview.view.button.LoginButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_login_button',

    requires: [
        'CpsiMapview.controller.button.LoginButtonController',
        'CpsiMapview.model.button.LoginButton'
    ],

    /**
     * The controller for this class
     */
    controller: 'cmv_login_button',

    /**
     * The viewmodel for this class
     */
    viewModel: 'cmv_login_button',

    /**
     * The name to be used e.g. in ComponentQueries
     */
    name: 'loginButton',

    bind: {
        text: '{text}',
        glyph: '{glyph}',
        tooltip: '{tooltip}'
    },

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        click: 'onClick'
    }
});
