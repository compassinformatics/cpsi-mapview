/**
 * Static util class for HTML related operations.
 */
Ext.define('CpsiMapview.util.Html', {
    statics: {
        /**
         * Add events to HTML elements in a cross browser compatible manor.
         *
         * Credits: http://stackoverflow.com/a/21140463
         *
         * @param {DOMElement} htmlElement The element to attach the event to.
         * @param {String} eventName The name of the event to attach.
         * @param {Function} eventFunction The handler for the `eventName` on
         *     the passed `htmlElement`.
         */
        addEvent: function (htmlElement, eventName, eventFunction) {
            if (htmlElement.addEventListener) {
                // Modern
                htmlElement.addEventListener(eventName, eventFunction, false);
            } else if (htmlElement.attachEvent) {
                // Internet Explorer
                htmlElement.attachEvent('on' + eventName, eventFunction);
            } else {
                // others
                htmlElement['on' + eventName] = eventFunction;
            }
        }
    }
});
