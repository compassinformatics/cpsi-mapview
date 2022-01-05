/**
 * This class is the controller for the map view of cpsi mapview
 *
 */
Ext.define('CpsiMapview.controller.MapController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_map',

    requires: [
        'BasiGX.util.Map'
    ],

    mixins: {
        editWindowOpenerMixin: 'CpsiMapview.util.EditWindowOpenerMixin'
    },

    /**
    * A configuration object to store settings relating to opening forms when clicking on a feature.
    * This should be overridden in inherited projects and should be in the following form:
    *
    * {
    *   layerKeyName: {
    *       keyField: 'ObjectId', // the field containing the unique feature Id to open in a form
    *       modelClass: 'CpsiMapview.model.ModelName', // the name of the class used to load a model
    *       editWindowClass: 'CpsiMapview.view.EditWindow' // the name of the form view class to open when clicking on a feature
    *   }
    * }
    *
    * Multiple configurations can be provided to support clicks on multiple layers
    */
    clickableLayerConfigs: {},

    /**
     * Handle map clicks so data entry forms can be opened by clicking directly
     * on vector features
     * @param {any} clickedFeatures
     */
    onMapClick: function (clickedFeatures) {

        var feat, recId;
        var me = this;

        // avoid opening the form if another tool is active (see CpsiMapview.util.ApplicationMixin)
        var map = me.getView().map;
        if (map.get('defaultClickEnabled') === false) {
            return;
        }

        // filter out any features without the layer we want
        var editableFeatures = [];

        Ext.each(clickedFeatures, function (f) {
            if (f.layer) {
                var layerKey = f.layer.get('layerKey');
                if (Object.prototype.hasOwnProperty.call(me.clickableLayerConfigs, layerKey)) {
                    editableFeatures.push(f);
                }
            }
        });

        if (editableFeatures.length > 0) {
            var editableFeature = editableFeatures[0].feature; // get the first feature
            var selectedLayerKey = editableFeatures[0].layer.get('layerKey'); // get layer for feature

            var featureCluster = editableFeature.getProperties().features;

            if (featureCluster) {
                feat = featureCluster[0];
            } else {
                feat = editableFeature;
            }

            // get the window and model types
            var keyField = me.clickableLayerConfigs[selectedLayerKey].keyField;
            var modelClass = me.clickableLayerConfigs[selectedLayerKey].modelClass;
            var editWindowClass = me.clickableLayerConfigs[selectedLayerKey].editWindowClass;

            var modelPrototype = Ext.ClassManager.get(modelClass);

            recId = feat.get(keyField);

            // now load the full record in the appropriate form
            modelPrototype.load(recId, {
                success: function (rec) {
                    // check if the window is already open
                    var win = me.getEditingFormWindow(rec, editWindowClass);
                    var vm = win.getViewModel();
                    vm.set('currentRecord', rec);
                    win.show();
                }
            });

            return false; // stop other map handlers
        }
    },

    /**
     * Function called after render of map component
     */
    afterMapRender: function () {
        var me = this;
        var mapPanel = me.getView();

        if (mapPanel.addScaleBarToMap) {
            var removeCtrls = [];
            // Cleanup existing controls first
            mapPanel.olMap.getControls().forEach(function (ctrl) {
                if (ctrl instanceof ol.control.ScaleLine) {
                    removeCtrls.push(ctrl);
                }
            });
            Ext.each(removeCtrls, function (removeCtrl) {
                mapPanel.olMap.removeControl(removeCtrl);
            });

            var sbTarget = (mapPanel.body && mapPanel.body.dom) ?
                mapPanel.body.dom :
                mapPanel.getEl().dom;
            var scaleLineCtrl = new ol.control.ScaleLine({
                target: sbTarget
            });
            mapPanel.olMap.addControl(scaleLineCtrl);
        }
    }
});
