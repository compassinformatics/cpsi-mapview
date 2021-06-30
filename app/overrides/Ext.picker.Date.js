Ext.override(Ext.picker.Date, {

    setValue: function (value) {
        if (Ext.isString(value)) {
            // as the date needs to be formatted as a string to send to the server
            // we need to convert it back again or the DatePicker fails when sending
            // a string to Ext.Date.clearTime
            value = Ext.Date.parse(value, this.format);
        }
        this.value = Ext.Date.clearTime(value || this.defaultValue, true);
        return this.update(this.value);
    }
});