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
    }
});
