Ext.define('CpsiMapview.view.form.Login', {
    extend: 'Ext.window.Window',
    xtype: 'cmv_login_form',

    requires: [
        'CpsiMapview.controller.form.Login'
    ],

    serviceUrl: 'https://pmstipperarydev.compass.ie/WebServices/authorization/authenticate',
    tokenName: 'pmstoken',

    controller: 'cmv_login_form',
    bodyPadding: 10,
    title: 'Login Window',
    closable: false,
    autoShow: true,
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
            formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }
});
