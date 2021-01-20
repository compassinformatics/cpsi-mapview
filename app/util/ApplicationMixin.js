
/**
 * A mapview Application mixin containing generic functions that can be reused
 * between applications
 */
Ext.define('CpsiMapview.util.ApplicationMixin', {
    extend: 'Ext.Mixin',

    // see https://docs.sencha.com/extjs/6.7.0/classic/Ext.app.Application.html#cfg-quickTips
    quickTips: false,

    loginWindow: null,

    // when the platform is matched any properties are placed on the class
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    mixinConfig: {
        after: {
            constructor: 'onApplicationCreated'
        }
    },

    // URLs to monitor for service errors
    serviceUrls: [],

    // URLs to ignore for errors
    excludedUrls: [],

    // URL to use as the root for any window helpUrl
    rootHelpUrl: '',

    tokenName: 'cookietoken',

    errorCode: {
        None: 0,
        AccountLockedOut: 1,
        AccountDoesNotExist: 2,
        UserTokenExpired: 3,
        CookieHeaderMissing: 4,
        NoPermission: 5,
        GeneralServerError: 500,
        FileNotFound: 404
    },

    onAjaxBeforeRequest: function () {
        Ext.emptyFn();
    },

    onAjaxRequestComplete: function (connection, response) {

        var me = this;

        var msg = 'The operation failed.';
        var result;
        var requestUrl = response.request.url;
        var success = response.status === 200;

        var urlTest = function (url) {
            var ignoreCase = true;
            return Ext.String.startsWith(requestUrl, url, ignoreCase);
        };

        if (Ext.Array.some(me.serviceUrls, urlTest) === true) {
            if (Ext.Array.some(me.excludedUrls, urlTest) === false) {

                // FORMS submission (i.e. attachments upoad) return bogus responses with no content-type
                var responseType = response.responseType ? response.responseType: response.getResponseHeader ? response.getResponseHeader('content-type') : null;

                // check for geojson (coming from MapServer)
                if (responseType && responseType.includes('subtype=geojson')) {
                    responseType = 'geojson';
                }

                switch (responseType) {
                    case 'json':
                    case 'application/json':
                        if (response.responseJson) {
                            result = response.responseJson;
                        }
                        else {
                            result = JSON.parse(response.responseText);
                        }

                        if (result.success !== true) {
                            switch (result.errorCode) {
                                case me.errorCode.UserTokenExpired:
                                case me.errorCode.CookieHeaderMissing:
                                    // user must login again
                                    me.doLogin();
                                    break;
                                case null:
                                    Ext.Msg.alert('Error', result.message);
                                    break;
                                default:
                                    Ext.log.error(requestUrl, msg);
                                    break;
                            }
                        }
                        break;
                    case 'geojson':
                        break;
                    case 'xml':
                        result = response.responseXML;
                        break;
                    default:
                        result = response.responseText;
                        break;
                }
            }
        }
        return success;
    },

    onAjaxRequestException: function (/*connection, response, options, eOpts*/) {
        Ext.emptyFn();
    },

    onApplicationCreated: function () {

        var me = this;
        me.setupRequestHooks();
        me.doLogin();
        // add a listener for whenever any button in the map toggleGroup is toggled
        me.control({
            'button[toggleGroup=map]': {
                toggle: me.onMapToolsToggle
            }
        });
    },

    /**
     * Whenever any tools that are part of the 'map' toggleGroup are toggled
     * we check to see if any tools are still active.
     * The defaultClickEnabled value is then used to check if the
     * default CpsiMapview.plugin.FeatureInfoWindow tool should be active
     * */
    onMapToolsToggle: function () {

        var buttonsInToggleGroup = Ext.ComponentQuery.query('button[toggleGroup=map]');
        var pressedStates = Ext.Array.pluck(buttonsInToggleGroup, 'pressed');
        var uniquePressedStates = Ext.Array.unique(pressedStates);
        var activeTools = Ext.Array.contains(uniquePressedStates, true);

        var map = BasiGX.util.Map.getMapComponent().map;
        map.set('defaultClickEnabled', !activeTools);
    },

    /**
     * Add hooks for all AJAX request to handle errors and logins
     * */
    setupRequestHooks: function () {

        var me = this;

        Ext.Ajax.on({
            beforerequest: this.onAjaxBeforeRequest,
            requestcomplete: this.onAjaxRequestComplete,
            requesteexception: this.onAjaxRequestException,
            scope: me
        });
    },

    /**
     * Open the login form when the application is opened. Attempt
     * to login automatically if the user already has a cookie and token.
     * If the form has already been created then simply show it.
     * */
    doLogin: function () {

        var me = this;

        if (!me.loginWindow) {
            me.loginWindow = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: {
                    tokenName: this.tokenName,
                    serviceUrl: '/WebServices/authorization/authenticate',
                    validateUrl: '/WebServices/authorization/validateToken'
                }
            });
            me.loginWindow.getController().tryAutomaticLogin();
        } else {
            me.loginWindow.show();
        }
    },

    /**
     * Get a value from the hostname in the browser
     * using the supplied regex
     * @param {any} regex
     */
    getUrlParameter: function (regex) {

        var str = location.hostname;
        var matches = [];
        var m;

        do {
            m = regex.exec(str);
            if (m) {
                matches.push(m[1]);
            }
        } while (m);

        var value;

        if (matches.length > 0) {
            value = matches[0];
        }

        return value;
    },

    /**
     * When multiple sites are supported, lookup
     * application settings from a store using the
     * supplied key
     * @param {any} storeKey
     * @param {any} siteKey
     */
    getSiteSettings: function (storeKey, siteKey) {

        var store = Ext.data.StoreManager.lookup(storeKey);
        var idx = store.findExact('key', siteKey);
        var rec = null;

        if (idx !== -1) {
            rec = store.getAt(idx);
        }

        return rec;
    },

    /**
     * Ask the use if they wish to refresh the browser following an application update
     * */
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
