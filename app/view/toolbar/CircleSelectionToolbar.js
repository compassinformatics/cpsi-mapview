/**
 * This class is the circle selection toolbar of cpsi mapview application
 * It can be used e.g. for manipulating the radius of a drawn circle
 * and using that circle for filtering features.
 */
/**
 * Circle Selection Toolbar
 *
 * @class CpsiMapview.view.toolbar.CircleSelectionToolbar
 */
Ext.define('CpsiMapview.view.toolbar.CircleSelectionToolbar', {
    extend: 'Ext.toolbar.Toolbar',

    xtype: 'cmv_circle_selection_toolbar',

    requires: [
        'Ext.form.field.Number',
        'CpsiMapview.controller.toolbar.CircleSelectionToolbar',
        'CpsiMapview.model.toolbar.CircleSelectionToolbar'
    ],

    viewModel: 'cmv_circle_selection_toolbar',

    controller: 'cmv_circle_selection_toolbar',

    cls: 'cmv_circle_selection_toolbar',

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
            enableKeyEvents: true, // required for keypress event
            listeners: {
                change: 'onRadiusChange',
                keypress: 'handleEnterKey'
            }
        },
        {
            xtype: 'button',
            text: 'Apply',
            handler: 'handleApply',
            bind: {
                disabled: '{!radius}'
            }
        },
        {
            xtype: 'button',
            text: 'Cancel',
            handler: 'handleCancel'
        }
    ]
});
