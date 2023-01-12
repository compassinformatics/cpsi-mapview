/**
 * A mixin to order column selector menu alphabetically
 *
 * @class CpsiMapview.util.ColumnMenuOrderMixin
 */
Ext.define('CpsiMapview.util.ColumnMenuOrderMixin', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        after: {
            initItems: 'setup'
        },
        before: {
            destroy: 'teardown'
        }
    },

    setup: function () {
        var me = this;
        me.on('headermenucreate', this.onHeaderMenuCreate);
    },

    teardown: function () {
        var me = this;
        me.un('headermenucreate', this.onHeaderMenuCreate);
    },

    /**
     * Sort the column names displayed when opening the submenu alphabetically
     * @param {any} grid
     * @param {any} menu
     */
    onHeaderMenuCreate: function (grid, menu) {
        console.log('CpsiMapview.view.grid.Grid');
        // Fired immediately after the column header menu is created.
        var columnItems = menu.down('[itemId=columnItem]'),
            menuItems = columnItems.menu.items.items;

        // Sorting by column's lowercase "text" in ascending order
        menuItems.sort(function (item1, item2) {
            var name1 = item1.text.toLowerCase(),
                name2 = item2.text.toLowerCase();
            if (name1 < name2) //sort string ascending
                return -1;
            if (name1 > name2)
                return 1;
            return 0; //default return value (no sorting)
        });

        // update keys order as well otherwise it will have old
        // menu item keys order and grouping by field starts creating a problem.
        columnItems.menu.items.keys = menuItems.map(function (item) {
            return item.id;
        });
    }
});
