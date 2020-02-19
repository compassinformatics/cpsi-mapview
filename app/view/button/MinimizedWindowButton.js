/**
 * This class is the button of cpsi mapview application that represent
 * minimized windows. When clicking on such a button, the restoreWindow
 * event of the parent toolbar will be fired.
 * 
 * @class CpsiMapview.view.button.MinimizedWindowButton
 */
Ext.define('CpsiMapview.view.button.MinimizedWindowButton', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_minimized_window_button',

    requires: [
        'CpsiMapview.controller.button.MinimizedWindowButton'
    ],

    controller: 'cmv_minimized_window_button',

    /**
     * Reference to the window that this button represents
     */
    windowRef: null,

    listeners: {
        click: 'onClick'
    }
});
