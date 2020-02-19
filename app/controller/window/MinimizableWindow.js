/**
 * This class is the controller for the MinimizableWindow.
 */
Ext.define('CpsiMapview.controller.window.MinimizableWindow', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_minimizable_window',

    /**
     * Sets the window invisible and calls the addMinimizedWindow event
     * of the related MinimizedWindows toolbar.
     */
    onMinimize: function () {
        var me = this;
        var minimizeTo = me.getView().minimizeTo;
        if (minimizeTo == null) {
            var toolbars = Ext.ComponentQuery.query('cmv_minimized_windows');
            if (toolbars.length > 0) {
                minimizeTo = toolbars[0];
            } else {
                Ext.log({
                    msg: 'No cmv_minimized_windows found. Window might just disappear.',
                    level: 'warn'
                });
            }
        }
        me.getView().setVisible(false);
        minimizeTo.fireEvent('addMinimizedWindow', me.getView());
    }
});
