/**
 * This class is the controller for the MinimizedWindows.
 */
Ext.define('CpsiMapview.controller.toolbar.MinimizedWindows', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimized_windows',

    /**
     * Handles the toolbar related actions when minimizing a window
     * @param {CpsiMapview.view.window.MinimizableWindow} minimizedWindow window to add
     */
    onAddMinimizedWindow: function (minimizedWindow) {
        var me = this;
        me.addButtonForWindow(minimizedWindow);
        me.getView().setHidden(false);
    },

    /**
     * Adds a button to the toolbar that represents a minimized window
     * @param {CpsiMapview.view.window.MinimizableWindow} minimizedWindow window to represent
     */
    addButtonForWindow: function (minimizedWindow) {
        var me = this;
        var windowId = minimizedWindow.getId();
        var windowTitle = minimizedWindow.getTitle();

        var button = Ext.create('Ext.button.Button', {
            text: windowTitle != null ? windowTitle : windowId,
            windowRef: windowId,
            listeners: {
                click: 'onRestoreWindow',
                scope: me
            }
        });
        me.getView().add(button);
    },

    /**
     * Handles all actions to restore a minimized window
     * @param {Ext.button.Button} button that represents window to restore
     */
    onRestoreWindow: function (button) {
        var me = this;
        var buttonId = button.windowRef;

        var minimizedWindow = Ext.ComponentQuery.query('#' + buttonId)[0];
        minimizedWindow.setVisible(true);
        me.getView().remove(button);
        if (me.getView().items.length == 0) {
            me.getView().setHidden(true);
        }
    }

});
