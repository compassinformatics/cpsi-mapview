/**
 * A mixin that can be added to a controller
 * to handle opening system help links
 *
 * @class CpsiMapview.form.HelpMixin
 */
Ext.define('CpsiMapview.form.HelpMixin', {
    extend: 'Ext.Mixin',

    /**
     * Opens any associated helpUrl in a new browser tab
     * If the URL does not start with 'http' then an application
     * rootHelpUrl is appended to the URL if present
     * @return {String} Full URL to the help page*
     */
    onHelp: function () {

        var me = this;

        // get the helpUrl from the viewmodel (if set)
        var vm = me.getViewModel();
        var helpUrl = vm ? vm.get('helpUrl') : '';

        // unsure why Ext.getApplication is sometimes undefined
        var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
        var rootUrl = app.rootHelpUrl;

        if (!helpUrl && !rootUrl) {
            //<debug>
            Ext.log.error('No helpUrl or rootUrl link provided');
            //</debug>
            return;
        }

        var fullUrl = me.buildHelpUrl(helpUrl, rootUrl);
        var win = window.open(fullUrl, 'mapview-help'); // use '_blank' if we want a new window each time

        if (!win) {
            Ext.Msg.alert('Pop-up Blocked', 'The help page was blocked from opening. Please allow pop-ups for this site.');
        } else {
            win.focus();
        }

        return fullUrl;
    },

    /**
    * Build a URL based on root and page fragments
    *
    * @param {String} helpUrl A full URL or a relative link within the documentation
    * @param {String} rootUrl A root/base URL for the documentation
    * @return {String} Full URL to the help page
    * @private
    */
    buildHelpUrl: function (helpUrl, rootUrl) {

        var fullUrl;

        if (rootUrl && (Ext.String.startsWith(helpUrl, 'http') === false)) {

            // trim any slashes from the URLs to avoid double slashes
            if (Ext.String.endsWith(rootUrl, '/')) {
                rootUrl = rootUrl.slice(0, -1);
            }

            if (Ext.String.startsWith(helpUrl, '/')) {
                helpUrl = helpUrl.slice(1);
            }

            // now format the URLs with a single slash
            fullUrl = Ext.String.format('{0}/{1}', rootUrl, helpUrl);

        } else {
            // no rootUrl is set or the link URL is a direct http link
            fullUrl = helpUrl;
        }

        return fullUrl;
    }
});