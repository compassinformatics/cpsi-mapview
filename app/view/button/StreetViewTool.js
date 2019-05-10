/**
 * Button to open the Street View tool.
 *
 * @class CpsiMapview.view.button.StreetViewTool
 */
Ext.define('CpsiMapview.view.button.StreetViewTool', {
    extend: 'Ext.button.Button',
    xtype: 'cmv_streetview_tool',

    requires: [
        'CpsiMapview.controller.button.StreetViewTool'
    ],

    /**
     * The controller for this class.
     *
     * @private
     */
    controller: 'cmv_streetview_tool',

    /**
     * The icon used for the button.
     *
     * @cfg {String}
     */
    glyph: 'xf21d@FontAwesome',

    /**
     * The name to be used e.g. in ComponentQueries.
     *
     * @private
     */
    name: 'streetViewToolButton',

    /**
     * Enable toogle mode for the button.
     *
     * @cfg {Boolean}
     * @private
     */
    enableToggle: true,

    /**
     * The OL map work / sync with this tool.
     *
     * @cfg {ol.Map}
     */
    map: null,

    /**
     * Optional style for the position layer.
     *
     * @cfg {ol.style.Style}
     */
    vectorLayerStyle: null,

    /**
     * Name of the layer group to which the position layer will be added.
     *
     * @cfg {String}
     */
    layerGroupName: 'Layers',

    /**
     * The position icon image to be shown on the map.
     *
     * @cfg {String}
     */
    vectorIcon: 'resources/img/streetViewFOV.png',

    /**
     * Initial width of the Street View window.
     *
     * @cfg {Number}
     */
    svWinWidth: 800,

    /**
     * Initial height of the Street View window.
     *
     * @cfg {Number}
     */
    svWinHeight: 600,

    /**
     * The prefix for the title of the Street View window.
     *
     * @cfg {String}
     */
    svWinTitlePrefix: 'Google Street View',

    /**
     * The label to be set infront of the image date of the SV panorama.
     *
     * @cfg {String}
     */
    svWinTitleDateLabel: ' Image Date: ',

    /**
     * The default / initial POV settings for the Street View panorama.
     *
     * @cfg {Object}
     */
    svDefaultPov: {
        heading: 34,
        pitch: 10,
        zoom: 1
    },

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onToggle',
        beforedestroy: 'onBeforeDestroy'
    }
});
