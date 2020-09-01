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
            dateFormat: Pms.util.Constants.ISO8601NoTimezone
        }
    ]
    //,
    //proxy: {
    //    type: 'rest',
    //    url: '/webservices/limit/{0}/attachment',
    //    reader: {
    //        type: 'json',
    //        rootProperty: 'data'
    //    }
    //}
});
