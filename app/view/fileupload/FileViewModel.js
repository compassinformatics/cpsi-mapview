Ext.define('CpsiMapview.view.fileupload.FileViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_fileviewmodel',
    data: {
        serviceUrl: ''
    },
    stores: {
        files: {
            type: 'FileGridStore',
            //bind: {
                parentId: '{parentId}',
                serviceUrl: '{serviceUrl}'
            //}
        }
    },
    formulas: {
        parentId: function (get) {
            debugger;
            return get('currentRecord').getId();
        },
        attachmentUploadUrl: function(get) {
            return this.serviceUrl + (this.serviceUrl.endsWith('/') ? '' : '/') + '{0}/attachment';
        }
    }
});