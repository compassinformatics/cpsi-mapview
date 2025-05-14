/**
 * MenuItem to show a radio group in order to switch the style for the layer.
 *
 * @class CpsiMapview.view.menuitem.LayerStyleSwitcher
 */
Ext.define('CpsiMapview.view.menuitem.LayerStyleSwitcher', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layer_styleswitcher',
    requires: [],

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
    text: 'Styles',

    /**
     * @private
     */
    initComponent: function () {
        const me = this;
        let allow = false;

        if (me.layer) {
            allow = me.layer.get('styles');
        }

        if (allow) {
            const radioGroup = Ext.create(
                'CpsiMapview.view.layer.StyleSwitcherRadioGroup',
                {
                    layer: me.layer,
                    renderedBelowTreeNode: false,
                    listeners: {
                        'cmv-layer-style-change': me.onLayerStyleChange
                    }
                }
            );

            me.menu = {
                plain: true,
                items: [radioGroup]
            };
        }

        me.callParent();

        me.setHidden(!allow);
    },

    /**
     * Handler for 'cmv-layer-style-change' event of the underlying
     * StyleSwitcherRadioGroup.
     *
     * @param {CpsiMapview.view.layer.StyleSwitcherRadioGroup} radioGrp
     * @param {String} newStyle Style name (foo_bar)
     * @param {String} newStyleTitle Style title (human readable - 'My Style')
     * @param {ol.layer.Base} layer The layer where the style changed
     */
    onLayerStyleChange: function (radioGrp, newStyle, newStyleTitle, layer) {
        const layerTree = Ext.ComponentQuery.query('cmv_layertree')[0];
        if (layerTree) {
            layerTree.refreshLayerNodeText(layer);
        }
    }
});
