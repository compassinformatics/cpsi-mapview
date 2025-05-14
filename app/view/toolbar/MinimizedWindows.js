/**
 * This class is the toolbar of cpsi mapview application that contains
 * minimized windows. After a window was resized, the toolbar will be visible.
 * If a window was minimized without adding this toolbar in advance, the window
 * will minimize into nowhere.
 *
 * @class CpsiMapview.view.toolbar.MinimizedWindows
 */
Ext.define('CpsiMapview.view.toolbar.MinimizedWindows', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_minimized_windows_toolbar',

    requires: ['CpsiMapview.controller.toolbar.MinimizedWindows'],

    controller: 'cmv_minimized_windows_toolbar',

    cls: 'cmv_minimized_windows_toolbar',

    name: null,

    hidden: true,

    listeners: {
        addMinimizedWindow: 'onAddMinimizedWindow',
        restoreFromWindow: 'onRestoreFromWindow',
        windowClosed: 'removeButtonFromToolbar'
    }
});
