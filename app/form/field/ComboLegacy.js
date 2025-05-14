/**
 * A combobox that allows any legacy lookup values to be displayed
 * for existing records, but not selected for new records
 *
 * @class CpsiMapview.form.field.ComboLegacy
 */
Ext.define('CpsiMapview.form.field.ComboLegacy', {
    extend: 'CpsiMapview.form.field.Combo',
    xtype: 'cmv_combolegacy',

    // the following property can be set to add a label to the combobox entries
    legacyPostfix: ' - Legacy',

    /**
     * Prevent selection of isLegacy, but only if it is
     * a user initiated change
     **/
    listeners: {
        focus: function (combo) {
            combo.__isUserInteracting = true;
        },
        blur: function (combo) {
            combo.__isUserInteracting = false;
        },
        select: function (combo, record) {
            if (combo.__isUserInteracting && record.get('isLegacy')) {
                combo.clearValue();
            }
        }
    },

    /**
     * See https://docs.sencha.com/extjs/6.7.0/classic/Ext.XTemplate.html for docs on templates
     * And the Sencha forums at https://www.sencha.com/forum/showthread.php?308501-Combo-box-TPL-if-condition
     * and associated fiddle https://fiddle.sencha.com/#fiddle/14ud&view/editor
     **/
    initComponent: function () {
        const me = this;
        const itemTemplate = Ext.String.format(
            '<tpl for=".">' +
                '<tpl if="isLegacy === true">' +
                '<li role="option" class="' +
                Ext.baseCSSPrefix +
                'boundlist-item ' +
                Ext.baseCSSPrefix +
                'item-disabled ' +
                Ext.baseCSSPrefix +
                'boundlist-item-legacy"> ' +
                '{{0}}' +
                me.legacyPostfix +
                '</li>' +
                '<tpl else>' +
                '<li role="option" class="' +
                Ext.baseCSSPrefix +
                'boundlist-item">' +
                '{{0}}' +
                '</li>' +
                '</tpl>' +
                '</tpl>',
            me.displayField
        );

        me.tpl = itemTemplate;
        me.callParent(arguments);
    }
});
