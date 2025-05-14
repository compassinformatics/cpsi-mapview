describe('CpsiMapview.form.RightInfoField', function () {
    Ext.Loader.syncRequire(['CpsiMapview.form.RightInfoField']);

    it('is defined', function () {
        expect(CpsiMapview.form.RightInfoField).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        const inst = Ext.create('CpsiMapview.form.RightInfoField', {
            field: {
                infoIconTooltip: null
            }
        });
        expect(inst).to.be.a(CpsiMapview.form.RightInfoField);
        expect(inst.toolTip).to.be('&nbsp;');
    });

    it('can be instantiated as an xtype', function () {
        const panel = Ext.create('Ext.panel.Panel', {
            items: [
                {
                    xtype: 'cmv_rightinfofield',
                    field: {
                        fieldLabel: 'Name',
                        infoIconTooltip: 'This is a test',
                        xtype: 'textfield'
                    }
                }
            ]
        });

        const infoField = panel.down('cmv_rightinfofield');
        expect(infoField.toolTip).to.be('This is a test');
    });

    it('can update the tooltip', function () {
        Ext.tip.QuickTipManager.init(); // TODO this does not seems to enable tooltips in the tests
        Ext.tip.QuickTipManager.enable();

        const panel = Ext.create('Ext.panel.Panel', {
            items: [
                {
                    xtype: 'cmv_rightinfofield',
                    field: {
                        fieldLabel: 'Name',
                        infoIconTooltip: 'This is a test',
                        xtype: 'textfield'
                    }
                }
            ]
        });

        const infoField = panel.down('cmv_rightinfofield');
        expect(infoField.toolTip).to.be('This is a test');
        infoField.setInfoIconTooltip('Updated');
        expect(infoField.toolTip).to.be('Updated');
    });
});
