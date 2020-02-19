/**
 * This class is the circle selection of cpsi mapview application
 * It can be used e.g. for the zone tool
 */
/**
 * Circle Selection
 *
 * @class CpsiMapview.view.toolbar.CircleSelection
 */
Ext.define('CpsiMapview.view.toolbar.CircleSelection', {
    extend: 'Ext.toolbar.Toolbar',

    xtype: 'cmv_circle_selection_toolbar',

    requires: [
        'Ext.form.field.Number',
        'CpsiMapview.controller.toolbar.CircleSelectionController',
        'CpsiMapview.model.toolbar.CircleSelection'
    ],

    viewModel: 'cmv_circle_selection_toolbar',

    controller: 'cmv_circle_selection_toolbar',

    name: 'circleSelectionTool',

    dock: 'top',

    /**
     * ol circle feature that will be manipulated by toolbar
     */
    feature: null,

    items: [
        {
            xtype: 'numberfield',
            name: 'circleRadius',
            bind: {
                value: '{radius}',
                fieldLabel: 'Radius in {unit}'
            },
            minValue: 0,
            listeners: {
                change: 'onRadiusChange'
            }
        }, {
            xtype: 'button',
            text: 'Apply',
            handler: 'handleApply'
        }, {
            xtype: 'button',
            text: 'Cancel',
            handler: 'handleCancel'
        }
    ]
});
