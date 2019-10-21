/**
 * MenuItem to show a slider to change the layer's opacity.
 *
 * @class CpsiMapview.view.menuitem.LayerOpacity
 */
Ext.define('CpsiMapview.view.menuitem.LayerOpacity', {
    extend: 'Ext.menu.Item',
    xtype: 'cmv_menuitem_layeropacity',
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
    text: 'Opacity',


    /**
     * @private
     */
    initComponent: function () {
        var me = this;
        var allowOpacitySlider = false;

        if (me.layer) {
            allowOpacitySlider = me.layer.get('opacitySlider');
        }

        var opacitySlider = Ext.create('Ext.slider.Single', {
            width: 200,
            value: me.layer.getOpacity() * 100,
            minValue: 0,
            maxValue: 100,
            tipText: function (thumb) {
                return Ext.String.format('<div>Visibility: {0}%</div>', thumb.value);
            },
            listeners: {
                change: me.onOpacityChange,
                scope: me
            }
        });
        me.menu = {
            plain: true,
            items: [opacitySlider]
        };

        me.callParent();

        me.setHidden(!allowOpacitySlider);
    },

    /**
     * Executed when the opacity slider in this menu is changed.
     *
     * @param  {Ext.slider.Single} slider The opacity slider
     * @param  {Number} newValue The new value which the slider has been changed to.
     */
    onOpacityChange: function (slider, newValue) {
        var me = this;
        var opac = newValue / 100;

        me.layer.setOpacity(opac);

        // treat vector tile layers special since setOpacity has no effect on
        // them, see https://github.com/openlayers/openlayers/issues/4758
        if (me.layer.get('isVt')) {
            var setLayerOpacity = function(evt) {
                evt.context.globalAlpha = opac;
            };
            me.layer.on('precompose', setLayerOpacity);
            CpsiMapview.view.main.Map.guess().olMap.render();
        }

    }
});
