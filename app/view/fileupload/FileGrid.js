/**
 * Grid used to display a collection of attachments
 *
 * @class CpsiMapview.view.fileupload.FileGrid
 */
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
                text: 'Thumbnail',
                flex: 1,
                dataIndex: 'thumbnailUrl',
                renderer: function(url) {
                    if(url){
                        return Ext.String.format('<img src="{0}" alt="thumbnail" height="32" width="32">', url);
                    } else {
                        return '';
                    }
                }
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
                text: 'Attachment Id',
                dataIndex: 'attachmentId',
                hidden: true
            },
            {
                text: 'Content Type',
                dataIndex: 'contentType',
                hidden: true
            },
            {
                text: 'File Extension',
                dataIndex: 'extension',
                hidden: true
            },
            {
                text: 'Default Image',
                dataIndex: 'isDefaultImage',
                hidden: true
            },
            {
                text: 'Thumnail Available',
                dataIndex: 'isThumbnailAvailable',
                hidden: true
            },
            {
                xtype: 'cmv_itemdeleter',
                itemId: 'itemDeleter',
                avoidConfirmationRequest: false,
                bind: {
                    hidden: '{hideDeleteFileButton}',
                    disabled: '{!canDeleteFiles}',
                }
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
                listeners: {
                    click: 'onAddFileClick'
                },
                style: {
                    pointerEvents: 'all'
                },
                bind: {
                    disabled: '{!canAddFiles}',
                    tooltip:'Associate a File with the {parentType} - files can only be added after the {parentType} has been saved',
                    hidden: '{hideAddFileButton}'
                }
            }
        ]
    });
