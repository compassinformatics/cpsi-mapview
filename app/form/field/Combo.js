/**
 * A customised combobox which provides a consistent UX across the system
 *
 * @class CpsiMapview.form.field.Combo
 */
Ext.define('CpsiMapview.form.field.Combo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'cmv_combo',
    forceSelection: true, // ExtJS default is false
    lastQuery: '',
    enableKeyEvents: true, // ExtJS default is false
    queryMode: 'local', // ExtJS default is 'remote'
    typeAhead: true, // ExtJS default is false
    selectOnFocus: true, // ExtJS default is false

    /**
     * Reset the combobox if the delete key is pressed
    **/
    listeners: {
        specialkey: function (combo, e) {
            if (e.keyCode == 46) {
                combo.reset();
            }
        }
    },

    /**
    * The following override fixes issues with ExtJS comboboxes and bindings
    * A solution was found by debugging the following class: http://localhost:1841/ext/packages/core/src/mixin/Bindable.js
    * It became apparent that a value was set on the combobox when the model was bound, but then subsequently
    * wiped out when the store associated with the combobox was bound
    * `setValueOnData` is called in http://localhost:1841/ext/classic/classic/src/form/field/ComboBox.js
    * which should set the selection correctly
    * however this is not the case as `lastSelection` is already set to the same value
    * see comment // If the same set of records are selected, this setValue has been a no-op
    * in http://localhost:1841/ext/packages/core/src/app/ViewModel.js
    * @param {any} newStore
    */
    onBindStore: function (newStore) {

        if (newStore.isEmptyStore !== true) {
            var bindings = this.getBind();
            if (bindings.store && bindings.selection) {
                this.lastSelection = null;
            }
        }
        return this.callParent(arguments);
    }
});
