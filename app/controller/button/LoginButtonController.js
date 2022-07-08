/**
 * This class is the controller for the {@link CpsiMapview.view.button.LoginButton}
 */
Ext.define('CpsiMapview.controller.button.LoginButtonController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'CpsiMapview.view.form.Login'
    ],

    alias: 'controller.cmv_login_button',

    /**
    * The prefix used in the cookie for any browser-based
    * user roles
    * */
    browserRolePrefix: 'Browser_',

    /**
     * Logout, clear the login cookie, and show
     * the login form
     * */
    onClick: function () {

        var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
        var loginWin;

        if (app && app.loginWindow) {
            loginWin = app.loginWindow;
        } else {
            var viewModel = {};
            if (app) {
                viewModel = {
                    tokenName: app.tokenName,
                    serviceUrl: app.authenticationUrl,
                    validateUrl: app.tokenValidationUrl,
                    minimumRequiredRole: app.minimumRequiredRole
                };
            }
            loginWin = Ext.create('CpsiMapview.view.form.Login', {
                viewModel: viewModel
            });
            if (app) {
                app.loginWindow = loginWin;
            }
        }
        loginWin.getController().logout();
        loginWin.show();
    },

    /**
     * Get the user name and roles from the login cookie
     * and return as a formatted string
     * */
    getLoginDetails: function () {

        var me = this;
        var userName = Ext.util.Cookies.get('username');
        var roles = Ext.util.Cookies.get('roles');

        if (roles) {
            roles = roles.split(',');
            var browserRoles = [];

            Ext.Array.each(roles, function (r) {
                if (r.startsWith(me.browserRolePrefix)) {
                    browserRoles.push(r.replace(me.browserRolePrefix, ''));
                }
            });

            roles = browserRoles.join('<br />');
        }
        return Ext.String.format('Username: <b>{0}</b><br />User Roles: <br /><br />{1}', userName, roles);
    },

    /**
     * Init the controller and add listeners to the global
     * login and logout events fired by {@link CpsiMapview.controller.form.Login#login}
     * and {@link CpsiMapview.controller.form.Login#logout}
     * */
    init: function () {

        var me = this;

        Ext.GlobalEvents.on('login', function () {
            me.getViewModel().set('loggedIn', true);
        });

        Ext.GlobalEvents.on('logout', function () {
            me.getViewModel().set('loggedIn', false);
        });
    }

});
