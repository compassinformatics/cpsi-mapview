/**
 * When using the expander plugin the maximised window has sometimes been destroyed when this function is called
 * See https://forum.sencha.com/forum/showthread.php?469880-Cannot-read-property-viewModel-of-null for issue and override
 * Bug ID EXTJS-27586
 * See also https://stackoverflow.com/questions/64571571/extjs-27586-cannot-read-property-viewmodel-of-null - not fixed in 7.3
 */
Ext.override(Ext.Base, {
    getConfig: function (name, peek, ifInitialized) {
        const me = this;

        let ret, cfg, propName;
        if (name) {
            cfg = me.self.$config.configs[name];
            if (cfg) {
                propName = me.$configPrefixed ? cfg.names.internal : name;
                // They only want the fully initialized value, not the initial config,
                // but only if it's already present on this instance.
                // They don't want to trigger the initGetter.
                // This form is used by Bindable#updatePublishes to initially publish
                // the properties it's being asked make publishable.
                if (ifInitialized) {
                    ret = Object.prototype.hasOwnProperty.call(propName)
                        ? me[propName]
                        : null;
                } else if (peek) {
                    // Attempt to return the instantiated property on this instance first.
                    // Only return the config object if it has not yet been pulled through
                    // the applier into the instance.
                    ret = Object.prototype.hasOwnProperty.call(propName)
                        ? me[propName]
                        : me.config == null
                          ? null
                          : me.config[name];
                } else {
                    ret = me[cfg.names.get]();
                }
            } else {
                ret = me[name];
            }
        } else {
            ret = me.getCurrentConfig();
        }
        return ret;
    }
});
