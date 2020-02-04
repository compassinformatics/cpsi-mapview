Ext.define('CpsiMapview.controller.form.Login', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cmv_login_form',

    /**
    * Attempt to login if the user presses the Enter key on
    * the form
    */
    onSpecialKey: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.attemptLogin();
        }
    },

    onLoginClick: function () {
        this.attemptLogin();
    },

    /**
    * If a user still has a valid token, don't force them to log
    * in again
    * @param {string} token The toggle state of the button
    */
    tryAutomaticLogin: function () {

        var me = this;
        var tokenName = me.getTokenName();

        var token = Ext.util.Cookies.get(tokenName);
        var jsonData = {};
        var serviceUrl = me.getViewModel().validateUrl;

        if (token) {
            jsonData[tokenName] = token;
            jsonData = Ext.JSON.encode(jsonData);
            me.callLoginService(jsonData, serviceUrl, false);
        }
    },

    getTokenName: function () {

        var me = this;
        return me.getViewModel().tokenName;
    },

    login: function (response) {

        var me = this;
        var roles = response.userRoles; // this is an array e.g. ["UPL"]
        var tokenName = me.getTokenName();

        var loginData = {
            roles: roles,
            username: Ext.util.Cookies.get('username')
        };

        loginData[tokenName] = response.data;

        me.updateCookie(loginData);
        me.fireEvent('login', loginData);
    },

    logout: function () {

        // issues with Cookies clear - http://www.sencha.com/forum/showthread.php?98070-CLOSED-Ext.util.Cookies.clear%28%29-not-working
        // only work when browser is restarted
        // so instead set them to null

        var me = this;
        var tokenName = me.getTokenName();

        var loginData = {
            roles: '',
            username: ''
        };

        loginData[tokenName] = '';

        me.updateCookie(loginData);
        me.fireEvent('logout');
    },

    updateCookie: function (loginData) {

        var me = this;
        var tokenName = me.getTokenName();

        Ext.util.Cookies.set(tokenName, loginData[tokenName]);
        Ext.util.Cookies.set('roles', loginData.roles);
        Ext.util.Cookies.set('username', loginData.username);

    },

    callLoginService: function (jsonData, serviceUrl, showMask) {

        var me = this;
        var view = me.getView();

        showMask = showMask && view && view.rendered;

        if (showMask) {
            view.mask('Logging in');
        }

        Ext.Ajax.request({
            method: 'POST',
            url: serviceUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8' //this must be set or get server 500 errors
            },
            params: jsonData,
            success: function (result) {
                // successful HTTP connection, not necessarily the log in
                // call was successful, we should now have a token in the response.data property
                var response = Ext.decode(result.responseText);

                if (response.success === true) {
                    me.login(response);
                    if (view) {
                        view.destroy();
                    }
                }
                else {
                    //username / password login failure
                    me.fireEvent('loginfail', result.statusText);
                }
            },
            failure: function (result) {
                // indicates HTTP failure
                me.fireEvent('loginfail', result.statusText);

            },
            callback: function () {
                if (showMask) {
                    view.unmask();
                }
            }

        });
    },

    attemptLogin: function () {

        var me = this;
        var view = me.getView();

        var formValues = view.down('form').getForm().getValues();
        Ext.util.Cookies.set('username', formValues.username);

        var jsonData = Ext.JSON.encode(formValues);

        var serviceUrl = me.getViewModel().serviceUrl;
        me.callLoginService(jsonData, serviceUrl, true);

    },

    init: function () {
        this.tryAutomaticLogin();
    }

});
