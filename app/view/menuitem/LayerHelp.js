/**
 * MenuItem to open a help page associated with a layer
 *
 * @class CpsiMapview.view.menuitem.LayerHelp
 */
Ext.define('CpsiMapview.view.menuitem.LayerHelp', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layerhelp',
    mixins: ['CpsiMapview.form.HelpMixin'],
    requires: ['CpsiMapview.util.Grid'],

    /**
     * The connected layer for this item.
     *
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Text shown in this MenuItem
     * @cfg {String}
     */
    text: 'Help',

    /**
     * An empty view model to store a helpUrl
     */
    viewModel: {},

    /**
     * @private
     */
    initComponent: function () {
        const me = this;
        let showHelp = false;

        let helpUrl = null;

        // check if there is a helpUrl added directly to the layer config
        if (me.layer.get('helpUrl')) {
            helpUrl = me.layer.get('helpUrl');
        } else {
            // also check if there is a helpUrl specified in an associated layer grid
            const gridWindow = CpsiMapview.util.Grid.getGridWindow(me.layer);

            if (gridWindow) {
                const grid = gridWindow.down('grid');
                helpUrl = grid.getViewModel().get('helpUrl');
            }
        }

        if (helpUrl) {
            const vm = me.getViewModel();
            vm.set('helpUrl', helpUrl);
            showHelp = true;
        }

        me.handler = me.handlerFunc;
        me.callParent();
        me.setHidden(!showHelp);
    },

    /**
     * Executed when this menu item is clicked.
     * Opens the help page associated with the layer
     */
    handlerFunc: function () {
        const me = this;
        me.onHelp();
    }
});
