/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'CpsiMapview',

    extend: 'CpsiMapview.Application',

    requires: [
        'CpsiMapview.view.main.Main'
    ],

    /**
     * @event mapready
     * Fired when the map of this application is ready.
     * @param {CpsiMapview.view.main.Map} map The Map view of the application.
     */

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'CpsiMapview.view.main.Main'

    //-------------------------------------------------------------------------
    // Most customizations should be made to CpsiMapview.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
