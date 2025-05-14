/**
 * This is the controller for the timeslider component
 */
Ext.define('CpsiMapview.controller.panel.TimeSlider', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_timeslider',

    requires: ['BasiGX.util.Layer', 'BasiGX.util.WFS'],

    /**
     * Function to initialize the time slider called after render
     * @param {Ext.slider.Multi} slider The slider to initialize
     */
    initTimeSlider: function (slider) {
        const me = this;
        const timeSliderCmp = slider.up('cmv_timeslider');
        const startDate = timeSliderCmp.startDate;
        const endDate = timeSliderCmp.endDate;
        const selectedDate = timeSliderCmp.selectedDate;
        const timeIncrementUnit = timeSliderCmp.timeIncrementUnit || 'year';
        const isRange = me.getViewModel().get('isRange');

        if (!startDate || !endDate) {
            Ext.log.warn('Please provide valid start / end date.');
            return;
        }

        const timeRangeObj = me.getTimeRangeForDate(
            startDate,
            endDate,
            selectedDate,
            timeIncrementUnit,
            isRange
        );

        slider.setMaxValue(timeRangeObj.maxValue);
        slider.setMinValue(timeRangeObj.minValue);
        const values = [timeRangeObj.rangeLower, timeRangeObj.rangeUpper];
        slider.setValue(values);

        // hide thumb if range is not checked
        if (!isRange) {
            slider.thumbs[1].disable();
        }
    },

    /**
     * Function to set the time to time dependent layers after slider initialization
     * @param {Ext.slider.Multi} slider The time slider component
     */
    setTimeOnLayers: function (slider) {
        const me = this;
        const isRange = me.getViewModel().get('isRange');
        me.onTimeChanged(slider, isRange);
    },

    /**
     * Time slider changeComplete handler
     * @param {Ext.slider.Multi} slider The time slider component
     */
    onChangeComplete: function (slider) {
        const me = this;
        const isRange = me.getViewModel().get('isRange');
        me.onTimeChanged(slider, isRange);
    },

    /**
     * Function called in time slider changes
     * @param {Ext.slider.Multi} slider The slider
     */
    onTimeChanged: function (slider, isRange) {
        const me = this;
        const values = slider.getValues();
        const timeIncrementUnit =
            slider.up('cmv_timeslider').timeIncrementUnit || 'year';
        const timeLayers = BasiGX.util.Layer.getLayersBy(
            'isTimeDependent',
            true
        );
        Ext.each(timeLayers, function (layer) {
            if (layer) {
                let layerSource = layer.getSource();
                const dateFormat = layer.get('dateFormat') || 'C';
                if (
                    layerSource &&
                    (layerSource instanceof ol.source.TileWMS ||
                        layerSource instanceof ol.source.ImageWMS)
                ) {
                    layerSource.updateParams({
                        TIME: me.formatDateString(
                            values,
                            isRange,
                            timeIncrementUnit,
                            dateFormat
                        )
                    });
                }
                if (layerSource instanceof ol.source.Vector) {
                    if (layerSource instanceof ol.source.Cluster) {
                        layerSource = layerSource.getSource();
                    }
                    const timeProperty = layer.get('timeProperty') || 'time';
                    const timeString = me.formatDateString(
                        values,
                        isRange,
                        timeIncrementUnit,
                        dateFormat
                    );
                    const filterParts = BasiGX.util.WFS.getTimeFilterParts(
                        layer,
                        timeProperty,
                        timeString
                    );
                    layerSource.set('timeFilters', filterParts);
                    if (layer.getVisible()) {
                        layerSource.clear(true);
                    }
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
     * @param {String} timeIncrementUnit The unit of time increment (year / month)
     * @param {String} dateFormat The date format as listed in ExtJS documentation
     * https://docs.sencha.com/extjs/6.2.1/classic/Ext.Date.html
     *
     * @returns {String} The formatted time string
     */
    formatDateString: function (
        values,
        isRange,
        timeIncrementUnit,
        dateFormat
    ) {
        const me = this;
        // we must check for min / max here since the thumbs are not constrained
        let startDate = me.getDateForSliderValue(Ext.Array.min(values));
        let endDate = me.getDateForSliderValue(Ext.Array.max(values));

        if (!startDate || !endDate) {
            return;
        }

        // ceil / floor year according to selected interval if month is time increment
        if (timeIncrementUnit === 'month') {
            startDate = Ext.Date.getFirstDateOfMonth(startDate);
            endDate = Ext.Date.getLastDateOfMonth(endDate);
        } else {
            // last day of year
            endDate = new Date(
                !isRange ? startDate.getFullYear() : endDate.getFullYear(),
                11,
                31
            );
        }

        const startDateStr = Ext.Date.format(startDate, dateFormat);
        const endDateStr = Ext.Date.format(endDate, dateFormat);
        return Ext.String.format('{0}/{1}', startDateStr, endDateStr);
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
        const me = this;
        const view = me.getView();
        const timeIncrementUnit = view.timeIncrementUnit || 'year';
        let dateFormat = '';
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
        const me = this;
        const view = me.getView();
        const timeIncrementUnit = view.timeIncrementUnit || 'year';
        switch (timeIncrementUnit) {
            case 'month': {
                const month = sliderValue % 12;
                const year = (sliderValue - month) / 12;
                return new Date(1900 + year, month, 1);
            }
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
    getTimeRangeForDate: function (
        startDate,
        endDate,
        selDate,
        timeIncrementUnit,
        isRange
    ) {
        // round + floor time to next time unit passed for discretization
        // => maxValue
        // get value for selected date => update viewModel
        let minValue = 0;
        let maxValue = 100;
        switch (timeIncrementUnit) {
            case 'month':
                minValue =
                    Ext.Date.getFirstDateOfMonth(startDate).getYear() * 12 +
                    Ext.Date.getFirstDateOfMonth(startDate).getMonth();
                maxValue =
                    Ext.Date.getLastDateOfMonth(endDate).getYear() * 12 +
                    Ext.Date.getLastDateOfMonth(endDate).getMonth();
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

        let rangeLower = 50;
        let rangeUpper = 50;
        let value;
        switch (timeIncrementUnit) {
            case 'month':
                value =
                    Ext.Date.getFirstDateOfMonth(selDate).getYear() * 12 +
                    Ext.Date.getFirstDateOfMonth(selDate).getMonth();
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
        const timeSliderCmp = cb.up('cmv_timeslider').down('multislider');
        if (isRange) {
            timeSliderCmp.thumbs[1].enable();
        } else {
            timeSliderCmp.thumbs[1].disable();
        }
        this.onTimeChanged(timeSliderCmp, isRange);
    }
});
