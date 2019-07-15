/**
 * A toggleable slider which constructs a numeric filter and applies that to
 * associated layers.
 *
 * @class CpsiMapview.view.panel.NumericAttributeSlider
 */
Ext.define('CpsiMapview.view.panel.NumericAttributeSlider', {
    extend: 'Ext.panel.Panel',
    xtype: 'cmv_numericattributeslider',

    requires: [
        'Ext.form.field.Checkbox',
        'Ext.slider.Multi',
        'CpsiMapview.controller.panel.NumericAttributeSlider'
    ],

    controller: 'cmv_numericattributeslider',

    layout: 'hbox',

    config: {
        minValue: 0,
        maxValue: 15,
        currLowerValue: 5,
        currUpperValue: 11,
        increment: 0.5,
        sliderLabel: 'Num. attribute',
        checkboxLabel: 'active?',
        numericField: null, // required, or better at the layer level?
        enabled: true
    },

    /**
     * The CSS class of the slider
     */
    cls: 'cpsi-numeric-attribute-slider',

    /**
     * Construct an instance of the numeric attribute slider. We need to take
     * care of the correct handling of the inherited disabled configuration.
     *
     * @param {object} config The configuration object.
     */
    constructor: function(config) {
        var cfg = config || {};
        var cfgEnabled = cfg.enabled;
        var cfgDisabled = cfg.disabled;
        delete cfg.enabled;
        delete cfg.disabled;

        var hasPassedCfgEnabled = Ext.isDefined(cfgEnabled);
        var hasPassedCfgDisabled = Ext.isDefined(cfgDisabled);

        var finalEnabled = cfgEnabled; // either undefined or user defined

        if (hasPassedCfgEnabled && hasPassedCfgDisabled) {
            // user passed both, ensure they make sense or warn
            if (cfgEnabled !== !cfgDisabled) { // semantically not same
                Ext.Logger.warn('Conflicting disabled/enabled configs found. '
                    + 'NumericAttributeSlider will be using "enabled:'
                    + finalEnabled + '".');
            }
        } else if (hasPassedCfgDisabled) {
            // user passed only disabled, warn and switch to enabled
            finalEnabled = !cfgDisabled;
            Ext.Logger.info('Config option "disabled=' + cfgDisabled + '" passed,'
                + ' transforming to option "enabled=' + finalEnabled + '".');
        } else if (!hasPassedCfgEnabled) {
            // reinitiate the default of this class
            var clazz = CpsiMapview.view.panel.NumericAttributeSlider;
            finalEnabled = clazz.prototype.config.enabled;
        }

        cfg.enabled = finalEnabled;

        this.callParent([cfg]);
    },

    /**
     * Initializes the numeric attribute slider.
     */
    initComponent: function () {
        var me = this;
        var values = [me.getCurrLowerValue(), me.getCurrUpperValue()];
        me.items = [{
            xtype: 'multislider',
            name: 'slider',
            labelAlign: 'right',
            listeners: {
                afterrender: 'initSlider',
                changecomplete: 'applySliderEffects'
            },
            constrainThumbs: false,
            tipText: 'getTipText',
            fieldLabel: me.getSliderLabel(),
            width: 200,
            values: values,
            increment: me.getIncrement(),
            minValue: me.getMinValue(),
            maxValue: me.getMaxValue(),
            disabled: !me.getEnabled()
        },
        {
            xtype: 'checkbox',
            name: 'active',
            boxLabel: me.getCheckboxLabel(),
            checked: me.getEnabled(),
            listeners: {
                change: 'onCheckChange'
            }
        }];

        me.callParent();
    },

    /**
     * Overide the inherited setDisabled, to handle disabling like we would.
     * One might argue that disabling should also actually disable the
     * checkbox, this can be added if agreed upon.
     *
     * @param {boolean} newDisabled
     */
    setDisabled: function(newDisabled) {
        // override the original method and
        // fast forward to checkbox check / uncheck
        var newEnabled = !newDisabled;
        this.setEnabled(newEnabled);
        var cb = this.down('checkbox[name="active"]');
        cb.setValue(newEnabled);
        return this; // the original method is chainable
    }

});
