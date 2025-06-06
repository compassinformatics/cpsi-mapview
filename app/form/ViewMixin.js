/**
 * To be mixed into any edit form window.
 * Provides default buttons which can be hidden by assigning values to the viewModel
 * @class CpsiMapview.form.ViewMixin
 */
Ext.define('CpsiMapview.form.ViewMixin', {
    extend: 'Ext.Mixin',
    requires: [
        'CpsiMapview.view.button.DigitizeButton',
        'CpsiMapview.view.button.SplitByClickButton'
    ],
    mixinConfig: {
        after: {
            constructor: 'initViewModel',
            initTools: 'addTools' // can use any function name here
        }
    },

    /**
     * **Warning** modifying the this.tools array or using .addTool at any point
     * prior to the initTools function is called causes duplicated tools
     * across all forms using this mixin!
     * This is why a separate function is required.
     * */
    addTools: function () {
        const me = this;

        // depending on the global application flag enableIsLocked
        // hide or show the padlock icon in the window header
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        const addPadlock = app.enableIsLocked;

        if (addPadlock !== false) {
            const toolConfig = {
                xtype: 'tool',
                callback: 'onPadlockClick',
                bind: {
                    hidden: '{!isPadlockVisible}',
                    disabled: '{!canUnlock}',
                    iconCls: '{padlockIcon}',
                    glyph: null,
                    tooltip: '{padlockToolText}'
                }
            };
            me.header.insert(0, toolConfig);
        }
    },

    defaultEditButtons: [
        {
            xtype: 'button',
            itemId: 'deleteButton',
            text: 'Delete',
            handler: 'onDeleteClick',
            tooltip: 'Permanently delete the record',
            bind: {
                hidden: '{hideDeleteButton}',
                disabled: '{!canDelete}',
                text: '{deleteButtonText}' // TODO this never appears to be set. Remove?
            }
        },
        {
            xtype: 'button',
            itemId: 'rejectButton',
            text: 'Reject',
            handler: 'onRejectClick',
            bind: {
                hidden: '{hideRejectButton}',
                disabled: '{!canReject}'
            }
        },
        {
            xtype: 'button',
            itemId: 'exportButton',
            text: 'Export',
            handler: 'onExportClick',
            tooltip:
                'Export the record to Excel (only available for existing records)',
            style: {
                pointerEvents: 'all' // display tooltip even when the button is disabled
            },
            bind: {
                hidden: '{hideExportButton}',
                disabled: '{!canExport}'
            }
        },
        {
            xtype: 'button',
            itemId: 'zoomButton',
            text: 'Zoom',
            handler: 'onZoomClick',
            tooltip: 'Zoom the map to the location of the record',
            bind: {
                hidden: '{hideZoomButton}'
            }
        },
        {
            xtype: 'button',
            itemId: 'refreshButton',
            text: 'Refresh',
            handler: 'onRefreshClick',
            tooltip:
                'Reload the record with the latest data from the server (only available for existing records)',
            style: {
                pointerEvents: 'all' // display tooltip even when the button is disabled
            },
            bind: {
                hidden: '{hideRefreshButton}',
                disabled: '{!canRefresh}'
            }
        },
        {
            xtype: 'cmv_digitize_button',
            itemId: 'segmentDigitiserButton',
            type: 'Point',
            tooltip: 'Create features by clicking points on the road schedule',
            toggleGroup: 'map',
            useContextMenu: false,
            groups: false,
            resetOnToggle: false,
            pointExtentBuffer: 50,
            iconCls: 'fg-polyline-pt',
            drawLayerStyle: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(135,206,250,1)' // circle fill lightskyblue with opacity as last value
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(70, 130, 180)' // steelblue outline of circle
                    })
                })
            }),
            listeners: {
                toggle: 'onDigitizingToolToggle'
            },
            bind: {
                apiUrl: '{networkSolverUrl}',
                disabled: '{isLocked}',
                resultLayer: '{resultLayer}',
                hidden: '{hideDigitiseSegmentButton}'
            }
        },
        {
            xtype: 'cmv_digitize_button',
            itemId: 'areaDigitiserButton',
            type: 'Polygon',
            tooltip:
                'Create features by drawing polygons to select parts of the road schedule',
            toggleGroup: 'map',
            apiUrl: '/WebServices/roadschedule/cutWithPolygon',
            resetOnToggle: false,
            iconCls: 'fg-polygon-pt',
            listeners: {
                toggle: 'onDigitizingToolToggle'
            },
            bind: {
                drawLayer: '{polygonLayer}',
                disabled: '{isLocked}',
                resultLayer: '{resultLayer}',
                hidden: '{hideDigitiseAreaButton}'
            }
        },
        {
            xtype: 'cmv_digitize_button',
            itemId: 'lineDigitiserButton',
            type: 'LineString',
            tooltip: 'Create features by drawing lines',
            toggleGroup: 'map',
            resetOnToggle: false,
            iconCls: 'fg-polyline-pt',
            bind: {
                drawLayer: '{resultLayer}',
                disabled: '{isLocked}',
                resultLayer: '{resultLayer}',
                hidden: '{hideDigitiseLineButton}'
            }
        },
        {
            xtype: 'cmv_digitize_button',
            itemId: 'circleDigitiserButton',
            type: 'Circle',
            tooltip:
                'Create features by drawing circles to select parts of the road schedule',
            toggleGroup: 'map',
            apiUrl: '/WebServices/roadschedule/cutWithPolygon',
            resetOnToggle: false,
            iconCls: 'x-far fa-circle',
            listeners: {
                toggle: 'onDigitizingToolToggle'
            },
            bind: {
                drawLayer: '{polygonLayer}',
                disabled: '{isLocked}',
                resultLayer: '{resultLayer}',
                hidden: '{hideDigitiseCircleButton}'
            }
        },
        {
            xtype: 'cmv_digitize_button',
            itemId: 'pointDigitiserButton',
            type: 'Point',
            tooltip: 'Create points by clicking on the map',
            toggleGroup: 'map',
            resetOnToggle: false,
            iconCls: 'x-far fa-circle',
            bind: {
                drawLayer: '{resultLayer}',
                disabled: '{isLocked}',
                resultLayer: '{resultLayer}',
                hidden: '{hideDigitisePointButton}'
            }
        },
        {
            xtype: 'cmv_split_by_click_button',
            itemId: 'splitByClickButton',
            apiUrl: '/WebServices/roadschedule/publicprivatesplit/split',
            tooltip: 'Split a line by clicking on it',
            bind: {
                disabled: '{isProcessed}',
                resultLayer: '{resultLayer}',
                hidden: '{hideSplitByClickButton}'
            }
        },
        { xtype: 'tbfill' },
        {
            xtype: 'button',
            itemId: 'saveButton',
            text: 'Save',
            handler: 'onSaveClick',
            // Save button tooltips are updated using CpsiMapview.form.ValidationMessagesMixin
            tooltip: 'Save the record',
            bind: {
                disabled: '{!canSave}',
                hidden: '{hideSaveButton}',
                text: '{saveButtonText}'
            }
        },
        {
            xtype: 'button',
            itemId: 'approveButton',
            text: 'Approve',
            handler: 'onApproveClick',
            bind: {
                disabled: '{!canApprove}',
                hidden: '{hideApproveButton}'
            }
        },
        {
            xtype: 'button',
            itemId: 'cancelButton',
            text: 'Cancel',
            handler: 'onCancelClick',
            tooltip: 'Discard any changes without saving and close the window',
            bind: {
                hidden: '{hideCancelButton}'
            }
        },
        {
            xtype: 'button',
            itemId: 'closeButton',
            text: 'Close',
            handler: 'onCloseClick',
            tooltip: 'Close the window',
            bind: {
                hidden: '{hideCloseButton}'
            }
        }
    ],

    initViewModel: function () {
        const me = this;
        const vm = me.getViewModel();

        // apply default button visibility if not set already in the ViewModel

        Ext.applyIf(vm.getData(), {
            hideDeleteButton: false,
            hideExportButton: true,
            hideZoomButton: false,
            hideRefreshButton: true,
            hideDigitiseSegmentButton: true,
            hideDigitiseAreaButton: true,
            hideDigitiseLineButton: true,
            hideDigitiseCircleButton: true,
            hideDigitisePointButton: true,
            hideSplitByClickButton: true,
            hideSaveButton: false,
            hideCancelButton: false,
            hideCloseButton: true,
            hideConfirmButton: true,
            hideRejectButton: true,
            hideApproveButton: true,
            // the CpsiMapview.model.window.MinimizableWindow default helpUrl will be overwritten by the subclasses
            // so reset the default here if required, otherwise the help button always appears
            helpUrl: ''
        });

        let buttons = me.defaultEditButtons;

        // add in any custom buttons from the view
        // this should be an array of objects in the form
        // [{index: 3, button: {xtype: ''...}}]
        if (me.customButtons) {
            buttons = Ext.Array.clone(buttons);
            Ext.each(me.customButtons, function (cfg) {
                Ext.Array.insert(buttons, cfg.index, [cfg.button]);
            });
        }

        me.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            itemId: 'buttonBar',
            items: buttons
        });
    }
});
