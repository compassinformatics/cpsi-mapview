Ext.define('CpsiMapview.controller.panel.NumericAttributeSlider', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_numericattributeslider',

    /**
     * Initially filter if enabled.
     */
    initSlider: function() {
        if (this.getView().getEnabled()) {
            this.applySliderEffects();
        }
    },

    /**
     * Returns those layers that the slider will affect.
     */
    getAffectedLayers: function() {
        return BasiGX.util.Layer.getLayersBy('isNumericDependent', true);
    },

    /**
     * Orders the values of the slider so that the first index always is the
     * lower value, and the second is at least equally big.
     * @param {number[]} values
     */
    orderValues: function(values) {
        var lower = Math.min(values[0], values[1]);
        var upper = Math.max(values[0], values[1]);
        return [lower, upper];
    },

    /**
     * Returns the current range of the slider as tooltip.
     * @param {Ext.slider.Thumb} thumb
     */
    getTipText: function(thumb) {
        var slider = thumb.slider;
        var draggedValue = thumb.value;
        var thumbIdx = thumb.index;
        var otherThumb = slider.thumbs[thumbIdx == 0 ? 1 : 0];
        var lowerThumb = otherThumb.value <= draggedValue ? otherThumb : thumb;
        var upperThumb = lowerThumb === thumb ? otherThumb : thumb;
        var lower = lowerThumb.value;
        var upper = upperThumb.value;
        if (lower === draggedValue) {
            lower = '<strong>' + lower + '</strong>';
        }
        if (upper === draggedValue) {
            upper = '<strong>' + upper + '</strong>';
        }
        return lower + ' - ' + upper;
    },

    /**
     * Handles the changing of the checked state of the active-checkbox.
     * @param {Ext.form.field.Checkbox} cb
     * @param {boolean} checked
     */
    onCheckChange: function(cb, checked) {
        var slider = cb.up().down('multislider');
        if(slider) {
            slider.setDisabled(!checked);
        }
        if(checked) {
            this.applySliderEffects();
        } else {
            this.removeSliderEffects();
        }
    },

    /**
     * Applies the effect of the slider, e.g. filters by the numeric values.
     */
    applySliderEffects: function() {
        var me = this;
        var view = me.getView();
        var slider = view.down('multislider');
        var orderedVals = me.orderValues(slider.getValues());
        var layers = me.getAffectedLayers();
        var fieldName = view.getNumericField();
        // between-filter is also inclusive
        var gteFilter = GeoExt.util.OGCFilter.getOgcFilter(
            fieldName, 'gte', orderedVals[0], '2.0.0'
        );
        var lteFilter = GeoExt.util.OGCFilter.getOgcFilter(
            fieldName, 'lte', orderedVals[1], '2.0.0'
        );
        var combined = GeoExt.util.OGCFilter.combineFilters(
            [gteFilter, lteFilter], 'And', false
        );

        Ext.each(layers, function(layer) {
            var source = layer.getSource();
            if (source instanceof ol.source.Cluster) {
                source = source.getSource();
            }
            if (layer.get('isWfs')) {
                source.set('numericFilters', combined);
                source.clear();
                source.refresh();
            } else if (layer.get('isWms')) {
                // What about existing FILTER in params?
                // same goes for the case when we remove the filter, see below.
                // …Replace any existing filters for now
                source.updateParams({
                    'FILTER': combined
                });
            }
        });
    },

    /**
     * Removes the effects of the slider, e.g. unfilters by the numeric values.
     */
    removeSliderEffects: function () {
        this.getAffectedLayers();
        var layers = this.getAffectedLayers();
        Ext.each(layers, function(layer) {
            var source = layer.getSource();
            if (source instanceof ol.source.Cluster) {
                source = source.getSource();
            }
            if (layer.get('isWfs')) {
                source.set('numericFilters', null);
                source.clear();
                source.refresh();
            } else if (layer.get('isWms')) {
                // …unset any existing filters for now
                source.updateParams({
                    'FILTER': undefined
                });
            }
        });
    }
});
