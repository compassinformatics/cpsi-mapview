/**
 * This is the controller for the timeslider component
 */
Ext.define('CpsiMapview.controller.panel.TimeSlider', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_timeslider',

    /**
     * Function to initialize the time slider called after render
     * @param {Ext.slider.Single | Ext.slider.Multi} slider The slider to
     *                                                      initialize
     */
    initTimeSlider: function (slider) {
        var me = this;
        var viewModel = me.getViewModel();
        var timeSliderCmp = slider.up('cmv_timeslider');
        var startDate = timeSliderCmp.startDate;
        var endDate = timeSliderCmp.endDate;
        var selectedDate = timeSliderCmp.selectedDate;
        var timeIncrementUnit = timeSliderCmp.timeIncrementUnit || 'year';

        if (!startDate || !endDate) {
            Ext.log.warn('Please provide valid start / end date.');
            return;
        }

        var timeRangeObj = me.getTimeRangeForDate(startDate, endDate,
            selectedDate, timeIncrementUnit);

        slider.setMaxValue(timeRangeObj.maxValue);
        slider.setMinValue(timeRangeObj.minValue);

        viewModel.setData({
            timeRangeObj: timeRangeObj
        });
    },

    /**
     * Function called in time slider changes
     * @param {Ext.slider.Single | Ext.slider.Multi} slider The slider
     * @param {Number} value The new value of the slider
     */
    onTimeChanged: function (slider, value) {
        // TODO: WFS layers must be filtered
        var me = this;
        var layerNames = me.getView().layerNames;
        Ext.each(layerNames, function (layerName) {
            var layer = BasiGX.util.Layer.getLayerByName(layerName);
            if (layer && (layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol.source.ImageWMS)) {
                var wmsLayerSource = layer.getSource();
                var sliderDate = me.getDateForSliderValue(value);
                if (wmsLayerSource && sliderDate) {
                    wmsLayerSource.updateParams({
                        TIME: Ext.Date.format(sliderDate, 'c')
                    });
                }
            }
        });
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
     *
     * @return {Object} Object containing minValue, maxValue and value to be
     * set in viewModel, for example
     */
    getTimeRangeForDate: function (startDate, endDate, selDate,
        timeIncrementUnit) {
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
            maxValue = endDate.getYear() + 1;
            break;
        }

        if (!selDate) {
            selDate = startDate;
        }

        var value = 50;
        switch (timeIncrementUnit) {
        case 'month':
            value = Ext.Date.getFirstDateOfMonth(selDate).getYear()
                    * 12 + Ext.Date.getFirstDateOfMonth(selDate).getMonth();
            break;
        default:
            value = selDate.getYear();
            break;
        }

        return {
            minValue: minValue,
            maxValue: maxValue,
            value: value
        };
    }
});
