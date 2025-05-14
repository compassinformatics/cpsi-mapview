Ext.define('CpsiMapview.form.field.DateField', {
    extend: 'Ext.form.field.Date',
    xtype: 'cmv_datefield',
    format: 'd-m-Y',
    altFormats: 'j-m-Y|j-n-Y|d-n-Y|c',
    width: 260
});
