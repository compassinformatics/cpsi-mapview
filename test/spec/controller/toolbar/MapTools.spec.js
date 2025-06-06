Ext.Loader.syncRequire([
    'GeoExt.form.field.GeocoderComboBox',
    'BasiGX.view.button.Measure',
    'CpsiMapview.controller.toolbar'
]);

describe('CpsiMapview.controller.toolbar.MapTools', function () {
    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.toolbar.MapTools).not.to.be(
                undefined
            );
        });

        it('can be created', function () {
            const ctrl = new CpsiMapview.controller.toolbar.MapTools();
            expect(ctrl).to.not.be(undefined);
        });

        it('#initializeMeasureBtn', function () {
            const btn = Ext.create('BasiGX.view.button.Measure', {
                measureType: 'line',
                viewModel: 'cmv_btn_measure'
            });

            const ctrl = new CpsiMapview.controller.toolbar.MapTools();
            ctrl.initializeMeasureBtn(btn);
            expect(btn.tooltipStr).to.be('Measure a distance');
        });

        it('#setGazetteerExtent', function () {
            const cmb = Ext.create('GeoExt.form.field.GeocoderComboBox');
            const app = Ext.getApplication
                ? Ext.getApplication()
                : Ext.app.Application.instance;
            app.initialExtent = [-906340, 7117235, -741788, 7235818];

            const ctrl = new CpsiMapview.controller.toolbar.MapTools();
            ctrl.setGazetteerExtent(cmb);
            expect(cmb.store.getProxy().getExtraParams().bounded).to.be('1');
        });
    });
});
