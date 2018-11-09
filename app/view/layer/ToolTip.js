/**
 * Mouse tooltip for a vector layer to show layer/feature information on the
 * map. For example show attributes when feature gets hovered with the mouse.
 */
Ext.define('CpsiMapview.view.layer.ToolTip', {
    extend: 'Ext.tip.Tip',
    xtype: 'cmv_layer_tooltip',
    requires: [
    ],

    /** @cfg The offset from the event's mouse x-position */
    offsetX: 10,

    /** @cfg The offset from the event's mouse y-position */
    offsetY: 10,

    /** @cfg The config object for this tooltip instance */
    toolTipConfig: null,

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.callParent();
    },

    /**
     * Draws a tooltip at the given event position.
     * The content is derived from the #formatFunction.
     *
     * @param {ol.Feature} feature The feature to draw the tooltip for
     * @param {ol.MapBrowserEvent} evt The MapBrowserEvent event of OpenLayers
     */
    draw: function (feature, evt) {
        var me = this;

        //TODO care about clustered features

        //TODO check for layer's formatFunction
        var html = me.formatFunction(feature);
        me.setHtml(html);

        // show tooltip near mouse pointer
        var screenX = evt.originalEvent.x +  me.offsetX;
        var screenY = evt.originalEvent.y + me.offsetY;
        me.showAt([screenX, screenY]);
    },

    /**
     * Tranforms the feature's attributes to the wanted HTML structure shown in
     * this tooltip.
     * This function can be overridden if different HTML is needed for a custom
     * layer.
     * @param  {ol.Feature} feature The feature to get the HTML for
     * @return {String}             HTML code as text
     */
    formatFunction: function (feature) {
        var me = this;
        var htmlParts = [];

        Ext.each(me.toolTipConfig, function (tipConf) {
            var key = tipConf.alias || tipConf.property;
            var value = feature.get(tipConf.property);
            if (String(value) === '-999') {
                // HACK
                // -999 is the default value used for NULLs so WFS layers can
                // work with MapInfo as TAB files don't allow NULL values
                value = null;
            }

            var htmlPart = Ext.String.format('<b>{0}: </b>{1}', key, value);
            htmlParts.push(htmlPart);
        });

        return htmlParts.join('<br/>');
    }
});
