describe('CpsiMapview.form.field.ComboLegacy', function () {

    Ext.Loader.syncRequire(['CpsiMapview.form.field.ComboLegacy']);

    it('is defined', function () {
        expect(CpsiMapview.form.field.ComboLegacy).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        var inst = Ext.create('CpsiMapview.form.field.ComboLegacy');
        expect(inst).to.be.a(CpsiMapview.form.field.ComboLegacy);
    });

});
