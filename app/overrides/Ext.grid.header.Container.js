Ext.override(Ext.grid.header.Container, {
    getHeaderMenu: function () {
        const menu = this.getMenu();

        if (menu) {
            const item = menu.child('#columnItem');
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
    }
});
