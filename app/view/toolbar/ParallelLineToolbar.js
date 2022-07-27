/**
 * This class is the toolbar for creating parallel lines.
 * @class CpsiMapview.view.toolbar.ParallelLine
 */
Ext.define('CpsiMapview.view.toolbar.ParallelLine', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_parallel_line_toolbar',

    requires: [
        'Ext.form.field.Number',
        'BasiGX.view.component.Map'
    ],

    cls: 'cmv_parallel_line_toolbar',

    viewModel: {
        data: {
            offsetLabel: 'Offset',
            parallelTooltip: 'Create parallel line',
            offset: 0,
            feature: null,
            parallelFeature: null
        }
    },

    name: null,

    /**
     * @event parallelLineCreated
     * Fires, when a new parallel line was created.
     * @param {ol.Feature} parallelFeature The created parallel feature.
     */

    config: {
        /**
         * The feature to create the parallel line for.
         */
        feature: null,
        /**
         * The unit to use for calculating the offset. Can be one of
         * 'degrees', 'radians', 'miles', 'kilometers', 'inches',
         * 'yards', 'meters'.
         *
         * Defaults to 'meters'.
         */
        offsetUnit: 'meters'
    },

    items: [{
        xtype: 'numberfield',
        bind: {
            fieldLabel: '{offsetLabel}',
            value: '{offset}',
        },
        listeners: {
            change: function () {
                var toolbar = this.up('cmv_parallel_line_toolbar');

                var vm = toolbar.getViewModel();
                if (!vm) {
                    return;
                }
                var parallelFeature = vm.get('parallelFeature');
                if (!parallelFeature) {
                    return;
                }

                toolbar.createParallelFeature();
            }
        }
    }, {
        glyph: 'ea50@font-gis',
        bind: {
            tooltip: '{parallelTooltip}',
            disabled: '{!feature}'
        },
        handler: function() {
            var toolbar = this.up('cmv_parallel_line_toolbar');
            toolbar.createParallelFeature();
        }
    }],

    applyFeature: function (feature) {
        if (!feature) {
            return;
        }
        var geometry = feature.getGeometry();
        if (!geometry) {
            console.warn('Feature has no geometry.');
            return;
        }

        var geomType = geometry.getType();
        if (geomType !== 'LineString' && geomType !== 'MultiLineString') {
            console.warn('Unsupported feature geometry. Geometry must be of type "LineString" or "MultiLineString".');
            return;
        }
        return feature;
    },

    updateFeature: function (newFeature) {
        var vm = this.getViewModel();
        if (!vm) {
            return;
        }
        vm.set('feature', newFeature);
        vm.set('parallelFeature', null);
    },

    applyOffsetUnit: function (offsetUnit) {
        if (!offsetUnit) {
            console.warn('offsetUnit is empty or undefined');
            return;
        }
        var supportedUnits = [
            'degrees', 'radians', 'miles', 'kilometers', 'inches',
            'yards', 'meters'
        ];
        if (supportedUnits.indexOf(offsetUnit) === -1) {
            console.warn(
                'Provided offsetUnit not supported. Must be one of: ' + supportedUnits
            );
            return;
        }
        return offsetUnit;
    },

    /**
     * Creates a parallel line for the given feature with given offset.
     *
     * Fires the parallelLineCreated event.
     *
     * @returns {void}
     */
    createParallelFeature: function() {
        var vm = this.getViewModel();
        if (!vm) {
            return;
        }
        var feature = vm.get('feature');
        if (!feature) {
            return;
        }

        var offset = vm.get('offset');
        if (offset === null) {
            return;
        }

        var offsetUnit = this.getOffsetUnit();
        var map = BasiGX.view.component.Map.guess().getMap();
        var mapProj = map.getView().getProjection().getCode();
        var format = new ol.format.GeoJSON({
            featureProjection: mapProj,
            dataProjection: 'EPSG:4326'
        });
        var geojsonFeature = format.writeFeatureObject(feature);
        var parallelGeojsonFeature = turf.lineOffset(
            geojsonFeature.geometry, offset, {units: offsetUnit}
        );
        var parallelFeature = format.readFeature(parallelGeojsonFeature);
        vm.set('parallelFeature', parallelFeature);
        this.fireEvent('parallelLineCreated', parallelFeature);
    }
});
