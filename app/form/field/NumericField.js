/*
 * GNU General Public License Usage
 * This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.
 *
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @description: This class provide aditional format to numbers by extending Ext.form.field.Number
 *
 * @author: Greivin Britton
 * @email: brittongr@gmail.com
 * @version: 2 compatible with ExtJS 4
 */

/***********************************

GOT FROM HERE

https://www.sencha.com/forum/showthread.php?147962-Number-Field-with-currency-symbol-thousand-separator-amp-international-support-ExtJS4


***************************************/

Ext.define('CpsiMapview.form.field.NumericField',
    {
        extend: 'Ext.form.field.Number',
        xtype: 'cmv_numericfield',
        requires: ['Ext.util.Format'],
        symbol: null,
        decimalPrecision: 0,
        showSymbolAtTheEnd: true,

        width: 100,
        fieldStyle: 'text-align: right;',
        constructor: function (config) {
            if (config.labelWidth && !Ext.isEmpty(config.fieldLabel) && !config.width) {
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
                    // if no symbol specified ExtJS will default to the configured currency symbol, but in our implementation we will not have a symbol
                    ret = ret
                        .replace(Ext.util.Format.currencySign + ' ', '')
                        .replace(' ' + Ext.util.Format.currencySign, '');
                }
            }
            return ret;
        },
        /**
         * Remove only the format added by this class to let the superclass validate with its rules.
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
            //return (value) ? CpsiMapview.view.field.NumericField.superclass.getErrors.call(this, this.rawToValue(value)) : CpsiMapview.view.field.NumericField.superclass.getErrors.call(this);
            return (value) ? this.callParent([this.rawToValue(value)]) : this.callParent(arguments);
        },
        /**
         * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
         * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
         */
        onFocus: function () {
            if (!this.readOnly){
                this.setRawValue(this.rawToValue(this.getRawValue()));
            }
            this.callParent(arguments);
        }
    }
);
