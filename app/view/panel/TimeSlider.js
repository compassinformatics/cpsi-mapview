/**
 * This class is the time slider component of cpsi mapview application
 */
Ext.define('CpsiMapview.view.panel.TimeSlider', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_timeslider',

    requires: [
        'Ext.slider.Single',

        'CpsiMapview.controller.panel.TimeSlider'
    ],

    controller: 'cmv_timeslider',

    layout: 'hbox',

    /**
     *
     */
    viewModel: {
        data: {
            timeRangeObj: {
                minValue: 0,
                maxValue: 10,
                value: 5
            },
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
     * The names of the layers that should listen to chages in slider
     */
    layerNames: [],

    /**
     *
     */
    initComponent: function () {
        var me = this;
        me.items = [{
            fieldLabel: 'Time',
            xtype: 'slider',
            labelAlign: 'right',
            flex: 6,
            width: 250,
            listeners: {
                change: 'onTimeChanged',
                afterrender: 'initTimeSlider'
            },
            bind: {
                value: '{timeRangeObj.value}'
            },
            tipText: me.getController().getTipText.bind(me.getController())
        },
        {
            xtype: 'checkbox',
            name: 'range',
            fieldLabel: 'Time range',
            labelAlign: 'right',
            bind: {
                value: '{isRange}'
            }
        }];

        me.callParent();
    }

});
