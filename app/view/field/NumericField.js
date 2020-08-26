
Ext.define('CpsiMapview.view.field.NumericField',
    {
        extend: 'Ext.form.field.Number',//Extending the NumberField
        xtype: 'cmv_numericfield',//Defining the xtype,
        symbol: null,
        decimalPrecision: 0,
        showSymbolAtTheEnd: true,

        width: 100,
        fieldStyle: 'text-align: right;',
        constructor: function (config) {
            if (!!config.labelWidth && !Ext.isEmpty(config.fieldLabel) && !config.width) {
                config.width = config.labelWidth + this.width;
            }
            this.callParent(arguments);
        },

        valueToRaw: function (value) {
            var ret = value;
            if (!Ext.isEmpty(value)) {
                ret = Ext.util.Format.currency(
                    value,
                    this.symbol,
                    this.decimalPrecision, // number of decimals
                    this.showSymbolAtTheEnd,
                    ' '
                );
                if (!this.symbol) {
                    // if no symbol specified ExtJS will default to the configured currency symbol, but in our implementation we mean not to have any symbol
                    ret = ret
                        .replace(Ext.util.Format.currencySign + ' ', '')
                        .replace(' ' + Ext.util.Format.currencySign, '');
                }
            }
            return ret;
        },
        /**
         * Remove only the format added by this class to let the superclass validate with it's rules.
         * @param {Object} value
         */
        rawToValue: function (value) {
            if (!Ext.isEmpty(value)) {
                value = value.toString().replace(this.symbol + ' ', '');
                value = value.toString().replace(' ' + this.symbol, '');
                value = Ext.util.Format.thousandSeparator ? value.replace(new RegExp('[' + Ext.util.Format.thousandSeparator + ']', 'g'), '') : value;
                value = Number(value);
            }
            return value;
        },
        /**
         * Remove the format before validating the the value.
         * @param {Number} value
         */
        getErrors: function (value) {
            return (value) ? CpsiMapview.view.field.NumericField.superclass.getErrors.call(this, this.rawToValue(value)) : CpsiMapview.view.field.NumericField.superclass.getErrors.call(this);
        },
        /**
         * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
         * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
         */
        onFocus: function () {
            this.setRawValue(this.rawToValue(this.getRawValue()));
            this.callParent(arguments);
        }
    }
);
