/**
 * This class is the view model for the LoginButton
 */
Ext.define('CpsiMapview.model.button.LoginButton', {
    extend: 'Ext.app.ViewModel',

    requires: [
        'Ext.util.Cookies'
    ],

    alias: 'viewmodel.cmv_login_button',

    data: {
        loggedIn: false
    },

    formulas: {

        tooltip: function (get) {

            var tooltip = '';
            var me = this;

            if (get('loggedIn')) {
                tooltip = me.getView().getController().getLoginDetails();
            }

            return tooltip;
        },

        glyph: function (get) {
            if (get('loggedIn')) {
                return 'f08b@FontAwesome'; // sign-out icon
            } else {
                return 'f090@FontAwesome'; // sign-in icon
            }
        },

        text: function (get) {
            if (get('loggedIn')) {
                return 'Logout';
            } else {
                return 'Login';
            }
        }
    }

});
