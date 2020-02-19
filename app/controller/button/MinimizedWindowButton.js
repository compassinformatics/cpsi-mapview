/**
 * This class is the controller for the MinimizedWindowButton.
 */
Ext.define('CpsiMapview.controller.button.MinimizedWindowButton', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimized_window_button',

    /**
     * Handles the actions after clicking the button by finding
     * the parent MinimizedWindows toolbar and firing its
     * restoreWindow event.
     */
    onClick: function () {
        var me = this;
        var toolbar = me.getView().up('cmv_minimized_windows');
        toolbar.fireEvent('restoreWindow', me.getView());
    }
});
