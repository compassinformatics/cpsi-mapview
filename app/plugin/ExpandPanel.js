Ext.define('CpsiMapview.plugin.ExpandPanel', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.cmv_expand_panel',

    layout: 'fit',

    /**
     * This is the parent panel that the expanded panel will be reinserted after maximizing. By default is set to the
     * direct parent. A parent panel needs to exist for this plugin to work.
     * If a window should be made expandable use the config `maximizable` instead.
     */
    parentPanel: null,

    /**
     * The original position of the panel in the parent. Will be calculated if the panel can be found in the items of
     * the direct parent.
     */
    positionInParentPanel: 0,

    init: function () {
        var me = this;
        var cmp = me.getCmp();

        me.maxTool = Ext.create('Ext.panel.Tool', {
            type: 'maximize',
            handler: function () {
                me.expand();
            }
        });

        cmp.addTool(me.maxTool);

        me.callParent();
    },

    /**
     * Creates a maximized window containing the panel.
     */
    expand: function () {
        var me = this;
        var cmp = me.getCmp();

        if (me.parentPanel === null) {
            me.parentPanel = cmp.up();
        }

        if (!me.parentPanel || !me.parentPanel.isXType('panel')) {
            throw new Error('the property parentPanel has to be of xtype `panel`');
        }

        var index = me.parentPanel.items.items.indexOf(cmp);
        me.positionInParentPanel = index > -1 ? index : me.positionInParentPanel;

        me.maxedWin = Ext.create('Ext.window.Window', {
            maximized: true,
            closable: false,
            modal: true,
            tools: [
                {
                    type: 'restore',
                    handler: function () {
                        me.restore();
                    }
                }
            ],

            items: [
                cmp
            ]
        });

        me.maxedWin.show();

        me.maxTool.hide();

        cmp.fireEvent('expand', cmp);
        me.parentPanel.fireEvent('expand', cmp);
    },

    /**
     * Reinserts the maximized panel it its original parent.
     */
    restore: function () {
        var me = this;
        var cmp = this.getCmp();

        me.parentPanel.insert(me.positionInParentPanel, cmp);
        me.maxTool.show();

        cmp.fireEvent('restore', cmp);
        me.parentPanel.fireEvent('restore', cmp);

        setTimeout(function () {
            me.maxedWin.close();
        }, 0);


    }
});
