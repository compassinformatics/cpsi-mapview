/*
 * Based on:  https://forum.sencha.com/forum/showthread.php?304374-Binding-doesn-t-work-with-validation
 *
 * by design the bound model isn't updated if the form field is invalid, therefore validation-related bindings aren't triggered
 * (like the "canSave" formula in the EditFormViewModelMixin" class)
 * This override lets the model to be updated even if the value in the field is invalid, allowing for further logic to be processed
 *
 * It relies on a "bindOn" configuration to be set on the fields to one of the following values:
 *  "both": updates the model when the field value is either valid or invalid
 *  "invalid": updates the model only when the value is invalid
 *  "valid"/<not set>: (default) the model is updated only if the field value is valid (default behaviour)
 */

Ext.override(Ext.form.field.Base, {
    bindOn: 'both',
    publishValue: function () {
        const me = this;

        if (me.rendered) {
            switch (me.bindOn) {
                case 'both':
                    me.publishState('value', me.getValue());
                    break;
                case 'invalid':
                    if (me.getErrors().length) {
                        me.publishState('value', me.getValue());
                    }
                    break;
                case 'valid':
                default:
                    if (!me.getErrors().length) {
                        me.publishState('value', me.getValue());
                    }
            }
        }
    }
});
