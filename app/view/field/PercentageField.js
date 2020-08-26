
Ext.define('CpsiMapview.view.field.PercentageField',
    {
        extend: 'CpsiMapview.view.field.NumericField',//Extending the NumberField
        xtype: 'cmv_percentagefield',//Defining the xtype,
        symbol: '%',
        decimalPrecision: 2,

    }
);
