
Ext.define('CpsiMapview.view.field.CurrencyField',
    {
        extend: 'CpsiMapview.view.field.NumericField',//Extending the NumberField
        xtype: 'cmv_currencyfield',//Defining the xtype,
        symbol: '€',
        decimalPrecision: 2,
        showSymbolAtTheEnd: false
    }
);
