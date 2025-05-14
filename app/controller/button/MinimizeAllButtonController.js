/**
 * This class is the controller for the button 'MinimizeAllButton'.
 */
Ext.define('CpsiMapview.controller.button.MinimizeAllButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimize_all_button',

    onClick: function () {
        const windows = Ext.ComponentQuery.query('cmv_minimizable_window');
        Ext.Array.forEach(windows, function (win) {
            if (win.isVisible()) {
                win.minimize();
            }
        });
    }
});
