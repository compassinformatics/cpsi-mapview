Ext.define('CpsiMapview.view.form.Login', {
    extend: 'Ext.window.Window',
    xtype: 'cmv_login_form',

    requires: [
        'CpsiMapview.controller.form.Login'
    ],

    viewModel: {
        serviceUrl: './WebServices/authorization/authenticate',
        validateUrl: './WebServices/authorization/validateToken',
        tokenName: 'token',
        minimumRequiredRole: null
    },

    controller: 'cmv_login_form',
    bodyPadding: 10,
    title: 'Login Window',
    closable: false,
    closeAction: 'hide',
    modal: true,

    items: {
        xtype: 'form',
        border: false,
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: 'Username',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Password',
            allowBlank: false,
            listeners: {
                specialkey: 'onSpecialKey'
            }
        }],
        buttons: [{
            xtype: 'label',
            html: '<a href="/ManagementTool/Account/ForgotPassword" target="_blank">Forgotten Password?</a>'
        }, '->', {
            text: 'Login',
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }
});
