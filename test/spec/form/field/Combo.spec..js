describe('CpsiMapview.form.field.Combo', function () {
    Ext.Loader.syncRequire(['CpsiMapview.form.field.Combo']);

    it('is defined', function () {
        expect(CpsiMapview.form.field.Combo).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        const inst = Ext.create('CpsiMapview.form.field.Combo');
        expect(inst).to.be.a(CpsiMapview.form.field.Combo);
    });
});
