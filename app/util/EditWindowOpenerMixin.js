/**
 * A mixin for any menu controller or window controller which
 * needs to check if a model is already opened in a window.
 *
 * @class CpsiMapview.util.EditWindowOpenerMixin
 */
Ext.define('CpsiMapview.util.EditWindowOpenerMixin', {
    extend: 'Ext.Mixin',

    /**
     * Find an existing window based on a record id
     * @param {any} recId
     * @param {any} editWindowType
     */
    getExistingEditingFormWindow: function (recId, editWindowType) {

        var windowXType = Ext.ClassManager.get(editWindowType).prototype.getXType();
        var existingWindows = Ext.ComponentQuery.query(windowXType);
        var rec, recordWindow = null;

        Ext.each(existingWindows, function (w) {
            rec = w.getViewModel().get('currentRecord');
            if (rec.getId() == recId) {
                recordWindow = w;
                return false;
            }
        });

        return recordWindow;
    },

    /**
     * Return the existing window for the given record if it already exists
     * or a new window if not
     * @param {any} record the model to open
     * @param {any} editWindowType the window in which to open the model
     */
    getEditingFormWindow: function (record, editWindowType) {

        var me = this;
        var recId = record.getId();
        var recordWindow = me.getExistingEditingFormWindow(recId, editWindowType);

        return recordWindow || Ext.create(editWindowType);
    }

});