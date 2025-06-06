/**
 * The controller for the {@link CpsiMapview.view.form.Login}
 *
 * @class CpsiMapview.controller.form.Login
 */
Ext.define('CpsiMapview.controller.form.Login', {
    extend: 'Ext.app.ViewController',
    requires: ['Ext.util.Cookies'],
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

    onLoginClick: function (btn) {
        const form = btn.up('form');
        let valid = true;
        Ext.each(form.down('textfield'), function (field) {
            valid = valid && !Ext.isEmpty(field.value);
        });
        if (valid) {
            this.attemptLogin();
        }
    },

    /**
     * If a user still has a valid token, don't force them to log
     * in again
     * @param {string} token The toggle state of the button
     */
    tryAutomaticLogin: function () {
        const me = this;
        const tokenName = me.getTokenName();

        const token = Ext.util.Cookies.get(tokenName);
        let jsonData = {};
        const serviceUrl = me.getViewModel().validateUrl;

        if (token) {
            jsonData[tokenName] = token;
            jsonData = Ext.JSON.encode(jsonData);
            me.callLoginService(jsonData, serviceUrl, false);
        } else {
            me.getView().show();
        }
    },

    getTokenName: function () {
        const me = this;
        return me.getViewModel().tokenName;
    },

    /**
     * Set the login cookie and fire a global login event
     * @param {any} response
     */
    login: function (response) {
        const me = this;
        const roles = response.userRoles; // this is an array e.g. ["UPL"]

        const minimumRequiredRole = me.getViewModel().minimumRequiredRole;

        if (minimumRequiredRole) {
            const hasRole = Ext.Array.contains(roles, minimumRequiredRole);
            if (hasRole === false) {
                Ext.toast({
                    html: 'Your user does not have permissions to use the PMS browser application',
                    title: 'Login Failed',
                    width: 200,
                    align: 'br'
                });
                return false;
            }
        }

        const tokenName = me.getTokenName();

        const loginData = {
            roles: roles,
            username: Ext.util.Cookies.get('username')
        };

        loginData[tokenName] = response.data;
        me.updateCookie(loginData);
        Ext.GlobalEvents.fireEvent('login', loginData);
        return true;
    },

    /**
     * Clear the login cookie and fire a global logout event
     * */
    logout: function () {
        // issues with Cookies clear - http://www.sencha.com/forum/showthread.php?98070-CLOSED-Ext.util.Cookies.clear%28%29-not-working
        // only work when browser is restarted
        // so instead set them to null

        const me = this;
        const tokenName = me.getTokenName();

        const loginData = {
            roles: '',
            username: ''
        };

        loginData[tokenName] = '';

        me.updateCookie(loginData);
        Ext.GlobalEvents.fireEvent('logout', loginData);
    },

    updateCookie: function (loginData) {
        const me = this;
        const tokenName = me.getTokenName();

        Ext.util.Cookies.set(tokenName, loginData[tokenName]);
        Ext.util.Cookies.set('roles', loginData.roles);
        Ext.util.Cookies.set('username', loginData.username);
    },

    callLoginService: function (jsonData, serviceUrl, showMask) {
        const me = this;
        const view = me.getView();

        showMask = showMask && view.rendered;

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
                const response = Ext.decode(result.responseText);

                if (showMask) {
                    view.unmask();
                }

                if (response.success === true) {
                    if (me.login(response) === true) {
                        view.close();
                    } else {
                        view.show();
                    }
                } else {
                    //username / password login failure
                    Ext.toast({
                        html: response.message,
                        title: 'Login Failed',
                        width: 200,
                        align: 'br'
                    });
                    view.show();
                }
            },
            failure: function (result) {
                // indicates HTTP failure
                Ext.toast({
                    html: result.statusText,
                    title: 'Login Failed',
                    width: 200,
                    align: 'br'
                });
                if (showMask) {
                    view.unmask();
                }
                view.show();
            }
        });
    },

    attemptLogin: function () {
        const me = this;
        const view = me.getView();
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        const formValues = view.down('form').getForm().getValues();
        Ext.util.Cookies.set('username', formValues.username);

        const jsonData = Ext.JSON.encode(
            Ext.Object.merge({}, formValues, app.extraLoginParams)
        );

        const serviceUrl = me.getViewModel().serviceUrl;
        me.callLoginService(jsonData, serviceUrl, true);
    }
});
