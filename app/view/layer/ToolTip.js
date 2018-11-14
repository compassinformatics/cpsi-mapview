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

    /**
     * The tooltip configuration from the layer JSON-configuration
     * @cfg {Object}
     */
    toolTipConfig: null,

    /**
     * Layer refrence for which this tooltip shows the content
     * @cfg {ol.layer.Base}
     */
    layer: null,

    /**
     * Custom background color of this tooltip
     * @type {String} Color
     */
    bgColor: null,

    /**
     * Custom text color of this tooltip
     * @type {String} Color
     */
    textColor: null,

    /**
     * Custom bold font weight of this tooltip
     * @type {Boolean} true=bold
     */
    bold: false,

    /**
     * Custom background opacity of this tooltip
     * @type {Number} Opacity between 0 and 1
     */
    opacity: null,

    statics: {
        /**
         * Hides all layer tooltips.
         */
        clear: function () {
            var ttips = Ext.ComponentQuery.query('cmv_layer_tooltip');
            Ext.each(ttips, function (tip) {
                tip.hide();
            });
        }
    },

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.callParent();

        // adjust style with custom values
        me.on('afterrender', function () {
            var domEl = me.getEl();
            domEl.applyStyles({
                backgroundColor: me.bgColor,
                color: me.textColor,
                fontWeight: me.bold ? 'bold' : null
            });
            domEl.setOpacity(me.opacity);
        });
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
        var featureCluster = feature.getProperties().features;

        // care about clustered features
        if (featureCluster) {
            // in this case take the first feature in the cluster to define the
            // tooltop text
            if (featureCluster.length > 0) {
                feature = featureCluster[0];
            } else {
                Ext.log.error('No cluster features found');
            }
        }

        // check for layer's formatFunction
        var html;
        if (me.layer && Ext.isFunction(me.layer.formatFunction)) {
            // the layer has its own formatFunction, do not use the default one
            html = me.layer.formatFunction(feature);
        } else {
            html = me.formatFunction(feature);
        }

        // set HTML content
        me.setHtml(html);

        // show tooltip near mouse pointer
        var screenX = evt.originalEvent.x + me.offsetX;
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
