/**
 * Bug ID EXTJS-27043
 * See https://forum.sencha.com/forum/showthread.php?471594-ExtJS-6-x-Cancel-new-record-in-grid-raise-exception
 * Still not fixed in https://docs.sencha.com/extjs/7.3.1/classic/src/RowEditor.js.html
 */
Ext.override(Ext.grid.RowEditor, {
    cancelEdit: function () {
        const me = this,
            form = me.getForm(),
            fields = form.getFields(),
            items = fields.items,
            length = items.length,
            context = me.context;

        let i;

        if (me._cachedNode) {
            me.clearCache();
        }

        me.hide();

        // If we are editing a new record, and we cancel still in invalid state, then remove it.
        if (context) {
            // additional guard added to fix bug
            const record = context.record;
            if (
                record &&
                record.phantom &&
                !record.modified &&
                me.removeUnmodified
            ) {
                me.editingPlugin.grid.store.remove(record);
            }
        }
        form.clearInvalid();

        // temporarily suspend events on form fields before resetting the form to prevent
        // the fields' change events from firing
        for (i = 0; i < length; i++) {
            items[i].suspendEvents();
        }

        form.reset();

        for (i = 0; i < length; i++) {
            items[i].resumeEvents();
        }
    }
});
