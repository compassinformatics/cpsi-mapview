/*
    File uploads are not performed using normal 'Ajax' techniques, that is they are
    not performed using XMLHttpRequests.
    Instead the form is submitted in the standard manner with the DOM <form> element temporarily modified to have
    its target set to refer to a dynamically generated, hidden <iframe> which is inserted into the document but
    removed after the return data has been gathered.
    The server response is parsed by the browser to create the document for the IFRAME.
    If the server is using JSON to send the return object, then the Content-Type header must
    be set to 'text/html' in order to tell the browser to insert the text unchanged into the document body.

    Characters which are significant to an HTML parser must be sent as HTML entities,
    so encode '<' as '&lt;', '&' as '&amp;' etc.

    The response text is retrieved from the document, and a fake XMLHttpRequest object is created containing a
    responseText property in order to conform to the requirements of event handlers and callbacks.
    Be aware that file upload packets are sent with the content type multipart/form and some server
    technologies (notably JEE) may require some custom processing in order to retrieve parameter names
    and parameter values from the packet content.
*/

Ext.define('CpsiMapview.view.fileupload.FileGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_filegridcontroller',
    requires: [
        'CpsiMapview.view.fileupload.Report',
        'CpsiMapview.view.fileupload.FileUploadWindow',
        'CpsiMapview.model.fileupload.FileGridStoreModel'
    ],
    mixins: [
        'CpsiMapview.controller.grid.ItemDeleterGridControllerMixin'
    ],
    getServiceUrl: function() {
        var vm = this.getViewModel();
        var url = vm.getData().serviceUrl;
        return url;
    },
    getAttachmentDeleteUrl: function(id) {
        var url = this.getServiceUrl();
        url += (url.endsWith('/') ? '' : '/') + 'attachment/{0}';
        url = url.replace('{0}', id);
        return url;
    },

    onAddFileClick: function () {
        var vm = this.getViewModel();
        var fileUploadWin = Ext.create('CpsiMapview.view.fileupload.FileUploadWindow', {
            viewModel: {
                data: {
                    serviceUrl: vm.getData().serviceUrl,
                    currentRecord: vm.getData().currentRecord
                }
            },
            listeners: {
                fileadded: 'onFileAdded',
                scope: this
            }
        });
        fileUploadWin.show();
    },

    onRowDelete: function(tableView, rowIndex, colIndex, item, e, record, tableRow)
    {
        var id = CpsiMapview.model.fileupload.FileGridStoreModel.loadData(record.data).getId();
        Ext.Ajax.request({
            url: this.getAttachmentDeleteUrl(id),
            method: 'DELETE',
            success: function() {
                var store = tableView.getStore();
                store.remove(record);
            },
            failure: function(){
            }
        });
    },

    onFileAdded: function (file) {
        var store = this.getViewModel().getStore('files');
        store.add(file);
    },

    getAttachmentUrl: function (attachmentId) {
        var vm = this.getViewModel();
        return Ext.String.format('{0}/attachment/{1}', vm.getData().serviceUrl, attachmentId);
    },

    onDownloadFileClick: function (grid, record, element, rowIndex/*, e, eOpts*/) {
        var report = Ext.create('CpsiMapview.view.fileupload.Report', {
            renderTo: Ext.getBody()
        });
        var url = this.getAttachmentUrl(record.get('attachmentId'));
        report.load({
            url: url
        });
    }

});