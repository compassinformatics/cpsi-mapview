/**
 * If a tooltip has not been set for a column header
 * then always default to the column name
 **/
Ext.override(Ext.grid.column.Column, {
    initRenderData: function () {

        var me = this;

        if (Ext.isEmpty(me.tooltip)) {
            // remove any HTML tags and whitespace so icons don't break the tooltips
            me.tooltip = Ext.String.trim(Ext.util.Format.stripTags(me.text));
        }

        return me.callParent(arguments);
    }
});