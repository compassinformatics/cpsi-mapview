/**
 * This is the controller for the timeslider component
 */
Ext.define('CpsiMapview.controller.panel.TimeSlider', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_timeslider',

    requires: [
        'CpsiMapview.util.Layer'
    ],

    /**
     * Function to initialize the time slider called after render
     * @param {Ext.slider.Multi} slider The slider to initialize
     */
    initTimeSlider: function (slider) {
        var me = this;
        var timeSliderCmp = slider.up('cmv_timeslider');
        var startDate = timeSliderCmp.startDate;
        var endDate = timeSliderCmp.endDate;
        var selectedDate = timeSliderCmp.selectedDate;
        var timeIncrementUnit = timeSliderCmp.timeIncrementUnit || 'year';
        var isRange = me.getViewModel().get('isRange');

        if (!startDate || !endDate) {
            Ext.log.warn('Please provide valid start / end date.');
            return;
        }

        var timeRangeObj = me.getTimeRangeForDate(startDate, endDate,
            selectedDate, timeIncrementUnit, isRange);

        slider.setMaxValue(timeRangeObj.maxValue);
        slider.setMinValue(timeRangeObj.minValue);
        var values = [timeRangeObj.rangeLower, timeRangeObj.rangeUpper];
        slider.setValue(values);

        // hide thumb if range is noit checked
        if (!isRange) {
            slider.thumbs[1].disable();
        }
    },

    /**
     * Function to set the time to time dependent layers after slider initialization
     * @param {Ext.slider.Multi} slider The time slider component
     */
    setTimeOnLayers: function (slider) {
        var me = this;
        var isRange = me.getViewModel().get('isRange');
        this.onTimeChanged(slider, isRange);
    },

    /**
     * Time slider changeComplete handler
     * @param {Ext.slider.Multi} slider The time slider component
     */
    onChangeComplete: function (slider) {
        var me = this;
        var isRange = me.getViewModel().get('isRange');
        me.onTimeChanged(slider, isRange);
    },

    /**
     * Function called in time slider changes
     * @param {Ext.slider.Multi} slider The slider
     */
    onTimeChanged: function (slider, isRange) {
        var me = this;
        var values = slider.getValues();
        var timeLayers = CpsiMapview.util.Layer.getTimeDependentLayers();
        // TODO: WFS layers must be filtered
        Ext.each(timeLayers, function (layer) {
            if (layer && (layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol.source.ImageWMS)) {
                var wmsLayerSource = layer.getSource();
                if (wmsLayerSource) {
                    wmsLayerSource.updateParams({
                        TIME: me.formatWmsDateString(values, isRange)
                    });
                }
            }
        });
    },

    /**
     * Function formatting the values array of multi-slider to a valid time
     * parameter value
     *
     * @param {Number[]} values The slider values
     * @param {Boolean} isRange Is range query or not
     *
     * @returns {String} The formatted time string
     */
    formatWmsDateString: function (values, isRange) {
        var me = this;
        // we must check for min / max here since the thumbs are not contrained
        var startDateStr = me.getDateStringForSliderValue(Ext.Array.min(values));
        var endDateStr = me.getDateStringForSliderValue(Ext.Array.max(values));
        // TODO: format can be layer dependent....
        return Ext.String.format('{0}/{1}', startDateStr, isRange ? endDateStr : startDateStr);
    },

    /**
     * Function to generate tooltip text for slider
     *
     * @param {Ext.slider.Thumb} thumb The thumb that the tip is attached to
     * @return {String} The formatted date as text
     */
    getTipText: function (thumb) {
        return this.getDateStringForSliderValue(thumb.value);
    },

    /**
     * Function that returns formatted date string for passed slider value
     *
     * @param {Number} sliderValue The value of the slider
     * @return {String} The formatted date as text
     */
    getDateStringForSliderValue: function (sliderValue) {
        var me = this;
        var view = me.getView();
        var timeIncrementUnit = view.timeIncrementUnit || 'year';
        var dateFormat = '';
        switch (timeIncrementUnit) {
        case 'month':
            dateFormat = 'm/Y';
            break;
        default:
            dateFormat = 'Y';
        }
        return Ext.Date.format(
            me.getDateForSliderValue(sliderValue),
            dateFormat
        );
    },

    /**
     * Function that returns the date vor passed slider value
     *
     * @param {Number} sliderValue The value of the slider
     * @return {Date} The date
     */
    getDateForSliderValue: function (sliderValue) {
        var me = this;
        var view = me.getView();
        var timeIncrementUnit = view.timeIncrementUnit || 'year';
        switch (timeIncrementUnit) {
        case 'month':
            var month = sliderValue % 12;
            var year = (sliderValue - month) / 12;
            return new Date(1900 + year, month, 1);
        default:
            return new Date(1900 + sliderValue, 0, 1);
        }
    },

    /**
     * Map the start date, the enddate and the currently selected date to
     * valid values for the slider component
     *
     * @param {Date} startDate The starting date
     * @param {Date} endDate The date the slider value should end
     * @param {Date} selDate The currently selected date
     * @param {String} timeIncrementUnit The time increment ('year' or 'month')
     * @param {Boolean} isRange Is a time range chosen
     *
     * @return {Object} Object containing minValue, maxValue and value to be
     * set in viewModel, for example
     */
    getTimeRangeForDate: function (startDate, endDate, selDate,
        timeIncrementUnit, isRange) {
        // round + floor time to next time unit passed for discretization
        // => maxValue
        // get value for selected date => update viewModel
        var minValue = 0;
        var maxValue = 100;
        switch (timeIncrementUnit) {
        case 'month':
            minValue = Ext.Date.getFirstDateOfMonth(startDate).getYear()
                    * 12 + Ext.Date.getFirstDateOfMonth(startDate).getMonth();
            maxValue = Ext.Date.getLastDateOfMonth(endDate).getYear()
                    * 12 + Ext.Date.getLastDateOfMonth(endDate).getMonth();
            break;
        default:
            minValue = startDate.getYear();
            maxValue = endDate.getYear();
            break;
        }

        // use passed starting date if selected date is not set
        if (!selDate) {
            selDate = startDate;
        }

        var rangeLower = 50;
        var rangeUpper = 50;
        switch (timeIncrementUnit) {
        case 'month':
            var value = Ext.Date.getFirstDateOfMonth(selDate).getYear()
                    * 12 + Ext.Date.getFirstDateOfMonth(selDate).getMonth();
            rangeLower = value;
            rangeUpper = isRange ? value + 1 : maxValue;
            break;
        default:
            value = selDate.getYear();
            rangeLower = value;
            rangeUpper = isRange ? value + 1 : maxValue;
            break;
        }

        return {
            minValue: minValue,
            maxValue: maxValue,
            rangeLower: rangeLower,
            rangeUpper: rangeUpper
        };
    },

    /**
     * Change handler for range checkbox. This enables / disabled the second
     * thumb
     *
     * @param {Ext.form.field.Checkbox} cb The checkbox
     * @param {Boolean} isRange The new value
     */
    onRangeClick: function (cb, isRange) {
        var timeSliderCmp = cb.up('cmv_timeslider').down('multislider');
        if (isRange) {
            timeSliderCmp.thumbs[1].enable();
        } else {
            timeSliderCmp.thumbs[1].disable();
        }
        this.onTimeChanged(timeSliderCmp, isRange);
    }
});
