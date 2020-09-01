Ext.define('CpsiMapview.util.files.FileGridStoreModel', {
    extend: 'Ext.data.Model',
    alias: 'model.FileGridStoreModel',
    idProperty: 'attachmentId',
    fields: [
        { name: 'attachmentId', type: 'int' },
        { name: 'description', type: 'string' },
        { name: 'extension', type: 'string' },
        { name: 'fileName', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'fileSize', type: 'int' },
        {
            name: 'lastUpdatedDateUtc',
            type: 'date',
            dateFormat: 'Y-m-d\\TH:i:s'
        }
    ]
});
