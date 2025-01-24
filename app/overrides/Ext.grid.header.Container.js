Ext.override(Ext.grid.header.Container, {
    getHeaderMenu: function () {
        var menu = this.getMenu(),
            item;

        if (menu) {
            item = menu.child('#columnItem');
            // no check to see if item is null here
            // TypeError: Cannot read properties of null (reading 'menu')
            // so move within guard block
            // item.menu.hideOnScroll = false;

            if (item) {
                item.menu.hideOnScroll = false;
                return item.menu;
            }
        }

        return null;
    },
});