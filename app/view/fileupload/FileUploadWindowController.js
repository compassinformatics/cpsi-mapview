/**
 * Controller for the window used to add new attachments
 *
 * File uploads are not performed using normal 'Ajax' techniques, that is they are
 * not performed using XMLHttpRequests.
 * Instead the form is submitted in the standard manner with the DOM <form> element temporarily modified to have
 * its target set to refer to a dynamically generated, hidden <iframe> which is inserted into the document but
 * removed after the return data has been gathered.
 * The server response is parsed by the browser to create the document for the IFRAME.
 * If the server is using JSON to send the return object, then the Content-Type header must
 * be set to 'text/html' in order to tell the browser to insert the text unchanged into the document body.
 *
 * Characters which are significant to an HTML parser must be sent as HTML entities,
 * so encode '<' as '&lt;', '&' as '&amp;' etc.
 *
 * The response text is retrieved from the document, and a fake XMLHttpRequest object is created containing a
 * responseText property in order to conform to the requirements of event handlers and callbacks.
 * Be aware that file upload packets are sent with the content type multipart/form and some server
 * technologies (notably JEE) may require some custom processing in order to retrieve parameter names
 * and parameter values from the packet content.
 *
 * @class CpsiMapview.view.fileupload.FileUploadWindowController
 */

Ext.define('CpsiMapview.view.fileupload.FileUploadWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_fileuploadwindowcontroller',

    requires: [
        'CpsiMapview.model.fileupload.Attachment'
    ],

    getAttachmentUploadUrl: function () {

        var me = this;
        var parentRecord = me.getViewModel().getData().currentRecord;
        var serviceUrl = parentRecord.proxy.url;
        return Ext.String.format('{0}/{1}/attachment', serviceUrl, parentRecord.getId());
    },

    /**
     * Save the attachment to the server
     * 
     * @param {any} btn
     */
    onAttachmentSave: function (btn) {

        var me = this;
        var form = me.getView().down('form');

        if (form.isValid()) {

            form.submit({
                clientValidation: true,
                url: me.getAttachmentUploadUrl(),
                waitMsg: 'Uploading your file...',
                scope: me,
                // the following is ignored for a form submission request
                // adding into an options object is also ignored
                headers: {
                    'Accept': 'application/json'
                },
                success: me.onSuccess,
                failure: me.onFailure
            });
        }
    },

    /**
     * Inform the user that the attachment was successfully uploaded and
     * trigger an event to the new record can be added to the attachments grid
     * @param {any} form
     * @param {any} action
     */
    onSuccess: function (form, action) {

        var me = this;
        var formValues = form.getFieldValues();

        // create a new object containing the attributes of the attachment
        // after it was successfully associated
        // with the parent object. This record can then be added to a store

        var newAttachment = CpsiMapview.model.fileupload.Attachment.create({
            attachmentId: action.result.data.attachmentId,
            name: formValues.documentName,
            description: formValues.documentDescription,
            extension: 'Extension',
            fileName: formValues.filePath,
            fileSize: '',
            lastUpdatedDateUtc: Date()
        });

        // now show a message box to show the file was successfully uploaded

        var parentType = me.getViewModel().getData().parentType;
        var msg = Ext.String.format('The file {0} has been associated with the {1}', formValues.documentName, parentType);

        var vw = me.getView();
        Ext.Msg.alert('Success', msg, function () {
            vw.fireEvent('fileadded', newAttachment);
            vw.close();
        }, me);

    },

    /**
     * Alert the user the file was not successfully uploaded
     * JSON error messages are wrapped up in HTML
     * responseText: '<pre style='word-wrap: break-word; white-space: pre-wrap;'>{'success':false,'message':'The cookie header with user token has not been provided.'}</pre>'
     * so get just the error message
     * relevant link http://stackoverflow.com/questions/18150134/response-of-a-submit-form-is-adding-pre-to-json
     *
     * The server response is parsed by the browser to create the document for the IFRAME.
     * If the server is using JSON to send the return object, then the Content-Type header
     * must be set to 'text/html' (on the server-side) in order to tell the browser to insert the text
     * unchanged into the document body.
     *
     * @param {any} form
     * @param {any} action
     */
    onFailure: function (form, action) {

        switch (action.failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                Ext.Msg.alert('Failure', 'Ajax communication failed');
                break;
            case Ext.form.Action.SERVER_INVALID:
                // the header for errors should be html/text
                // however 404 errors or non-JSON errors will produce a huge error box
                var txt = action.response.responseText;
                Ext.Msg.alert('Server Error', txt);
                break;
            default:
                break;
        }
    },

    /**
     * Close the form on cancel
     * */
    onAttachmentCancelUpload: function () {
        this.getView().close();
    }
});