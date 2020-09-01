Ext.define('CpsiMapview.util.files.FileGridStore', {
    extend: 'Ext.data.Store',
    alias: 'store.FileGridStore',
    model: 'CpsiMapview.util.files.FileGridStoreModel',
    resuires: ['Ext.data.proxy.Rest'],
    autoSync: true,
    autoLoad: false,
    beforeWriteHandler: function (/*store, action, rs, options, arg*/) {
        if (!this.parentId) {
            // do not attempt to load records if the parentId
            // has been reset to null
            return false;
        }
        return true;
    },

    listeners: {
        beforeLoad: function () {
            return !isNaN(this.parentId);
        }
    },
    getParentUrl: function () {
        var url = Ext.String.format(this.serviceURL + '/{0}/attachment', this.parentId);
        return url;
    },

    getAttachmentUrlFromIdx: function (rowIdx) {
        var record = this.getAt(rowIdx),
            attachmentId = record.get('attachmentId'),
            url = this.getAttachmentUrl(attachmentId);
        return url;
    },

    getAttachmentUrl: function (attachmentId) {
        return Ext.String.format('{0}/attachment/{1}', this.serviceURL, attachmentId);
    },

    setParentId: function (parentId, load) {
        this.parentId = parentId;
        if (!Ext.isEmpty(parentId)) {
            // recreate the proxy with the new parentId
            this.setProxy(this.createProxy({}));
            if (load) {
                this.load();
            }
        }
    },

    createApi: function (url, parentId) {

        // two URL formats are required
        // to GET and DELETE individual attachments
        // /speed/sign/attachment/{attachmentId}
        // to GET a list and CREATE:
        // /speed/sign/{signId}/attachment
        var url1 = url + '/attachment/'; //{0}';
        var url2 = this.getParentUrl(url, parentId);
        var api = {
            create: url2,
            read: url2,
            update: null, // update is not used
            destroy: url1
        };

        return api;
    },

    createProxy: function (config) {
        var ret =  Ext.create('Ext.data.proxy.Rest', Ext.apply(config, {
            api: this.createApi(this.serviceURL, this.parentId),
            serviceURL: this.serviceURL,
            parentId: this.parentId,
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        })
        );
        return ret;
    },

    constructor: function (config) {
        var me = this;
        Ext.Assert.truthy(!Ext.isEmpty(config.serviceUrl), 'Service URL not specified');

        me.serviceURL = config.serviceUrl;
        this.callParent(arguments);
        me.setParentId(config.parentId);
        this.load();
    }

});

