/**
 * Component used to upload local files
 * You can't download a file using a direct AJAX call so use this hidden iframe.
 * See comments at https://stackoverflow.com/questions/20499959/extjs-4-downloading-a-file-through-ajax-call
 * and https://stackoverflow.com/questions/18434962/extjs-handling-success-or-failure-when-doing-a-standard-submit-in-a-form
 *
 * @class CpsiMapview.view.fileupload.Report
 */

Ext.define('CpsiMapview.view.fileupload.Report', {
    extend: 'Ext.Component',
    autoEl: {
        tag: 'iframe',
        cls: 'x-hidden',
        src: Ext.SSL_SECURE_URL
    },
    load: function (config) {
        this.getEl().dom.src = config.url + (config.params ? '?' + Ext.urlEncode(config.params) : '');
    }
});
