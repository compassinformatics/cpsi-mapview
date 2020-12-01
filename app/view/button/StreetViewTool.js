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
     * The tooltip to display when hovering over the button
     *
     * @private
     */
    tooltip: 'Activate the StreeView tool',

    /**
     * Enable toggle mode for the button.
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
     * The label to be set in front of the image date of the SV panorama.
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
     * Flag to steer if a warning UI is shown in case no panorama is available
     * for the clicked position.
     *
     * @cfg {Boolean}
     */
    showNoPanoramaWarning: true,

    /**
     * Title of the alert UI shown in case no panorama is available.
     *
     * @cfg {String}
     */
    noPanoramaWarningTitle: 'INFO',

    /**
     * Text of the alert UI shown in case no panorama is available.
     *
     * @cfg {String}
     */
    noPanoramaWarningText: 'No panorama available for the clicked position.',

    /**
     * Register the listeners and redirect them
     * to their corresponding controller methods
     */
    listeners: {
        toggle: 'onToggle',
        beforedestroy: 'onBeforeDestroy'
    }
});
