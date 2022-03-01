/**
 * Ensure dragging a window works correctly when the initial defaultAlign is not the default 'c-c'
 * See https://forum.sencha.com/forum/showthread.php?469839-6-5-3-Classic-Window-quot-jumps-quot-when-dragged-with-constrainHeader-true
 * An alternate solution is to set constrainHeader: false in the window and then set win.constrainHeader = true after the window is
 * displayed (although this "bounces" the window back within the viewport rather than constraining the header)
 */
Ext.override(Ext.window.Window, {
    createGhost: function (cls) {

        // original function
        //var ghost = this.callParent(arguments);

        //ghost.xtype = 'window';
        //ghost.focusOnToFront = false;

        //return ghost;

        var ghost = this.callParent(arguments);
        var me = this;
        ghost.x = me.getX();
        ghost.y = me.getY();

        return ghost;
    }
});