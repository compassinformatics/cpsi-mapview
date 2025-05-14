/**
 * This class is the controller for the MinimizableWindow.
 */
Ext.define('CpsiMapview.controller.window.MinimizableWindow', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimizable_window',

    mixins: ['CpsiMapview.form.HelpMixin'],

    /**
     * Trigger the windowClosed to remove any associated toolbar
     * button if the window is closed
     */
    onClose: function () {
        const me = this;
        const minimizeTo = me.getMinimizeToolbar();
        if (minimizeTo) {
            minimizeTo.fireEvent('windowClosed', me.getView());
        }
    },

    /**
     * Placeholder function for adding in a hook when the window is hidden
     */
    onHide: Ext.emptyFn,

    /**
     * Sets the window invisible and calls the addMinimizedWindow event
     * of the related MinimizedWindows toolbar.
     */
    onMinimize: function () {
        const me = this;
        const minimizeTo = me.getMinimizeToolbar();
        if (minimizeTo == null) {
            Ext.log({
                msg: 'No cmv_minimized_windows_toolbar found. Window might just disappear.',
                level: 'warn'
            });
        }

        const win = me.getView();
        win.isMinimized = true;
        win.setVisible(false);
        if (minimizeTo) {
            minimizeTo.fireEvent('addMinimizedWindow', win);
        }
    },

    /**
     * Helper function to get the right MinimizedWindows toolbar.
     * If defined, returns me.getView().minimizeTo, else checks for
     * any MinimizedWindows toolbar and returns first match. If no
     * toolbar found, returns undefined
     */
    getMinimizeToolbar: function () {
        const me = this;
        let minimizeTo = me.getView().minimizeTo;
        if (minimizeTo == null) {
            const toolbars = Ext.ComponentQuery.query(
                'cmv_minimized_windows_toolbar'
            );
            if (toolbars.length > 0) {
                minimizeTo = toolbars[0];
            }
        }
        return minimizeTo;
    },

    /**
     * Fires the restoreFromWindow event if window is currently minimized
     */
    onShow: function () {
        const me = this;
        if (me.getView().isMinimized) {
            const minimizeTo = me.getMinimizeToolbar();
            if (minimizeTo) {
                minimizeTo.fireEvent('restoreFromWindow', me.getView());
            }
        }
    }
});
