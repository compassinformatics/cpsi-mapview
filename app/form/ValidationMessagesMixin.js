/**
 * A mixin to handle form validation and displaying
 * the reason why the Save button is disabled
 *
 * @class CpsiMapview.form.ValidationMessagesMixin
 */
Ext.define('CpsiMapview.form.ValidationMessagesMixin', {
    extend: 'Ext.Mixin',

    checkValid: function (rec) {
        const me = this;

        if (!rec) {
            return false;
        }

        if (me.getView().destroyed === true) {
            return true;
        }

        // Replace the single call to "updateValidationMessages" with a buffered call
        // This prevents a repeated call in a short period of time - for example when triggered by adding multiple rows to a grid
        me.updateValidationMessagesBuffered =
            me.updateValidationMessagesBuffered ||
            Ext.Function.createBuffered(
                function (rec) {
                    me.updateValidationMessages(rec);
                },
                100,
                me
            );
        me.updateValidationMessagesBuffered(rec);
        return rec.isValid();
    },

    updateValidationMessages: function (rec) {
        const me = this;
        let view = me.getView();

        if (!view || view.destroyed === true) {
            // view destroyed while buffer was waiting
            return;
        }
        // if a control is in a grid, or sub-component
        // ensure the parent window is set as the view
        if (view.isXType('window') === false) {
            view = view.up('window');
            if (!view) {
                //<debug>
                Ext.log.warn('No parent view found for the control');
                //</debug>
                return;
            }
        }

        const saveButton = view.down('#saveButton');

        if (view.isVisible() && !saveButton) {
            //<debug>
            Ext.log.warn('No button with itemId #saveButton found');
            //</debug>
            return;
        }

        // force re-validation - the model may not have been updated
        // but a related model e.g. a column may have been
        const refresh = true;
        rec.getValidation(refresh);

        if (rec.isValid() === false) {
            // console.log(rec.validation.data);
            // create some validation messages

            const d = rec.getValidation().getData();
            const errors = [];

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
