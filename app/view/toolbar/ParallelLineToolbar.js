/**
 * This class is the toolbar for creating parallel lines.
 * @class CpsiMapview.view.toolbar.ParallelLineToolbar
 */
Ext.define('CpsiMapview.view.toolbar.ParallelLineToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'cmv_parallel_line_toolbar',

    requires: [
        'Ext.form.field.Number',
        'BasiGX.view.component.Map',
        'CpsiMapview.util.Turf'
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
            Ext.log.warn('Feature has no geometry.');
            return;
        }

        var geomType = geometry.getType();
        if (geomType !== 'LineString' && geomType !== 'MultiLineString') {
            Ext.log.warn('Unsupported feature geometry. Geometry must be of type "LineString" or "MultiLineString".');
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
            Ext.log.warn('offsetUnit is empty or undefined');
            return;
        }
        var supportedUnits = [
            'degrees', 'radians', 'miles', 'kilometers', 'inches',
            'yards', 'meters'
        ];
        if (supportedUnits.indexOf(offsetUnit) === -1) {
            Ext.log.warn(
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

        var map = BasiGX.view.component.Map.guess().getMap();
        if (!map) {
            return;
        }

        var offsetUnit = this.getOffsetUnit();
        var turfUtil = CpsiMapview.util.Turf;
        var parallelFeature = turfUtil.createParallelFeature(map, feature, offset, offsetUnit);
        vm.set('parallelFeature', parallelFeature);
        this.fireEvent('parallelLineCreated', parallelFeature);
    }
});
