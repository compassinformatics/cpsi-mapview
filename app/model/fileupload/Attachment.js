/**
 * This class is the model used for file
 * attachments used by mapview
 *
 * @class CpsiMapview.model.fileupload.Attachment
 */
Ext.define('CpsiMapview.model.fileupload.Attachment', {
    extend: 'Ext.data.Model',
    alias: 'model.Attachment',
    entityName: 'Attachment',
    idProperty: 'attachmentId',
    fields: [
        { name: 'attachmentId', type: 'int' },
        { name: 'contentType', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'extension', type: 'string' },
        { name: 'fileName', type: 'string' },
        { name: 'fileSize', type: 'int' },
        { name: 'isDefaultImage', type: 'boolean' },
        { name: 'isThumbnailAvailable', type: 'boolean' },
        {
            name: 'lastUpdatedDateUtc',
            type: 'date',
            dateFormat: 'Y-m-d\\TH:i:s'
        },
        { name: 'name', type: 'string' },
        { name: 'attachmentUrl', type: 'string' }, // calculated client-side
        { name: 'thumbnailUrl', type: 'string' } // calculated client-side
    ],

    /**
     * Attachements are typically associated with a parent object (which has multiple
     * attachments)
     * This function allows full URLs to be created for downloading attachments and also
     * thumbnails if the attachment is an image file
     * @param {any} parentUrl the service URL of the parent owner
     */
    updateAttachmentUrls: function (parentUrl) {

        var me = this;
        var thumbnailUrl = '';
        var attachmentUrl = '';

        if (me.get('isThumbnailAvailable') === true) {
            // if there are thumbnails then the attachment is an image
            thumbnailUrl = Ext.String.format('{0}/attachment/{1}/thumbnail', parentUrl, me.getId());
        }

        attachmentUrl = Ext.String.format('{0}/attachment/{1}', parentUrl, me.getId());

        me.set({
            thumbnailUrl: thumbnailUrl,
            attachmentUrl: attachmentUrl
        }, {
            dirty: false
        });
    }
});
