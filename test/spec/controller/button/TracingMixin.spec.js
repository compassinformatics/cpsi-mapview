describe('CpsiMapview.controller.button.TracingMixin', function () {
    Ext.Loader.syncRequire(['CpsiMapview.controller.button.TracingMixin']);

    it('is defined', function () {
        expect(CpsiMapview.controller.button.TracingMixin).not.to.be(undefined);
    });

    it('can be instantiated', function () {
        const inst = Ext.create('CpsiMapview.controller.button.TracingMixin');
        expect(inst).to.be.a(CpsiMapview.controller.button.TracingMixin);
    });
});
