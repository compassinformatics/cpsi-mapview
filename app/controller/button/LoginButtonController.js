/**
 * This class is the controller for the {@link CpsiMapview.view.button.LoginButton}
 */
Ext.define('CpsiMapview.controller.button.LoginButtonController', {
    extend: 'Ext.app.ViewController',

    requires: ['CpsiMapview.view.form.Login'],

    alias: 'controller.cmv_login_button',

    /**
     * The prefix used in the cookie for any browser-based
     * user roles
     * */
    displayRolePrefixes: ['Browser_'],

    /**
     * Logout, clear the login cookie, and show
     * the login form
     * */
    onClick: function () {
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        let loginWin;

        if (app && app.loginWindow) {
            loginWin = app.loginWindow;
        } else {
            let viewModel = {};
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
        const me = this;
        const app = Ext.getApplication
            ? Ext.getApplication()
            : Ext.app.Application.instance;
        const userName = Ext.util.Cookies.get('username');
        let roles = Ext.util.Cookies.get('roles');
        const displayRolePrefixes =
            (app && app.displayRolePrefixes) || me.displayRolePrefixes;
        if (roles) {
            roles = roles.split(',');
            const displayRoles = [];

            Ext.Array.each(roles, function (r) {
                Ext.Array.each(displayRolePrefixes, function (prefix) {
                    if (r.startsWith(prefix)) {
                        displayRoles.push(r.replace(prefix, ''));
                    }
                });
            });

            displayRoles.sort();
            roles = displayRoles.join('<br />');
        }
        return Ext.String.format(
            'Username: <b>{0}</b><br />User Roles: <br /><br />{1}',
            userName,
            roles
        );
    },

    /**
     * Init the controller and add listeners to the global
     * login and logout events fired by {@link CpsiMapview.controller.form.Login#login}
     * and {@link CpsiMapview.controller.form.Login#logout}
     * */
    init: function () {
        const me = this;

        Ext.GlobalEvents.on('login', function () {
            me.getViewModel().set('loggedIn', true);
        });

        Ext.GlobalEvents.on('logout', function () {
            me.getViewModel().set('loggedIn', false);
        });
    }
});
