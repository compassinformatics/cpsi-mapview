/**
 * Base class for a ComboBox using a custom CPSI Gazetteer service.
 */
Ext.define('CpsiMapview.view.combo.Gazetteer', {
    extend: 'GeoExt.form.field.GeocoderComboBox',
    xtype: 'cmv_gazetteer_combo',

    /**
     * The query parameter for the user entered search text.
     * Not used for this Gazetteer service.
     *
     * @cfg {String}
     */
    queryParam: null,

    /**
     * Minimum number of entered characters to trigger a search.
     *
     * @cfg {Number}
     */
    minChars: 2,

    /**
     * The SRS used by the Gazetteer service.
     *
     * @cfg {String}
     */
    srs: 'EPSG:3857',

    onFocus: Ext.emptyFn,

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        // Enable the proxying of key events for the HTML input field
        me.enableKeyEvents = true;

        // Add missing '/' to end of URL if missing
        if (me.url.slice(-1) !== '/') {
            me.url += '/';
        }

        me.locationLayerStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'turquoise',
                width: 2,
                lineDash: [8, 4]
            })
        });

        me.callParent();

        me.on({
            keyup: function () {
                var val = me.getRawValue();

                if (Ext.isEmpty(val)) {
                    me.removeLocationFeature();
                }

            },
            beforequery: function () {
                var val = this.getRawValue();

                // clear any previous query feature
                me.removeLocationFeature();

                if (val) {
                    // only trigger a request if text has been entered
                    var url = me.url + encodeURIComponent(val.trim());
                    me.getStore().getProxy().setUrl(url);
                    return true;
                } else {
                    return false;
                }
            },
            afterrender: function () {
                // set a key on the layer using the unique id of the combo
                me.locationLayer.set('layerKey', me.id);
            }
        });

    },

    /**
     * Function to convert the data delivered by the Gazetteer service to an
     * ol.Extent ([minx, miny, maxx, maxy]).
     *
     * @param  {Mixed}          v   The data value as read by the Reader
     * @param  {Ext.data.Model} rec The data record containing raw data
     * @return {ol.Extent}          The created ol.Extent
     */
    convertToExtent: function (v, rec) {
        var minx = rec.get('minX3857');
        var miny = rec.get('minY3857');
        var maxx = rec.get('maxX3857');
        var maxy = rec.get('maxY3857');

        return [minx, miny, maxx, maxy];
    }
});
