/**
 * This class is the controller for the MinimizableWindow.
 */
Ext.define('CpsiMapview.controller.window.MinimizableWindow', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimizable_window',

    /**
     * Create a hook for derived classes to add additional onClose
     * functionality
     */
    onClose: Ext.emptyFn,

    /**
     * Sets the window invisible and calls the addMinimizedWindow event
     * of the related MinimizedWindows toolbar.
     */
    onMinimize: function () {
        var me = this;
        var minimizeTo = me.getMinimizeToolbar();
        if (minimizeTo == null) {
            Ext.log({
                msg: 'No cmv_minimized_windows_toolbar found. Window might just disappear.',
                level: 'warn'
            });
        }
        me.getView().setVisible(false);
        if (minimizeTo) {
            minimizeTo.fireEvent('addMinimizedWindow', me.getView());
        }
        me.getView().isMinimized = true;
    },

    /**
     * Helper function to get the right MinimizedWindows toolbar.
     * If defined, returns me.getView().minimizeTo, else checks for
     * any MinimizedWindows toolbar and returns first match. If no
     * toolbar found, returns undefined
     */
    getMinimizeToolbar: function () {
        var me = this;
        var minimizeTo = me.getView().minimizeTo;
        if (minimizeTo == null) {
            var toolbars = Ext.ComponentQuery.query('cmv_minimized_windows_toolbar');
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
        var me = this;
        if (me.getView().isMinimized) {
            var minimizeTo = me.getMinimizeToolbar();
            if (minimizeTo) {
                minimizeTo.fireEvent('restoreFromWindow', me.getView());
            }
        }
    },

    /**
     * Opens any associated helpUrl in a new browser tab
     * If the URL does not start with 'http' then an application
     * rootHelpUrl is appended to the URL if present
     * */
    onHelp: function () {

        var me = this;
        var url = me.getViewModel().get('helpUrl');
        var rootUrl = Ext.getApplication().rootHelpUrl;

        if (rootUrl && (Ext.String.startsWith(url, 'http') === false)){
            url = rootUrl + url;
        }

        var win = window.open(url, 'mapview-help'); // use '_blank' if we want a new window each time

        if (!win) {
            Ext.Msg.alert('Pop-up Blocked', 'The help page was blocked from opening. Please allow pop-ups for this site.');
        } else {
            win.focus();
        }
    }
});
