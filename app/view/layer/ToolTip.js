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

    constructor: function (config) {
        var me = this;

        config.style = {
            backgroundColor: config.bgColor,
            color: config.textColor,
            fontWeight: config.bold ? 'bold' : undefined,
            opacity: config.opacity
        };

        me.callParent([config]);
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
            // tooltip text
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
        var screenX = evt.originalEvent.pageX + me.offsetX;
        var screenY = evt.originalEvent.pageY + me.offsetY;
        me.showAt([screenX, screenY]);

        // extjs has somehow problems with the very first render of the tooltip
        if (me.__initialized === undefined) {
            me.__initialized = true;
            me.hide();
            setTimeout(function () {
                me.show();
            }, 200);
        }
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
        var htmlPart;

        Ext.each(me.toolTipConfig, function (tipConf) {
            if (tipConf.thumbnail && tipConf.property) {
                var antiCache = new Date().getTime();
                var onError = 'this.style.display =\'none\'';
                var style = 'width:120px; height:90px;';
                var url = Ext.String.format(tipConf.thumbnail, feature.get(tipConf.property));
                htmlPart = Ext.String.format('<img src="{0}?_ac={1}" onerror="{2}" style="{3}"/>',
                    url, antiCache, onError, style);
            } else {
                var key = tipConf.alias || tipConf.property;
                var value = feature.get(tipConf.property);
                htmlPart = Ext.String.format('<b>{0}: </b>{1}', key, value);
            }

            if (String(value) === '-999') {
                // HACK
                // -999 is the default value used for NULLs so WFS layers can
                // work with MapInfo as TAB files don't allow NULL values
                value = null;
            }

            htmlParts.push(htmlPart);
        });

        return htmlParts.join('<br/>');
    }
});
