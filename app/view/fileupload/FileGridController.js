/**
 * Controller for the grid used to display a collection of attachments
 *
 * @class CpsiMapview.view.fileupload.FileGridController
 */

Ext.define('CpsiMapview.view.fileupload.FileGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_filegridcontroller',
    requires: [
        'CpsiMapview.view.fileupload.Report',
        'CpsiMapview.view.fileupload.FileUploadWindow',
        'CpsiMapview.model.fileupload.Attachment'
    ],
    mixins: ['CpsiMapview.controller.grid.ItemDeleterGridControllerMixin'],

    /**
     * Open the modal form for adding a new file attachment
     */
    onAddFileClick: function () {
        const me = this;
        const vm = me.getViewModel();
        const data = vm.getData();

        const fileUploadWin = Ext.create(
            'CpsiMapview.view.fileupload.FileUploadWindow',
            {
                viewModel: {
                    data: {
                        currentRecord: data.currentRecord,
                        parentType: data.parentType
                    }
                },
                listeners: {
                    fileadded: 'onFileAdded',
                    scope: me
                }
            }
        );

        fileUploadWin.show();
    },

    /**
     * Delete an attachment from the server and removed from the grid
     * @param {any} tableView
     * @param {any} rowIndex
     * @param {any} colIndex
     * @param {any} item
     * @param {any} e
     * @param {any} record
     */
    onRowDelete: function (tableView, rowIndex, colIndex, item, e, record) {
        const me = this;
        const url = record.get('attachmentUrl');

        Ext.Ajax.request({
            url: url,
            method: 'DELETE',
            success: function (response) {
                const resp = Ext.decode(response.responseText);
                if (resp.success === true) {
                    const store = me.getView().getStore();
                    store.remove(record);
                } else {
                    Ext.log.warn('Error deleting attachment', resp.message);
                }
            },
            failure: function (response) {
                if (!response.aborted) {
                    Ext.log.error('Error deleting attachment', response);
                }
            }
        });
    },

    /**
     * Add a new attachment to the grid
     * @param {any} file
     */
    onFileAdded: function (file) {
        const store = this.getViewModel().getStore('files');
        store.add(file);
    },

    /**
     * Open an image attachment in a floating window
     * @param {any} record
     */
    openImageInWindow: function (record) {
        const imageUrl = record.get('attachmentUrl');
        const css = 'style="width: 100%; height: 100%; object-fit: contain"';

        const win = Ext.create('CpsiMapview.view.window.MinimizableWindow', {
            width: 300,
            height: 400,
            title: 'Image Attachment',
            layout: 'fit',
            minimizable: true,
            maximizable: true,
            resizable: true,
            closeAction: 'destroy',
            iconCls: 'x-fa fa-camera',
            items: {
                xtype: 'component',
                html: Ext.String.format(
                    '<a href="{0}" target="_blank"><img src={1} {2} ></a>',
                    imageUrl,
                    imageUrl,
                    css
                )
            }
        });
        win.show();
    },

    /**
     * When double clicking a file attachment open in a
     * window for images, or download directly for other file types
     * @param {any} grid
     * @param {any} record
     */
    onDownloadFileClick: function (grid, record) {
        const me = this;

        if (record.get('isThumbnailAvailable') === true) {
            me.openImageInWindow(record);
        } else {
            // for non-image attachments download the file
            const report = Ext.create('CpsiMapview.view.fileupload.Report', {
                renderTo: Ext.getBody()
            });

            const url = record.get('attachmentUrl');
            report.load({
                url: url
            });
        }
    }
});
