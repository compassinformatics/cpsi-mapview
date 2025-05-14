/**
 * This class is the controller for the {@link CpsiMapview.view.button.PermalinkButton} button.
 */
Ext.define('CpsiMapview.controller.button.PermalinkButtonController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cmv_permalink_button',
    /**
     * Zoom to a permalink
     **/
    onPermalinkClick: function () {
        const me = this;
        const defaultValue = window.location.href;
        const dialogWidth = me.getView().dialogWidth;
        const cfg = {
            prompt: true,
            title: 'Zoom to Permalink',
            minWidth: dialogWidth,
            message: 'Please enter the permalink below:',
            buttons: Ext.Msg.OKCANCEL,
            callback: function (btn, text) {
                if (btn == 'ok') {
                    const map = me.getView().up('cmv_map');
                    const parts = text.split('#map='); // only get the permalink from the URL
                    let permalink = null;

                    if (parts.length === 2) {
                        permalink = parts[1];
                        map.mapCmp.applyState(
                            map.permalinkProvider.readPermalinkHash(permalink)
                        );
                    }
                }
            },
            scope: me,
            multiline: false,
            value: defaultValue
        };

        Ext.Msg.prompt(cfg);
    }
});
