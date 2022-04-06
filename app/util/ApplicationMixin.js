
/**
 * A mapview Application mixin containing generic functions that can be reused
 * between applications
 */
Ext.define('CpsiMapview.util.ApplicationMixin', {
    extend: 'Ext.Mixin',

    requires: [
        'Ext.window.MessageBox',
        'CpsiMapview.view.form.Login'
    ],

    // see https://docs.sencha.com/extjs/6.7.0/classic/Ext.app.Application.html#cfg-quickTips
    quickTips: false,

    /**
     * The xtype of the main application viewport to be loaded
     * once a user is logged in
     */
    mainViewXType: null,

    /**
     * Property to store a reference to the login window
     */
    loginWindow: null,

    /**
     * Does the application require a login window for access
     */
    requireLogin: true,

    /**
     * Set the minimum role name (a string) that is required to access the browser system,
     * in the event that users are shared between browser and other applications
     */
    minimumRequiredRole: null,

    // when the platform is matched any properties are placed on the class
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    /**
    * A counter property to keep track of how many stores need to
    * be loaded before the application can become active
    */
    storeCounter: 0,

    /**
    * A flag to indicate if the viewport and stores have been loaded
    * for the application
    */
    applicationLoaded: false,

    /**
    * Custom property to list all stores that should be loaded as soon as a user logs in
    */
    lookupStores: [],

    mixinConfig: {
        after: {
            constructor: 'onApplicationCreated',
            onAppUpdate: 'onApplicationUpdated'
        }, before:
        {
            init: 'beforeInit'
        }
    },

    /**
     * URLs to monitor for service errors
     */
    serviceUrls: [],

    /**
     * URLs to ignore for errors
     */
    excludedUrls: [],

    /**
     * URL to use as the root for any window helpUrl
     */
    rootHelpUrl: '',

    /**
     * The token name within a cookie that stores a login token
     */
    tokenName: 'cookietoken',

    errorCode: {
        None: 0,
        AccountLockedOut: 1,
        AccountDoesNotExist: 2,
        UserTokenExpired: 3,
        CookieHeaderMissing: 4,
        NoPermission: 5,
        NoTokenProvided: 6,
        GeneralServerError: 500,
        FileNotFound: 404
    },

    /**
     * Fire the global login event when the application is loaded
     * @param {any} loginData
     */
    onLogin: function (loginData) {

        var me = this;

        if (me.applicationLoaded === false) {
            me.loadApplication();
            // now that the viewport is has been created re-fire the login event so any UI elements
            // that listen to this can be updated
            Ext.GlobalEvents.fireEvent('login', loginData);
        }
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

                var responseType = response.responseType ? response.responseType : response.getResponseHeader ? response.getResponseHeader('content-type') : null;

                // check for geojson (coming from MapServer)
                if (responseType && responseType.includes('subtype=geojson')) {
                    responseType = 'geojson';
                }

                // form submissions (i.e. attachments upload) return bogus responses with no content-type
                // we can try and parse the response to see if it is valid JSON
                if (responseType === null) {
                    if (Ext.JSON.decode(response.responseText, true)) { // pass true to avoid errors
                        responseType = 'json';
                    }
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
                                case me.errorCode.NoTokenProvided:
                                    // user must login again
                                    me.doLogin();
                                    break;
                                case null:
                                    Ext.Msg.alert('Error', result.message);
                                    break;
                                default:
                                    //<debug>
                                    Ext.log.error(requestUrl, result.message ? result.message : msg);
                                    //</debug>
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

    onAjaxRequestException: function () {
        Ext.emptyFn();
    },

    onApplicationCreated: function () {

        var me = this;
        me.setupRequestHooks();
        if (me.requireLogin) {
            me.doLogin();
        } else {
            me.loadApplication();
        }

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
     * As the 'pan' tool is simply a button with no associated tool we can exclude this
     * from the search
     * The defaultClickEnabled value is then used to check if the
     * default CpsiMapview.plugin.FeatureInfoWindow tool should be active
     * */
    onMapToolsToggle: function () {

        var buttonsInToggleGroup = Ext.ComponentQuery.query('button[toggleGroup=map][name!=pan]');
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
                    validateUrl: '/WebServices/authorization/validateToken',
                    minimumRequiredRole: me.minimumRequiredRole
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
    getUrlParameter: function (regex, hostname) {

        var matches = [];
        var m;

        do {
            m = regex.exec(hostname);
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
     * Loop through all remote stores in the custom lookupStores property
     * and add a listener to keep track of then they are loaded
     * */
    loadAllStores: function () {

        var me = this;

        if (me.lookupStores.length === 0) {
            return;
        }

        me.getMainView().mask('Loading...');

        Ext.Array.each(me.lookupStores, function (storeClass) {
            var store = Ext.create(storeClass);

            if (store.autoLoad && !store.isLoaded()) {
                me.storeCounter++;

                store.on({
                    load: {
                        fn: me.storeLoaded,
                        scope: me,
                        single: true
                    }
                });
            }
        });
    },

    /**
     * Decrease the storeCounter property and
     * if all stores are loaded then unmask the application
     * */
    storeLoaded: function () {

        var me = this;
        me.storeCounter--;

        if (me.storeCounter == 0) {
            me.getMainView().unmask();
        }
    },

    /**
     * Ask the use if they wish to refresh the browser following an application update
     * */
    onApplicationUpdated: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    /**
    * Add the main view to the viewport and load all the application stores
    * We don't want to show the viewport and load stores until the user is logged in
    * so we use a similar approach to that described in the Sencha sample
    * login app at https://docs.sencha.com/extjs/7.2.0/guides/tutorials/login_app/login_app.html
    * */
    loadApplication: function () {

        var me = this;

        if (!me.mainViewXType) {
            Ext.Error.raise('No mainViewXType defined for the application');
        }

        // setting the mainview also creates a new instance of the component so pass in an xtype
        me.setMainView({ xtype: me.mainViewXType });

        me.loadAllStores();

        // set a flag so we don't try and load the application again when a user logs in after
        // their token has expired
        me.applicationLoaded = true;
    },

    /**
     * Common setup code prior to initializing the application
     * */
    beforeInit: function () {

        var me = this;
        Ext.Ajax.timeout = 60000; // default is 30000 (30 seconds) increase to a minute

        // disable warnings about the map panel having no title
        // https://docs.sencha.com/extjs/6.0.0/guides/upgrades_migrations/extjs_upgrade_guide.html#upgrades_migrations-_-extjs_upgrade_guide_-_aria_regions_should_have_a_title
        Ext.enableAriaPanels = false;
        Ext.ariaWarn = Ext.emptyFn;

        Ext.GlobalEvents.on('login', me.onLogin, me);
    }
});
