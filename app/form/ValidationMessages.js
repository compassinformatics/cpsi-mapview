/**
 * A mixin to handle form validation and displaying
 * the reason why the Save button is disabled
 *
 * @class CpsiMapview.form.ValidationMessages
 */
Ext.define('CpsiMapview.form.ValidationMessages', {
    extend: 'Ext.Mixin',

    checkValid: function (rec) {

        var me = this;

        if (!rec) {
            return false;
        }

        if (me.getView().destroyed === true) {
            return true;
        }

        me.updateValidationMessages(rec);
        return rec.isValid();
    },

    updateValidationMessages: function (rec) {

        var me = this;
        var view = me.getView();
        var saveButton = view.down('#saveButton');

        //<debug>
        if (!saveButton) {
            Ext.log.warn('No button with itmeId #saveButton found');
            return;
        }
        //</debug>



        // force re-validation - the model may not have been updated
        // but a related model e.g. a column may have been
        var refresh = true;
        rec.getValidation(refresh);

        if (rec.isValid() === false) {
            // console.log(rec.validation.data);
            // create some validation messages

            var d = rec.getValidation().getData();
            var errors = [];

            Ext.Object.each(d, function (key, value) {
                if (value !== true) {
                    errors.push(value + ' (' + key + ')');
                }
            });

            saveButton.setIconCls('x-fa fa-exclamation-triangle');
            // ensure tooltip is visible even when disabled
            // https://forum.sencha.com/forum/showthread.php?302961-Tooltips-not-working-when-button-is-disabled-Intended/page2
            saveButton.setStyle({ pointerEvents: 'all' });
            saveButton.setTooltip(errors.join('<br />'));
        } else {
            saveButton.setIconCls('');
            saveButton.setTooltip('');
        }
    }
});