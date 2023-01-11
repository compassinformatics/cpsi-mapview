/**
 *  Orders items alphabetically if the menu type is columnItem (For column select menus in grids)
 **/
Ext.override(Ext.menu.Menu, {
    initItems: function () {
        var me = this;
        me.callParent(arguments);

        var isColumnItemMenu = me.ownerCmp && me.ownerCmp.getItemId() === 'columnItem';
        var menuItems;

        // Current menu is not columnItem menu, return early
        if (!isColumnItemMenu) {
            return;
        }

        menuItems = me.items.items;

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
        me.items.keys = menuItems.map(function (item) {
            return item.id;
        });
    }
});
