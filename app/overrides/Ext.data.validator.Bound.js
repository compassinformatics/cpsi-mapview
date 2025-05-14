Ext.override(Ext.data.validator.Bound, {
    /**
     * When using a range or bound validator allow null values to return true
     * See https://forum.sencha.com/forum/showthread.php?298213-Range-validator-validates-nullable-fields
     * And Compass ticket https://support.sencha.com/#ticket-53539
     * @param {any} value
     */
    validate: function (value) {
        const me = this;
        if (value === null) {
            return true;
        }
        return me.callParent([value]);
    }
});
