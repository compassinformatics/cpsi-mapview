Ext.define('CpsiMapview.view.fileupload.FileViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cmv_fileviewmodel',
    //data: {
    //    serviceUrl: '666'
    //},
    stores: {
        files: {
            type: 'FileGridStore',
            parentId: '{parentId}',
            serviceUrl: '{serviceUrl}'
        }
    },
    formulas: {
        parentId: function (get) {
            return get('currentRecord').getId();
        },
        attachmentUploadUrl: function() {
            var url = this.getStore('files').serviceUrl;
            return url + (url.endsWith('/') ? '' : '/') + '{0}/attachment';
        }
    }
});