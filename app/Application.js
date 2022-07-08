/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('CpsiMapview.Application', {
    extend: 'Ext.app.Application',

    requires: [
        'CpsiMapview.view.main.Main'
    ],

    mainViewXType: 'cmv_main',

    mixins: {
        appmixin: 'CpsiMapview.util.ApplicationMixin'
    },

    /**
     * Override the settings in CpsiMapview.util.ApplicationMixin
     */
    tokenName: 'pmstoken',
    authenticationUrl: '/WebServices/authorization/authenticate',
    tokenValidationUrl: '/WebServices/authorization/validateToken',

    requireLogin: false,

    name: 'CpsiMapview',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application
    },

    rewriteRemoveServiceRequests: function (options) {

        var me = this;
        var hostname = window.location.hostname;
        var regex = /compassinformatics.github.io/g;
        var regex = /localhost/g;
        var m = regex.exec(hostname);
        var serviceUrl = options.url;

        if (m) {
            var serviceUrls = ['/WebServices', '/pmspy'];

            var urlTest = function (url) {
                var ignoreCase = true;
                return Ext.String.startsWith(serviceUrl, url, ignoreCase);
            };

            if (Ext.Array.some(serviceUrls, urlTest) === true) {


                debugger;
                var tokenValue = Ext.util.Cookies.get(me.tokenName);
                if (tokenValue) {
                    var token = Ext.String.format("token={0}", tokenValue)
                    serviceUrl = Ext.String.urlAppend(serviceUrl, token);
                }
                serviceUrl = 'https://pmstipperarydev.compass.ie' + serviceUrl;
            }

            options.url = serviceUrl;
        }
    },

    onAjaxBeforeRequest: function (conn, options) {
        var me = this;
        if (options.url) {
            me.rewriteRemoveServiceRequests(options);
        }
    }
});
