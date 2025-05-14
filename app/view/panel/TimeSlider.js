/**
 * This class is the time slider component of cpsi mapview application
 */
Ext.define('CpsiMapview.view.panel.TimeSlider', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_timeslider',

    requires: ['Ext.slider.Multi', 'CpsiMapview.controller.panel.TimeSlider'],

    controller: 'cmv_timeslider',

    layout: 'hbox',

    /**
     *
     */
    viewModel: {
        data: {
            isRange: false
        }
    },

    /**
     * The selected date (after initialization) as Date object
     */
    selectedDate: null,
    /**
     * The start date of slider
     */
    startDate: null,
    /**
     * The end date of slider
     */
    endDate: null,
    /**
     * The unit of time increment (currently only year and month supported)
     */
    timeIncrementUnit: 'year',
    /**
     * The CSS class of the slider
     */
    cls: 'cpsi-time-slider',
    /**
     * Listener to be called when all layers are added to set configured time
     * to time dependent layers
     */
    listeners: {
        allLayersAdded: 'setTimeOnLayers'
    },

    /**
     *
     */
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'multislider',
                labelAlign: 'right',
                listeners: {
                    beforerender: 'initTimeSlider',
                    changecomplete: 'onChangeComplete'
                },
                constrainThumbs: false,
                tipText: 'getTipText',
                fieldLabel: 'Time',
                width: 400,
                values: [25, 75],
                increment: 1,
                minValue: 0,
                maxValue: 100
            },
            {
                xtype: 'checkbox',
                name: 'range',
                fieldLabel: 'Time range',
                labelAlign: 'right',
                bind: {
                    value: '{isRange}'
                },
                listeners: {
                    change: 'onRangeClick'
                }
            }
        ];

        me.callParent();
    }
});
