/**
 * TODO: !!!
 */
Ext.define('CpsiMapview.controller.button.SpatialQueryButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_spatial_query_btn',

    findQueryLayer: function () {
        var me = this;
        var view = me.getView();
        // get query layer
        if (!view.queryLayer && view.queryLayerName) {
            view.queryLayer = BasiGX.util.Layer.
                getLayerByName(view.queryLayerName);
        }
    },

    /**
     * Activates #drawSelectPolygonInteraction on button toggle to draw polygon
     * selection geometry that will be used for filtering.
     *
     * @param {Ext.button.Button} btn The toggled select by polygon button.
     * @param {Boolean} pressed The toggle state.
     */
    onSpatialQueryBtnToggle: function (btn, pressed) {
        var me = this;
        var view = me.getView();

        if (!view.queryLayer) {
            me.findQueryLayer();
        }

        var geometryFunction;
        var type = view.drawGeometryType;
        if (view.spatialOperator === 'bbox') {
            type = 'Circle';
            geometryFunction = ol.interaction.Draw.createBox();
        }

        if (!me.drawSelectPolygonInteraction) {
            me.drawSelectPolygonInteraction = new ol.interaction.Draw({
                features: view.queryFeature,
                geometryFunction: geometryFunction,
                type: type
            });
            me.drawSelectPolygonInteraction.on(
                'drawstart', me.removeExistingDrawings, me
            );
            view.map.addInteraction(me.drawSelectPolygonInteraction);
        }
        if (pressed) {
            me.drawSelectPolygonInteraction.setActive(true);
            view.queryFeature.on('add', me.getGeometryFromPolygon, me);
        } else {
            me.drawSelectPolygonInteraction.setActive(false);
            view.queryFeature.un('add', me.getGeometryFromPolygon, me);
        }
    },

    /**
     * A utility method that will remove existing drawings of the vectorlayer.
     * Bound e.g. as handler for 'drawstart' events (so we always only have one
     * feature in the layer), when the window closes etc.
     */
    removeExistingDrawings: function () {
        var view = this.getView();
        var layer = view && view.selectVectorLayer;
        var source = layer && layer.getSource();
        if (source) {
            source.clear();
        }
    },

    /**
     * Help method to create a polygon geometry from drawn irregular polygon.
     *
     * @param {Ext.Event} evt The add-Event containing drawn feature
     */
    getGeometryFromPolygon: function (evt) {
        var geometry = evt.element.getGeometry();
        this.getGeometryFromFeature(geometry);
    },

    /**
     * Help method to get a geometry from drawn feature that should be used
     * as basis for geometric filtering.
     *
     * If buffer value is greater as 0, the buffer will be applied on the drawn
     * geometry before filter is created.
     *
     * @param {ol.geom.Geometry} feature The feature to get the geometry from.
     */
    getGeometryFromFeature: function (geometry) {
        var me = this;
        var view = me.getView();
        if (!view.queryLayer) {
            return;
        }
        var mapComp = BasiGX.util.Map.getMapComponent();
        var projString = mapComp.getMap().getView().getProjection().getCode();
        var geomFieldName = view.queryLayer.get('geomFieldName') ||
            view.queryLayer.getSource().get('geomFieldName') ||
            'the_geom';
        var url = view.queryLayer.get('url') ||
            view.queryLayer.getSource().getUrl() ||
            view.queryLayer.getSource().getUrls()[0];

        var featureType = view.queryLayer.get('featureType') ||
            view.queryLayer.getSource().getParams()['LAYERS'];

        if (!Ext.isEmpty(geometry)) {
            var filter = GeoExt.util.OGCFilter.getOgcFilter(
                geomFieldName, view.spatialOperator, geometry, '1.1.0', projString);

            BasiGX.util.Map.getMapComponent().setLoading(true);
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
        BasiGX.util.Map.getMapComponent().setLoading(false);
        var wfsResponse = response.responseText;
        if (wfsResponse.indexOf('Exception') > 0) {
            me.removeExistingDrawings();
            // something got wrong and we probably have an exception, that we
            // try to handle...
            BasiGX.util.WFS.handleWfsExecuteException(wfsResponse);
            view.fireEvent('cmv-spatial-query-error', decodedResponse);
        } else {
            var decodedResponse = Ext.decode(wfsResponse);
            view.fireEvent('cmv-spatial-query-success', decodedResponse);
            me.removeExistingDrawings();
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
        me.removeExistingDrawings();
        BasiGX.util.Map.getMapComponent().setLoading(false);
        view.fireEvent('cmv-spatial-query-error', responseTxt);
    }
});
