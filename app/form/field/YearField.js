Ext.define('CpsiMapview.form.field.YearField', {
    extend: 'Ext.form.field.Number',
    xtype: 'cmv_yearfield',
    fieldStyle: 'text-align: right;', // TODO has no effect?
    // textAlign: 'right', // property not available
    allowDecimals: false,
    minValue: 1990,
    maxValue: 2030,
    minLength: 4,
    maxLength: 4,
    enforceMaxLength: true,
    maxLengthText: 'Must be in the format YYYY',
    minLengthText: 'Must be in the format YYYY',
    emptyText: 'Enter a year...',
    width: 220
});
