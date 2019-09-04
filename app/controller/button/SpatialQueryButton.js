/**
* This class is the controller for the button 'SpatialQueryButton'
 */
Ext.define('CpsiMapview.controller.button.SpatialQueryButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_spatial_query_btn',

    /**
     * The {ol.interaction.Draw} used to draw the geometry used in the spatial
     * query
     */
    drawQueryInteraction: null,

    /**
    * The OpenLayers map. If not given, will be auto-detected
    */
    map: null,

    /**
     * The BasiGX mapComponent. If not given, will be auto-detected
     */
    mapComponent: null,

    /**
     * Function to determine the query layer if not yet defined in class
     */
    findQueryLayer: function () {
        var me = this;
        var view = me.getView();
        if (!view.queryLayer && view.queryLayerName) {
            view.queryLayer = BasiGX.util.Layer.
                getLayerByName(view.queryLayerName);
        }
    },

    /**
     * Activates #drawQueryInteraction on button toggle to draw polygon
     * selection geometry that will be used for filtering.
     *
     * @param {Ext.button.Button} btn The toggled select by polygon button.
     * @param {Boolean} pressed The toggle state.
     */
    onSpatialQueryBtnToggle: function (btn, pressed) {
        var me = this;
        var view = me.getView();

        if (view.map && view.map instanceof ol.Map) {
            me.map = view.map;
        } else {
            // guess map as fallback
            me.map = BasiGX.util.Map.getMapComponent().map;
        }

        if (!view.queryLayer) {
            me.findQueryLayer();
        }

        var geometryFunction;
        var type = view.drawGeometryType;
        if (view.spatialOperator === 'bbox') {
            type = 'Circle';
            geometryFunction = ol.interaction.Draw.createBox();
        }

        if (!me.drawQueryInteraction) {
            me.drawQueryInteraction = new ol.interaction.Draw({
                features: view.queryFeatures,
                geometryFunction: geometryFunction,
                type: type
            });
            me.map.addInteraction(me.drawQueryInteraction);
        }
        if (pressed) {
            me.drawQueryInteraction.setActive(true);
            view.queryFeatures.on('add', me.getGeometryFromPolygonAndTriggerWfs, me);
        } else {
            me.drawQueryInteraction.setActive(false);
            view.queryFeatures.un('add', me.getGeometryFromPolygonAndTriggerWfs, me);
        }
    },

    /**
     * Help method to create a polygon geometry from drawn irregular polygon.
     *
     * @param {Ext.Event} evt The add-Event containing drawn feature
     */
    getGeometryFromPolygonAndTriggerWfs: function (evt) {
        var geometry = evt.element.getGeometry();
        this.buildAndRequestQuery(geometry);
    },

    /**
     * Build query / filter and call WFS
     *
     * @param {ol.geom.Geometry} geometry The geometry
     */
    buildAndRequestQuery: function (geometry) {
        var me = this;
        var view = me.getView();
        if (!view.queryLayer) {
            return;
        }

        var mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();

        var projString = mapComp.getMap().getView().getProjection().getCode();
        var geomFieldName = view.queryLayer.get('geomFieldName') ||
            view.queryLayer.getSource().get('geomFieldName') ||
            'the_geom';
        var url = view.queryLayer.get('url') ||
            view.queryLayer.getSource().getUrl() ||
            view.queryLayer.getSource().getUrls()[0];

        var featureType = view.queryLayer.get('featureType') ||
            BasiGX.util.Object.layersFromParams(
                view.queryLayer.getSource().getParams()
            );

        if (!Ext.isEmpty(geometry)) {
            var filter = GeoExt.util.OGCFilter.getOgcFilter(
                geomFieldName, view.spatialOperator, geometry, '1.1.0', projString);

            mapComp.setLoading(true);
            BasiGX.util.WFS.executeWfsGetFeature(
                url,
                view.queryLayer,
                projString,
                null,
                geomFieldName,
                filter,
                null,
                me.onWfsExecuteSuccess,
                me.onWfsExecuteFailure,
                me,
                null,
                featureType
            );
        }
    },

    /**
     * Handle a successful WFS request.
     *
     * @param {XMLHttpRequest.response} response The response of the AJAX call.
     */
    onWfsExecuteSuccess: function (response) {
        var me = this;
        var view = me.getView();
        var mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();
        mapComp.setLoading(false);
        var wfsResponse = response.responseText;
        if (wfsResponse.indexOf('Exception') > 0) {
            // something got wrong and we probably have an exception, that we
            // try to handle...
            BasiGX.util.WFS.handleWfsExecuteException(wfsResponse);
            view.fireEvent('cmv-spatial-query-error', decodedResponse);
        } else {
            var decodedResponse = Ext.decode(wfsResponse);
            view.fireEvent('cmv-spatial-query-success', decodedResponse);
        }
    },

    /**
     * Handle WFS GetFeature failure.
     *
     * @param {XMLHttpRequest.response} response The response of the AJAX call.
     */
    onWfsExecuteFailure: function (response) {
        var me = this;
        var view = me.getView();
        var responseTxt;
        if (response && response.responseText) {
            responseTxt = response.responseText;
        }
        var mapComp = me.mapComponent || BasiGX.util.Map.getMapComponent();
        mapComp.setLoading(false);
        view.fireEvent('cmv-spatial-query-error', responseTxt);
    }
});
