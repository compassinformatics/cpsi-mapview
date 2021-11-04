/**
 * A mixin to allow zooming to extents and extents
 * returned in a model
 *
 * @class CpsiMapview.util.ZoomerMixin
 */
Ext.define('CpsiMapview.util.ZoomerMixin', {
    extend: 'Ext.Mixin',

    requires: [
        'BasiGX.util.Map'
    ],

    zoomDefaults: {
        duration: 20 // ms
    },

    /**
     * Zoom the map to the selected feature with a buffer
     *
     * @param {ol.Feature} feature
     * @param {ol.Map} map
     * @private
     */
    zoomToFeature: function (feature, map) {

        var me = this;

        var geom = feature.getGeometry();

        // check for null features
        if (!geom) {
            return;
        }

        // TODO check for feature type when zooming
        var extent = geom.getExtent();
        var view = me.getView();
        // as this is a point then buffer it by the extentBuffer property

        var extentBuffer = view.extentBuffer ? view.extentBuffer : 100;

        extent = ol.extent.buffer(extent, extentBuffer);

        var mapView = map.getView();

        var resolution = mapView.getResolutionForExtent(extent);
        var zoom = mapView.getZoomForResolution(resolution);
        var center = ol.extent.getCenter(extent);
        var duration = 2000;

        mapView.animate({
            center: center,
            duration: duration
        });

        mapView.animate(
            {
                zoom: zoom - 1,
                duration: duration / 2
            },
            {
                zoom: zoom,
                duration: duration / 2
            }
        );
    },

    /**
     * Zoom the map object to the extent of the layer
     * See https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
     * for options
     */
    zoomMap: function (extent, options) {

        var me = this;
        options = options || {};

        // apply zoom defaults if not supplied

        Ext.applyIf(options, me.zoomDefaults);

        var mapCompenent = BasiGX.util.Map.getMapComponent();

        if (!mapCompenent) {
            return false;
        }

        var map = mapCompenent.map;

        // only attempt a zoom if there is a map and a valid geometry or extent

        if (map && (!ol.extent.isEmpty(extent))) {
            map.getView().fit(extent);
        }

    },

    /**
     * Zoom the map object to the extent of the layer
     * See https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit
     * for options
     */
    zoomToRecordExtent: function (options) {

        var me = this;
        // mixin will be added to the controller so needs getView()
        var rec = me.getView().getViewModel().get('currentRecord');
        if (rec) {
            var extent = rec.getRecordBounds();
            if (extent) {
                me.zoomMap(extent, options);
            }
        }
    },

    /**
    * Zoom using a bbox provided by the .NET services
    **/
    zoomToExtentUsingService: function (url, id) {

        Ext.Ajax.request({
            url: Ext.String.format(url, id),
            method: 'GET',
            success: function (response) {
                response = Ext.decode(response.responseText);
                // TODO - display error if not a success
                // create event and display it in the app bar
                if (response.success === true) {
                    this.zoomToBounds(response.data);
                }
            },
            scope: this
        });
    },

    /**
     * Zoom to extent using a JSON object with bbox in epsg:3857
     **/
    zoomToBounds: function (data) {
        var bbox = [data.minX3857, data.minY3857, data.maxX3857, data.maxY3857];
        this.zoomMap(bbox);
    }
});