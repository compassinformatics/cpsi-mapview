/**
 * A simple form in a modal window to allow a user to select a local file
 * to upload
 *
 * @class CpsiMapview.view.fileupload.FileUploadWindow
 */
Ext.define('CpsiMapview.view.fileupload.FileUploadWindow', {
    extend: 'Ext.window.Window',
    xtype: 'cmv_fileuploadwindow',
    requires: [
        'CpsiMapview.view.fileupload.FileUploadWindowController'
    ],
    modal: true,
    layout: 'anchor',
    width: 500,
    closeAction: 'destroy',
    controller: 'cmv_fileuploadwindowcontroller',
    bind: {
        title: 'Associate a File with the {parentType}'
    },
    items: [
        {
            xtype: 'form',
            itemId: 'fileSelector',
            fileUpload: true,
            anchor: '100%',
            layout: 'anchor',
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 150,
            defaults: {
                anchor: '100%',
                allowBlank: false, // all fields are required for the form to be valid
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'documentName',
                    fieldLabel: 'Name*',
                    emptyText: 'Enter a name for the document...'
                },
                {
                    xtype: 'textfield',
                    name: 'documentDescription',
                    fieldLabel: 'Description*',
                    emptyText: 'Enter a description for the document...'
                },
                {
                    xtype: 'fileuploadfield',
                    emptyText: 'Select a file',
                    fieldLabel: 'Document*',
                    name: 'filePath',
                    buttonConfig: {
                        iconCls: 'add icon-add',
                        cls: 'bordered-button',
                        text: ''
                    }
                }
            ]
        }
    ],
    bbar: [
        { xtype: 'tbfill' },
        {
            text: 'Save',
            handler: 'onAttachmentSave',
            formBind: true
        },
        {
            text: 'Cancel',
            handler: 'onAttachmentCancelUpload'
        }
    ]
});
