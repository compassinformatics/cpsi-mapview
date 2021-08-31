/**
 * This class is the controller for the {@link CpsiMapview.view.button.HelpButton} button.
 */
Ext.define('CpsiMapview.controller.button.HelpButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_help_button',

    mixins: ['CpsiMapview.form.HelpMixin']
});
