Ext.define('CpsiMapview.view.snappingExample.EdgeWindow', {
    extend: 'CpsiMapview.view.window.MinimizableWindow',
    xtype: ['cmv_edgewindow'],
    requires: [
        'Ext.tab.Panel',
        'CpsiMapview.view.snappingExample.EdgeWindowController',
        'CpsiMapview.view.snappingExample.EdgeWindowViewModel',
        'CpsiMapview.view.tool.DrawingButton',
        'CpsiMapview.form.RightInfoField'
    ],
    controller: 'cmv_edgewindowcontroller',
    viewModel: {
        type: 'cmv_edgewindowviewmodel'
    },
    mixins: {
        editFormMixin: 'CpsiMapview.form.ViewMixin'
    },
    title: 'Snapping Example',
    modelValidation: true,
    width: 580,
    height: 360,
    resizable: false,
    maximizable: true,
    frame: false,
    border: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    customButtons: [
        {
            index: 2,
            button: {
                xtype: 'cmv_drawing_button',
                itemId: 'drawNetworkEdge',
                text: 'Draw Edge',
                toggleGroup: 'map',
                iconCls: 'icon-line3',
                glyph: null,
                tooltip: 'Create new features to join the network',
                bind: {
                    drawLayer: '{resultLayer}' // bind the draw layer to the model's featurestore / layer
                },
                snappingLayerKeys: ['EDGES_WFS', 'NODES_WFS', 'POLYGONS_WFS'],
                tracingLayerKeys: ['EDGES_WFS', 'POLYGONS_WFS'],
                nodeLayerKey: 'NODES_WFS',
                edgeLayerKey: 'EDGES_WFS',
                polygonLayerKey: 'POLYGONS_WFS'
            }
        }
    ],

    items: [{
        xtype: 'tabpanel',
        anchor: '100% 100%',
        defaults: {
            padding: '5 5 5 5'
        },
        items: [
            {
                tabConfig: {
                    title: 'General'
                },
                layout: {
                    type: 'anchor',
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Details',
                        anchor: '100%',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        items: [{
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'Start Node ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.startNodeId}'
                                }
                            }
                        },
                        {
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'End Node ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.endNodeId}'
                                }
                            }
                        },
                        {
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'Start Edge ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.startEdgeId}'
                                }
                            }
                        },
                        {
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'End Edge ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.endEdgeId}'
                                }
                            }
                        },
                        {
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'Start Polygon ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.startPolygonId}'
                                }
                            }
                        },
                        {
                            xtype: 'cmv_rightinfofield',
                            colspan: 1,
                            width: 300,
                            field: {
                                xtype: 'displayfield',
                                labelWidth: 100,
                                width: 200,
                                fieldLabel: 'End Polygon ID',
                                infoIconTooltip: 'Database Identifier',
                                bind: {
                                    value: '{currentRecord.endPolygonId}'
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            colspan: 2,
                            width: 300,
                            value: 'Hold down CTRL to modify vertices'
                        }
                        ]
                    }
                ]
            }
        ]
    }
    ]
});
