Ext.override(Ext.grid.filters.filter.Date, {
    /**
     * The grid Date filter currently ignores the dateFormat and passes raw dates back to
     * the server. This function converts them prior to sending them back using the dateFormat
     * property of the filter.
     * Date filters are subclasses of Ext.grid.filters.filter.TriFilter so its properties appear
     * to be ignored.
     * @param {any} filter
     */
    setValue: function (filter) {
        var me = this;

        // values are in the format {lt: Wed Oct 07 2020 00:00:00 GMT+0200 (Central European Summer Time)}
        var key = Object.keys(filter)[0];
        var val = filter[key];
        if (val) {
            if (me.getGridStore().remoteFilter === true ) {
                // we only want to convert to string when sending to mapserver
                val = Ext.Date.format(val, me.dateFormat);
            }
        }

        filter[key] = val;
        me.callParent([filter]);
    }
});
