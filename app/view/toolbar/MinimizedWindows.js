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
    xtype: 'cmv_minimized_windows',

    requires: [
        'CpsiMapview.controller.toolbar.MinimizedWindows'
    ],

    controller: 'cmv_minimized_windows',

    name: null,

    hidden: true,

    listeners: {
        addMinimizedWindow: 'onAddMinimizedWindow',
        restoreWindow: 'onRestoreWindow'
    }
});
