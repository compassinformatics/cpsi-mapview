/**
 * This class is the controller for the MinimizedWindows.
 */
Ext.define('CpsiMapview.controller.toolbar.MinimizedWindows', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimized_windows_toolbar',

    /**
     * Handles the toolbar related actions when minimizing a window
     * @param {CpsiMapview.view.window.MinimizableWindow} minimizedWindow window to add
     */
    onAddMinimizedWindow: function (minimizedWindow) {
        const me = this;
        me.addButtonForWindow(minimizedWindow);
        me.getView().setHidden(false);
    },

    /**
     * Adds a button to the toolbar that represents a minimized window
     * @param {CpsiMapview.view.window.MinimizableWindow} minimizedWindow window to represent
     */
    addButtonForWindow: function (minimizedWindow) {
        const me = this;
        const windowId = minimizedWindow.getId();
        const windowTitle = minimizedWindow.getTitle();

        const button = Ext.create('Ext.button.Button', {
            text: windowTitle != null ? windowTitle : windowId,
            windowRef: windowId,
            listeners: {
                click: 'onRestoreFromButton',
                scope: me
            }
        });
        me.getView().add(button);
    },

    /**
     * Handles restoring a minimized window using the toolbar button object
     * @param {Ext.button.Button} minimizedWindow
     */
    onRestoreFromButton: function (button) {
        const me = this;
        const windowRef = button.windowRef;
        me.restoreWindow(windowRef);
    },

    /**
     * Handles restoring a minimized window using the window object
     * @param {CpsiMapview.view.window.MinimizableWindow} minimizedWindow
     */
    onRestoreFromWindow: function (minimizedWindow) {
        const me = this;
        const windowId = minimizedWindow.getId();
        me.restoreWindow(windowId);
    },

    /**
     * Handles all actions to restore a minimized window
     * @param {String} windowRef reference to the minimized window
     */
    restoreWindow: function (windowRef) {
        const me = this;
        const minimizedWindow = Ext.ComponentQuery.query('#' + windowRef)[0];
        minimizedWindow.setVisible(true);
        minimizedWindow.isMinimized = false;

        me.removeButtonFromToolbar(windowRef);
    },

    removeButtonFromToolbar: function (windowRef) {
        const me = this;

        const button = me.getView().items.findBy(function (item) {
            return item.getXType() === 'button' && item.windowRef === windowRef;
        });

        if (button !== undefined) {
            me.getView().remove(button);
        }

        if (me.getView().items.length == 0) {
            me.getView().setHidden(true);
        }
    }
});
