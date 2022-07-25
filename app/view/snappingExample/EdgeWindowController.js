Ext.define('CpsiMapview.view.snappingExample.EdgeWindowController', {
    extend: 'CpsiMapview.controller.window.MinimizableWindow',
    alias: 'controller.cmv_edgewindowcontroller',
    mixins: [
        'CpsiMapview.form.ControllerMixin',
        'CpsiMapview.form.LayersMixin'
    ],
    // we need to add listen in the controller itself rather than in a mixin
    // or the function won't be called
    listen: {
        component: {
            'field': {
                change: 'onFieldChanged' // listen to all field change events to update button
            },
            'cmv_edgewindow': {
                savesucceeded: 'onAfterSaveSucceded'
            }
        }
    },

    /**
     * Function to call prior to saving - confirm with the user that they want to create new nodes
     * */
    beforeSave: function () {

        var me = this;
        var rec = me.getViewModel().get('currentRecord');

        var noStartFeature = false;

        if (!rec.get('startNodeId') && !rec.get('startEdgeId') && !rec.get('startPolygonId')) {
            noStartFeature = true;
            Ext.Msg.confirm('Create new Source', 'No feature is connected at the start of the edge. Are you sure you want to create a new source?',
                function (buttonId) {
                    if (buttonId == 'yes') {
                        // call saveRecord directly as beforeSave returns a value instantly
                        me.saveRecord();
                    }
                });
            return false;
        }

        if (!rec.get('endNodeId') && !rec.get('endEdgeId') && !rec.get('endPolygonId')) {

            if (noStartFeature === true) {
                Ext.Msg.alert('No Attached Features', 'No features are attached at the start or end of this line!');
            }

            Ext.Msg.confirm('Create new Source', 'No feature is connected at the end of the edge. Are you sure you want to create a new source?',
                function (buttonId) {
                    if (buttonId == 'yes') {
                        me.saveRecord();
                    }
                });
            return false;
        }

        return true; // go ahead with the save
    },

    /**
     * Ensure the window is closed so users don't keep reusing the same form to add new edges
     * wiping out previous edges
     * */
    onAfterSaveSucceded: function () {
        var me = this;
        var win = me.getView();
        win.close();
    }
});