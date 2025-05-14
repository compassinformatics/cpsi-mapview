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

    /**
     * String to append to the field names
     * from example if set to '3857' extent field names
     * will be expected to be in the format minX3857
     * @cfg {String}
     */
    fieldNameSuffix: '3857',

    onFocus: Ext.emptyFn,

    /**
     * @private
     */
    initComponent: function () {
        const me = this;

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

        // ensure that the scope of convertToExtent is set to this class
        // so we can get the fieldNameSuffix
        me.convertToExtent = me.convertToExtent.bind(me);

        me.callParent();

        me.on({
            keyup: function () {
                const val = me.getRawValue();

                if (Ext.isEmpty(val)) {
                    me.removeLocationFeature();
                }
            },
            beforequery: function () {
                const val = this.getRawValue();

                // clear any previous query feature
                me.removeLocationFeature();

                if (val) {
                    // only trigger a request if text has been entered
                    const url = me.url + encodeURIComponent(val.trim());
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
     * ol.Extent ([minX, minY, maxX, maxY]). If `fieldNameSuffix` is set then
     * field names such as minX2857 can be supported
     *
     * @param  {Mixed}          v   The data value as read by the Reader
     * @param  {Ext.data.Model} rec The data record containing raw data
     * @return {ol.Extent}          The created ol.Extent
     */
    convertToExtent: function (v, rec) {
        const me = this;

        const minx = rec.get('minX' + me.fieldNameSuffix);
        const miny = rec.get('minY' + me.fieldNameSuffix);
        const maxx = rec.get('maxX' + me.fieldNameSuffix);
        const maxy = rec.get('maxY' + me.fieldNameSuffix);

        return [minx, miny, maxx, maxy];
    }
});
