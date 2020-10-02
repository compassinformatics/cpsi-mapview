Ext.define('CpsiMapview.view.fileupload.FileGrid',
    {
        extend: 'Ext.grid.Panel',
        xtype: 'cmv_filegrid',
        requires: [
            'CpsiMapview.view.grid.ItemDeleter',
            'Ext.util.Format',
            'CpsiMapview.view.fileupload.FileGridController'
        ],
        loadMask: true,
        border: true,
        anchor: '100% 100%',
        multiSelect: true,
        emptyText: 'No files to display',
        reserveScrollOffset: true,
        sortableColumns: false,
        allowAddingAttachments: true,
        controller: 'cmv_filegridcontroller',
        listeners: {
            itemdblclick: 'onDownloadFileClick'
        },
        bind: {
            store: '{files}',
            serviceUrl: '{serviceUrl}'
        },
        config: {
            serviceUrl: ''
        },
        columns: [
            {
                text: 'Name',
                dataIndex: 'name',
                flex: 2
            }, {
                text: 'Description',
                dataIndex: 'description',
                flex: 3
            }, {
                text: 'File',
                dataIndex: 'fileName',
                flex: 2,
                hidden: true
            }, {
                text: 'Size',
                dataIndex: 'fileSize',
                align: 'right',
                renderer: function (value) {
                    return Ext.util.Format.number(value / 1024, '0,000 KB');
                },
                flex: 1,
                hidden: true
            },
            {
                xtype: 'datecolumn',
                text: 'Last Updated',
                dataIndex: 'lastUpdatedDateUtc',
                format: 'd-m-Y',
                width: 100
            },
            {
                xtype: 'cmv_itemdeleter',
                itemId: 'itemDeleter',
                avoidConfirmationRequest: false,
                deleteItemRequiredRole: this.deleteItemRequiredRole
            }
        ],
        tbar: [
            {
                xtype: 'button',
                text: 'Add File',
                itemId: 'addFileButton',
                iconCls: 'add icon-add',
                cls: 'bordered-button',
                infoIconTooltip: this.addFileInfoIconTooltip,
                requiredRole: this.addFileRequiredRole,
                tooltip: Ext.String.format(
                    'Associate a File with the {0} - files can only be added after the {0} has been saved',
                    this.parentType),
                listeners: {
                    click: 'onAddFileClick'
                },
                bind: {
                    disabled: '{currentRecord.phantom}'
                }
            }
        ]
    });
