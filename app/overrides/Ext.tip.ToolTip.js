/**
 * Show tooltips for as long as a user hovers over the relevant item
 * See https://stackoverflow.com/questions/5817074/ext-js-tooltip-to-stay-when-hover-over
 * Overriding here fixes tooltips throughout the application - including grid column titles
 */
Ext.override(Ext.tip.ToolTip, {
    dismissDelay: 0
});
