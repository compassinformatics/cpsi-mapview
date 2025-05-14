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

    items: [
        {
            xtype: 'numberfield',
            bind: {
                fieldLabel: '{offsetLabel}',
                value: '{offset}'
            },
            listeners: {
                change: function () {
                    const toolbar = this.up('cmv_parallel_line_toolbar');

                    const vm = toolbar.getViewModel();
                    if (!vm) {
                        return;
                    }
                    const parallelFeature = vm.get('parallelFeature');
                    if (!parallelFeature) {
                        return;
                    }

                    toolbar.createParallelFeature();
                }
            }
        },
        {
            iconCls: 'fg-copy-line',
            bind: {
                tooltip: '{parallelTooltip}',
                disabled: '{!feature}'
            },
            handler: function () {
                const toolbar = this.up('cmv_parallel_line_toolbar');
                toolbar.createParallelFeature();
            }
        }
    ],

    applyFeature: function (feature) {
        if (!feature) {
            return;
        }
        const geometry = feature.getGeometry();
        if (!geometry) {
            Ext.log.warn('Feature has no geometry.');
            return;
        }

        const geomType = geometry.getType();
        if (geomType !== 'LineString' && geomType !== 'MultiLineString') {
            Ext.log.warn(
                'Unsupported feature geometry. Geometry must be of type "LineString" or "MultiLineString".'
            );
            return;
        }
        return feature;
    },

    updateFeature: function (newFeature) {
        const vm = this.getViewModel();
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
        const supportedUnits = [
            'degrees',
            'radians',
            'miles',
            'kilometers',
            'inches',
            'yards',
            'meters'
        ];
        if (supportedUnits.indexOf(offsetUnit) === -1) {
            Ext.log.warn(
                'Provided offsetUnit not supported. Must be one of: ' +
                    supportedUnits
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
    createParallelFeature: function () {
        const vm = this.getViewModel();
        if (!vm) {
            return;
        }
        const feature = vm.get('feature');
        if (!feature) {
            return;
        }

        const offset = vm.get('offset');
        if (offset === null) {
            return;
        }

        const map = BasiGX.view.component.Map.guess().getMap();
        if (!map) {
            return;
        }

        const offsetUnit = this.getOffsetUnit();
        const turfUtil = CpsiMapview.util.Turf;
        const parallelFeature = turfUtil.createParallelFeature(
            map,
            feature,
            offset,
            offsetUnit
        );
        vm.set('parallelFeature', parallelFeature);
        this.fireEvent('parallelLineCreated', parallelFeature);
    }
});
