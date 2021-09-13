Ext.Loader.syncRequire(['GeoExt.form.field.GeocoderComboBox',
    'BasiGX.view.button.Measure', 'CpsiMapview.model.button.MeasureButton']);

describe('CpsiMapview.controller.toolbar.MapTools', function () {

    describe('Basics', function () {
        it('is defined', function () {
            expect(CpsiMapview.controller.toolbar.MapTools).not.to.be(undefined);
        });

        it('can be created', function () {
            var ctrl = new CpsiMapview.controller.toolbar.MapTools();
            expect(ctrl).to.not.be(undefined);
        });

        it('#initializeMeasureBtn', function () {

            var btn = Ext.create('BasiGX.view.button.Measure', {
                measureType: 'line',
                viewModel: 'cmv_btn_measure'
            });

            var ctrl = new CpsiMapview.controller.toolbar.MapTools();
            ctrl.initializeMeasureBtn(btn);
            expect(btn.tooltipStr).to.be('Measure a distance');
        });

        it('#setGazetteerExtent', function () {

            var cmb = Ext.create('GeoExt.form.field.GeocoderComboBox');
            var app = Ext.getApplication ? Ext.getApplication() : Ext.app.Application.instance;
            app.initialExtent = [-906340, 7117235, -741788, 7235818];

            var ctrl = new CpsiMapview.controller.toolbar.MapTools();
            ctrl.setGazetteerExtent(cmb);
            expect(cmb.store.getProxy().getExtraParams().bounded).to.be('1');
        });
    });
});
